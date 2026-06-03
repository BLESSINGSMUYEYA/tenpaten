'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export async function getAssignedUniversities() {
    const user = await requireRole('SCHOOL_SUPER_AGENT');

    const assignments = await prisma.schoolSuperAgentUniversity.findMany({
        where: { userId: user.id },
        include: {
            university: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    slug: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    return assignments.map(a => a.university);
}

export async function switchActiveSchool(schoolId: string) {
    const user = await requireRole('SCHOOL_SUPER_AGENT');

    // Verify ownership/assignment
    const assignment = await prisma.schoolSuperAgentUniversity.findUnique({
        where: {
            userId_universityId: {
                userId: user.id,
                universityId: schoolId,
            },
        },
    });

    if (!assignment) {
        throw new Error('Unauthorized: You are not assigned to this school.');
    }

    const cookieStore = await cookies();
    cookieStore.set('active-school-id', schoolId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Revalidate paths to refresh page data
    revalidatePath('/dashboard/school');
    revalidatePath('/dashboard/super-agent');

    return { success: true };
}
