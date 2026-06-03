'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function upsertDepartment(data: {
    id?: string;
    name: string;
}) {
    const session = await auth();
    const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
    const universityId = (session?.user as any)?.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : (session?.user as any)?.managedUniversityId;

    if (!session?.user || ((session.user as any).role !== 'SCHOOL_ADMIN' && (session.user as any).role !== 'SCHOOL_SUPER_AGENT') || !universityId) {
        return { error: 'Unauthorized' };
    }

    try {
        if (data.id) {
            // Update
            const existing = await prisma.department.findUnique({
                where: { id: data.id },
                select: { universityId: true }
            });

            if (!existing || existing.universityId !== universityId) {
                return { error: 'Department not found or unauthorized' };
            }

            await prisma.department.update({
                where: { id: data.id },
                data: { name: data.name }
            });
        } else {
            // Create
            await prisma.department.create({
                data: {
                    name: data.name,
                    universityId: universityId
                }
            });
        }

        revalidatePath('/dashboard/school/profile');
        return { success: true };
    } catch (error) {
        console.error('Failed to upsert department:', error);
        return { error: 'Failed to save department' };
    }
}

export async function deleteDepartment(id: string) {
    const session = await auth();
    const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
    const universityId = (session?.user as any)?.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : (session?.user as any)?.managedUniversityId;

    if (!session?.user || ((session.user as any).role !== 'SCHOOL_ADMIN' && (session.user as any).role !== 'SCHOOL_SUPER_AGENT') || !universityId) {
        return { error: 'Unauthorized' };
    }

    try {
        const existing = await prisma.department.findUnique({
            where: { id },
            select: { universityId: true }
        });

        if (!existing || existing.universityId !== universityId) {
            return { error: 'Department not found or unauthorized' };
        }

        // Check if there are programs linked to this department
        const programCount = await prisma.program.count({
            where: { departmentId: id }
        });

        if (programCount > 0) {
            return { error: 'Cannot delete department with existing programs. Please reassign programs first.' };
        }

        await prisma.department.delete({
            where: { id }
        });

        revalidatePath('/dashboard/school/profile');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete department:', error);
        return { error: 'Failed to delete department' };
    }
}
