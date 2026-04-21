'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { UserDocument, UserDocumentSchema } from '@/lib/definitions';

export async function addUserDocument(
    doc: Omit<UserDocument, 'id' | 'uploadedAt'>
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' };
    }

    const parsed = UserDocumentSchema.omit({ id: true, uploadedAt: true }).safeParse(doc);
    if (!parsed.success) {
        return { success: false, error: 'Invalid document data.' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { documents: true }
        });

        if (!user) return { success: false, error: 'User not found' };

        const currentDocs = (user.documents as unknown as UserDocument[]) || [];

        // Create new document object
        const newDoc: UserDocument = {
            ...doc,
            id: crypto.randomUUID(),
            uploadedAt: new Date().toISOString(),
        };

        // Add to array
        const updatedDocs = [...currentDocs, newDoc];

        await prisma.user.update({
            where: { id: session.user.id },
            data: { documents: updatedDocs as any }
        });

        revalidatePath('/dashboard/student-settings');
        revalidatePath('/dashboard/student-settings');
        revalidatePath('/dashboard/apply');

        return { success: true, document: newDoc };
    } catch (error) {
        console.error('Failed to add document:', error);
        return { success: false, error: 'Failed to save document' };
    }
}

export async function deleteUserDocument(documentId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { documents: true }
        });

        if (!user) return { success: false, error: 'User not found' };

        const currentDocs = (user.documents as unknown as UserDocument[]) || [];
        const updatedDocs = currentDocs.filter(d => d.id !== documentId);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { documents: updatedDocs as any }
        });

        revalidatePath('/dashboard/student-settings');
        revalidatePath('/dashboard/student-settings');
        revalidatePath('/dashboard/apply');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete document:', error);
        return { success: false, error: 'Failed to delete document' };
    }
}
