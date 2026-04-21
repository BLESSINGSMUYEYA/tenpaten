import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    props: { params: Promise<{ conversationId: string }> }
) {
    const params = await props.params;
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;

    try {
        // Verify membership
        const membership = await prisma.conversationParticipant.findUnique({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: session.user.id
                }
            }
        });

        if (!membership) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch messages
        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: { id: true, fullName: true, profilePhoto: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
