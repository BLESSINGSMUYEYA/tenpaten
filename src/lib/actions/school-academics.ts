'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// --- Schemas ---

const DepartmentSchema = z.object({
    name: z.string().min(2, 'Department name is required'),
});

const ProgramSchema = z.object({
    name: z.string().min(2, 'Program name is required'),
    description: z.string().optional(),
    level: z.string().min(1, 'Level is required'),
    baseTuition: z.coerce.number().optional(),
    duration: z.string().optional(),
    intake: z.string().optional(),
    requirements: z.string().optional(),
    departmentId: z.string().optional(),
    majors: z.array(z.string()).optional(),
});

// --- Helpers ---

export async function getUniversityManager(targetUniversityId?: string) {
    const session = await auth();
    const user = session?.user as any;

    if (!user) return null;

    const universityId = targetUniversityId || user.managedUniversityId;

    if (!universityId) return null;

    // Permissions check
    if (user.role === 'COUNTRY_DIRECTOR') {
        const country = await prisma.country.findFirst({
            where: { directorId: user.id }
        });
        const university = await prisma.university.findUnique({
            where: { id: universityId }
        });

        if (!country || !university || university.countryId !== country.id) {
            return null;
        }
    } else if (user.role === 'SCHOOL_ADMIN') {
        if (universityId !== user.managedUniversityId) {
            return null;
        }
    } else if (user.role !== 'SUPER_ADMIN') {
        return null;
    }

    return { userId: user.id, universityId };
}

// Deprecated: use getUniversityManager instead
async function getSchoolAdmin() {
    return getUniversityManager();
}

// --- Department Actions ---

export async function createDepartment(data: { name: string }, targetUniversityId?: string) {
    const admin = await getUniversityManager(targetUniversityId);
    if (!admin) return { error: 'Unauthorized' };

    const validated = DepartmentSchema.safeParse(data);
    if (!validated.success) return { error: 'Invalid data' };

    try {
        await prisma.department.create({
            data: {
                name: validated.data.name,
                universityId: admin.universityId,
            }
        });
        revalidatePath('/dashboard/school/programs');
        revalidatePath(`/dashboard/country-director/universities/${admin.universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to create department:', error);
        return { error: 'Failed to create department' };
    }
}

export async function deleteDepartment(departmentId: string) {
    // We need to know which university this department belongs to for permission check
    const dept = await prisma.department.findUnique({
        where: { id: departmentId },
    });

    if (!dept) return { error: 'Department not found' };

    const admin = await getUniversityManager(dept.universityId);
    if (!admin) return { error: 'Unauthorized' };

    try {
        await prisma.department.delete({
            where: { id: departmentId }
        });

        revalidatePath('/dashboard/school/programs');
        revalidatePath(`/dashboard/country-director/universities/${admin.universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete department:', error);
        return { error: 'Failed to delete department' };
    }
}

// --- Program Actions ---

export async function createProgram(data: any, targetUniversityId?: string) {
    const admin = await getUniversityManager(targetUniversityId);
    if (!admin) return { error: 'Unauthorized' };

    const validated = ProgramSchema.safeParse(data);
    if (!validated.success) {
        console.error(validated.error);
        return { error: 'Invalid data' };
    }

    try {
        await prisma.program.create({
            data: {
                ...validated.data,
                universityId: admin.universityId,
            }
        });
        revalidatePath('/dashboard/school/programs');
        revalidatePath(`/dashboard/country-director/universities/${admin.universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to create program:', error);
        return { error: 'Failed to create program' };
    }
}

export async function updateProgram(programId: string, data: any) {
    const prog = await prisma.program.findUnique({
        where: { id: programId },
    });

    if (!prog) return { error: 'Program not found' };

    const admin = await getUniversityManager(prog.universityId);
    if (!admin) return { error: 'Unauthorized' };

    const validated = ProgramSchema.safeParse(data);
    if (!validated.success) return { error: 'Invalid data' };

    try {
        await prisma.program.update({
            where: { id: programId },
            data: validated.data
        });
        revalidatePath('/dashboard/school/programs');
        revalidatePath(`/dashboard/country-director/universities/${admin.universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update program:', error);
        return { error: 'Failed to update program' };
    }
}

export async function deleteProgram(programId: string) {
    const prog = await prisma.program.findUnique({
        where: { id: programId },
    });

    if (!prog) return { error: 'Program not found' };

    const admin = await getUniversityManager(prog.universityId);
    if (!admin) return { error: 'Unauthorized' };

    try {
        await prisma.program.delete({
            where: { id: programId }
        });

        revalidatePath('/dashboard/school/programs');
        revalidatePath(`/dashboard/country-director/universities/${admin.universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete program:', error);
        return { error: 'Failed to delete program' };
    }
}
