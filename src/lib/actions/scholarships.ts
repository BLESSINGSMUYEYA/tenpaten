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
    if (!user || (user.role !== 'SCHOOL_ADMIN' && user.role !== 'SCHOOL_SUPER_AGENT' && user.role !== 'SUPER_ADMIN')) {
        return { error: 'Unauthorized' };
    }
    
    const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
    const activeId = user?.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : user?.managedUniversityId;

    // Ensure school admin can only edit their own
    if ((user.role === 'SCHOOL_ADMIN' || user.role === 'SCHOOL_SUPER_AGENT') && activeId !== universityId) {
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
    if (!user || (user.role !== 'SCHOOL_ADMIN' && user.role !== 'SCHOOL_SUPER_AGENT')) return { error: 'Unauthorized' };

    try {
        const program = await prisma.program.findUnique({ where: { id: programId } });
        const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
        const activeId = user?.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : user?.managedUniversityId;

        if (!program || program.universityId !== activeId) {
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
