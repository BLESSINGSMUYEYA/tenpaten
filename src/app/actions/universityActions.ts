'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function submitUniversityForReview(universityId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    try {
        // 1. Update University Status
        const university = await prisma.university.update({
            where: { id: universityId },
            data: { status: 'PENDING' },
            include: { country: true }
        });

        // 2. Find Country Director
        const country = await prisma.country.findUnique({
            where: { id: university.countryId },
            include: { director: true }
        });

        if (country?.director) {
            // 3. Create Notification for Director
            await prisma.notification.create({
                data: {
                    userId: country.director.id,
                    title: 'New University Registration',
                    message: `${university.name} has submitted their profile for review.`,
                    type: 'ACTION_REQUIRED',
                    link: `/dashboard/country-director/universities/${university.id}`
                }
            });
        }

        revalidatePath('/dashboard/school');
        return { success: true };
    } catch (error) {
        console.error('Failed to submit university:', error);
        return { success: false, error: 'Failed to submit university.' };
    }
}
