'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { pusherServer } from '@/lib/pusher';
import { createNotification } from '../notifications';

const SendMessageSchema = z.object({
    conversationId: z.string().nullish().transform(v => v ?? undefined),
    recipientId: z.string().nullish().transform(v => v ?? undefined),
    content: z.string().min(1, "Message cannot be empty"),
});

export async function sendMessage(prevState: any, formData: FormData) {
    let user: any;
    try {
        user = await getCurrentUser();
    } catch {
        return { error: 'Unauthorized. Please log in again.' };
    }

    const rawData = {
        conversationId: formData.get('conversationId') || undefined,
        recipientId: formData.get('recipientId') || undefined,
        content: formData.get('content') as string,
    };

    const validatedFields = SendMessageSchema.safeParse(rawData);

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten();
        return { error: errors.fieldErrors.content?.[0] || errors.formErrors[0] || 'Validation failed' };
    }

    const { conversationId, recipientId, content } = validatedFields.data;

    try {
        let targetConversationId = conversationId;

        // If no conversationId, check if one exists or create new
        if (!targetConversationId && recipientId) {
            // Check for existing conversation with these 2 participants
            // This is complex in Prisma (filtering by multiple participants). 
            // Simplified: Find common conversation.

            // For now, let's just create a new one or find strict 1-on-1 if optimization needed
            // A simple approach:
            const existing = await prisma.conversation.findFirst({
                where: {
                    AND: [
                        { participants: { some: { userId: user.id } } },
                        { participants: { some: { userId: recipientId } } }
                    ]
                }
            });

            if (existing) {
                targetConversationId = existing.id;
            } else {
                // Create new
                const newConv = await prisma.conversation.create({
                    data: {
                        participants: {
                            create: [
                                { userId: user.id },
                                { userId: recipientId }
                            ]
                        }
                    }
                });
                targetConversationId = newConv.id;
            }
        }

        if (!targetConversationId) {
            return { error: "Could not determine conversation." };
        }

        // Verify membership
        const membership = await prisma.conversationParticipant.findUnique({
            where: {
                conversationId_userId: {
                    conversationId: targetConversationId,
                    userId: user.id
                }
            }
        });

        if (!membership) {
            return { error: "You are not a participant in this conversation." };
        }

        // Create message
        const newMessage = await prisma.message.create({
            data: {
                conversationId: targetConversationId,
                senderId: user.id,
                content: content
            },
            include: {
                sender: {
                    select: { id: true, fullName: true, profilePhoto: true }
                }
            }
        });

        // 1. Trigger Pusher Event for Real-time Chat (fire-and-forget, never block the response)
        if (pusherServer) {
            Promise.race([
                pusherServer.trigger(`conversation-${targetConversationId}`, 'new-message', newMessage),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Pusher timeout')), 2000))
            ]).catch(err => console.warn('Pusher chat event skipped:', err.message));
        }

        // 2. Trigger In-App Notification for Recipient
        try {
            const otherParticipant = await prisma.conversationParticipant.findFirst({
                where: {
                    conversationId: targetConversationId,
                    userId: { not: user.id }
                }
            });

            if (otherParticipant) {
                await createNotification(
                    otherParticipant.userId,
                    'New Message',
                    `${newMessage.sender.fullName || 'Someone'} sent you a message: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                    'INFO',
                    `/dashboard/messages?id=${targetConversationId}`
                );
            }
        } catch (notifError) {
            console.error("Failed to send new message notification:", notifError);
        }

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: targetConversationId },
            data: { updatedAt: new Date() }
        });

        revalidatePath('/dashboard/messages');
        return { success: true, conversationId: targetConversationId, message: newMessage };

    } catch (error) {
        console.error("Failed to send message:", error);
        return { error: "Failed to send message." };
    }
}

export interface ConversationSummary {
    id: string;
    otherUser: {
        id: string;
        fullName: string | null;
        profilePhoto?: string | null;
        role?: string;
    };
    lastMessage: {
        content: string;
        createdAt: Date;
        senderId: string;
    } | null;
    updatedAt: Date;
    isUnread: boolean;
}

export async function getConversations(): Promise<ConversationSummary[]> {
    const user = await getCurrentUser();

    try {
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { 
                        userId: user.id,
                        deletedAt: null // Only show active participant records
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, fullName: true, email: true, profilePhoto: true, role: true }
                        }
                    }
                },
                messages: {
                    where: { deletedAt: null }, // Only consider non-deleted messages
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Format for UI
        return conversations.map(c => {
            const otherParticipants = (c.participants as any[]).filter((p: any) => p.userId !== user.id);
            const otherUser = otherParticipants[0]?.user;
            const lastMessage = c.messages[0];

            // My read status
            const myParticipant = (c.participants as any[]).find((p: any) => p.userId === user.id);
            const isUnread = lastMessage ? new Date(lastMessage.createdAt) > new Date(myParticipant?.lastReadAt || 0) : false;

            return {
                id: c.id,
                otherUser: otherUser || { fullName: 'Unknown User' },
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId
                } : null,
                updatedAt: c.updatedAt,
                isUnread
            };
        });

    } catch (error) {
        console.error("Failed to get conversations:", error);
        return [];
    }
}

export async function getMessages(conversationId: string) {
    const user = await getCurrentUser();

    // Check membership
    const membership = await prisma.conversationParticipant.count({
        where: { conversationId, userId: user.id }
    });

    if (!membership) return [];

    const messages = await prisma.message.findMany({
        where: { 
            conversationId,
            deletedAt: null // Soft-delete filter
        },
        include: {
            sender: {
                select: { id: true, fullName: true, profilePhoto: true }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    return messages;
}

/**
 * Message Soft-Deletion
 */
export async function deleteMessage(messageId: string) {
    const user = await getCurrentUser();

    try {
        const message = await prisma.message.findUnique({
            where: { id: messageId }
        });

        if (!message || message.senderId !== user.id) {
            return { error: "Unauthorized or message not found." };
        }

        await prisma.message.update({
            where: { id: messageId },
            data: { deletedAt: new Date() }
        });

        revalidatePath('/dashboard/messages');
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete message." };
    }
}

/**
 * Conversation Soft-Deletion (Leaver logic)
 */
export async function deleteConversation(conversationId: string) {
    const user = await getCurrentUser();

    try {
        await prisma.conversationParticipant.update({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: user.id
                }
            },
            data: { deletedAt: new Date() }
        });

        revalidatePath('/dashboard/messages');
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete conversation." };
    }
}

/**
 * Role-Based User Discovery for Messaging
 * Forces anti-spam controls as requested.
 */
export async function getContactableUsers() {
    const user = await getCurrentUser();
    if (!user) return [];

    try {
        if (user.role === 'PROSPECT') {
            // Students can only message staff of universities they applied to
            const myApplications = await prisma.application.findMany({
                where: { prospectId: user.id },
                include: { 
                    program: { 
                        include: { 
                            university: { 
                                include: { 
                                    admins: {
                                        select: { id: true, fullName: true, profilePhoto: true, role: true, email: true }
                                    } 
                                } 
                            } 
                        } 
                    } 
                }
            });

            const admins = myApplications.flatMap(app => app.program.university.admins);
            // Deduplicate
            const uniqueAdmins = Array.from(new Map(admins.map(a => [a.id, a])).values());
            return uniqueAdmins;
        }

        if (user.role === 'SCHOOL_ADMIN') {
            // Staff can message their applicants
            const myUniversity = await prisma.university.findFirst({
                where: { admins: { some: { id: user.id } } }
            });

            if (!myUniversity) return [];

            const applicants = await prisma.application.findMany({
                where: { program: { universityId: myUniversity.id } },
                include: { 
                    prospect: {
                        select: { id: true, fullName: true, profilePhoto: true, role: true, email: true }
                    } 
                }
            });

            const prospects = applicants.map(app => app.prospect);
            return Array.from(new Map(prospects.map(p => [p.id, p])).values());
        }

        if (user.role === 'COUNTRY_DIRECTOR' || user.role === 'SUPER_ADMIN') {
            // Directors can message anyone (high trust role)
            return await prisma.user.findMany({
                where: { id: { not: user.id } },
                select: { id: true, fullName: true, profilePhoto: true, role: true, email: true },
                take: 50
            });
        }

        return [];
    } catch (error) {
        console.error("Failed to fetch contactable users:", error);
        return [];
    }
}

export async function markAsRead(conversationId: string) {
    const user = await getCurrentUser();

    try {
        await prisma.conversationParticipant.update({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: user.id
                }
            },
            data: { lastReadAt: new Date() }
        });
        revalidatePath('/dashboard/messages');
    } catch (error) {
        // Ignore error if not found
    }
}

export async function getOrCreateConversation(recipientId: string) {
    const user = await getCurrentUser();
    console.log('getOrCreateConversation called for recipientId:', recipientId);
    if (!user) {
        console.log('User not found in session');
        throw new Error("Unauthorized");
    }
    console.log('Current user ID:', user.id);

    try {
        if (user.id === recipientId) {
            console.log('User tried to message themselves:', user.id);
            throw new Error("You cannot send messages to yourself.");
        }

        // Check for existing 1-on-1 conversation
        const existing = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId: user.id } } },
                    { participants: { some: { userId: recipientId } } }
                ]
                // Note: In a production app, we would also verify that ONLY these two are participants
                // to distinguish from group chats, but here we only have 1-on-1.
            }
        });

        if (existing) {
            console.log('Found existing conversation:', existing.id);
            return { conversationId: existing.id };
        }

        console.log('Creating new conversation between:', user.id, 'and', recipientId);
        // Create new
        const newConv = await prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: user.id },
                        { userId: recipientId }
                    ]
                }
            }
        });

        console.log('New conversation created:', newConv.id);
        return { conversationId: newConv.id };
    } catch (error: any) {
        console.error("DANGER_ZONE: Failed to get/create conversation details:", {
            error: error.message,
            stack: error.stack,
            userId: user?.id,
            recipientId
        });
        throw new Error(`Failed to initiate conversation: ${error.message}`);
    }
}
