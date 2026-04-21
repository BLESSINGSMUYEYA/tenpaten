'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export async function updateReviewData(applicationId: string, reviewData: any) {
    const user = await requireRole(['SCHOOL_ADMIN', 'COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    try {
        await prisma.application.update({
            where: { id: applicationId },
            data: { reviewData }
        });

        revalidatePath(`/dashboard/school/applications/${applicationId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update review data:', error);
        return { error: 'Failed to update review data' };
    }
}
