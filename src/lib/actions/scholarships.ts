'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateGlobalScholarshipSettings(
    active: boolean, 
    percentage: number | null,
    universityId: string
) {
    const session = await auth();
    const user = session?.user as any;
    if (!user || (user.role !== 'SCHOOL_ADMIN' && user.role !== 'SUPER_ADMIN')) {
        return { error: 'Unauthorized' };
    }
    
    // Ensure school admin can only edit their own
    if (user.role === 'SCHOOL_ADMIN' && user.managedUniversityId !== universityId) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.university.update({
            where: { id: universityId },
            data: {
                globalScholarshipActive: active,
                globalScholarshipPercentage: percentage,
            }
        });
        
        revalidatePath('/dashboard/school/scholarships');
        revalidatePath('/dashboard/(student)/colleges');
        return { success: true };
    } catch (e) {
        return { error: 'Failed to update scholarship settings' };
    }
}

export async function toggleProgramExemption(programId: string, exclude: boolean) {
    const session = await auth();
    const user = session?.user as any;
    if (!user || user.role !== 'SCHOOL_ADMIN') return { error: 'Unauthorized' };

    try {
        const program = await prisma.program.findUnique({ where: { id: programId } });
        if (!program || program.universityId !== user.managedUniversityId) {
            return { error: 'Unauthorized' };
        }

        await prisma.program.update({
            where: { id: programId },
            data: { excludeFromGlobalScholarship: exclude }
        });
        
        revalidatePath('/dashboard/school/scholarships');
        revalidatePath('/dashboard/(student)/colleges');
        return { success: true };
    } catch(e) {
        return { error: 'Failed to toggle exemption' };
    }
}
