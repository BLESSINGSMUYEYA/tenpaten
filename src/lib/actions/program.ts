'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { getUniversityManager } from './school-academics';

export async function upsertProgram(data: {
    id?: string;
    name: string;
    description?: string;
    duration?: string;
    baseTuition?: number;
    level?: string;
    requirements?: string;
    intake?: string;
    departmentId?: string;
}, targetUniversityId?: string) {
    const admin = await getUniversityManager(targetUniversityId);

    if (!admin) {
        return { error: 'Unauthorized' };
    }
    const universityId = admin.universityId;

    try {
        if (data.id) {
            // Update existing program
            const existing = await prisma.program.findUnique({
                where: { id: data.id },
                select: { universityId: true }
            });

            if (!existing || existing.universityId !== universityId) {
                return { error: 'Program not found or unauthorized' };
            }

            await prisma.program.update({
                where: { id: data.id },
                data: {
                    name: data.name,
                    description: data.description,
                    duration: data.duration,
                    baseTuition: data.baseTuition,
                    level: data.level,
                    requirements: data.requirements,
                    intake: data.intake,
                    departmentId: data.departmentId || null,
                }
            });
        } else {
            // Create new program
            await prisma.program.create({
                data: {
                    name: data.name,
                    description: data.description,
                    duration: data.duration,
                    baseTuition: data.baseTuition,
                    level: data.level,
                    requirements: data.requirements,
                    intake: data.intake,
                    universityId: universityId,
                    departmentId: data.departmentId || null,
                }
            });
        }

        revalidatePath('/dashboard/school/profile');
        revalidatePath(`/dashboard/schools/${universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to upsert program:', error);
        return { error: 'Failed to save program' };
    }
}

export async function deleteProgram(id: string, targetUniversityId?: string) {
    const admin = await getUniversityManager(targetUniversityId);

    if (!admin) {
        return { error: 'Unauthorized' };
    }
    const universityId = admin.universityId;

    try {
        const existing = await prisma.program.findUnique({
            where: { id },
            select: { universityId: true }
        });

        if (!existing || existing.universityId !== universityId) {
            return { error: 'Program not found or unauthorized' };
        }

        await prisma.program.delete({
            where: { id }
        });

        revalidatePath('/dashboard/school/profile');
        revalidatePath(`/dashboard/schools/${universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to delete program:', error);
        return { error: 'Failed to delete program' };
    }
}

export async function bulkAddPrograms(programsData: Array<{
    name: string;
    description?: string;
    duration?: string;
    baseTuition?: number;
    level?: string;
    requirements?: string;
    intake?: string;
    departmentId: string;
}>, targetUniversityId?: string) {
    const admin = await getUniversityManager(targetUniversityId);

    if (!admin) {
        return { error: 'Unauthorized' };
    }
    const universityId = admin.universityId;

    try {
        // Validate departments exist in this university
        const requestedDepartmentIds = programsData.map(p => p.departmentId);
        const existingDepartments = await prisma.department.findMany({
            where: {
                id: { in: requestedDepartmentIds },
                universityId
            }
        });

        const validDeptIds = new Set(existingDepartments.map(d => d.id));
        const invalidDepts = programsData.filter(p => !validDeptIds.has(p.departmentId));

        if (invalidDepts.length > 0) {
            return { error: 'Some programs refer to invalid or unauthorized departments.' };
        }

        await prisma.program.createMany({
            data: programsData.map(p => ({
                name: p.name,
                description: p.description,
                duration: p.duration,
                baseTuition: p.baseTuition,
                level: p.level,
                requirements: p.requirements,
                intake: p.intake,
                departmentId: p.departmentId,
                universityId
            }))
        });

        revalidatePath('/dashboard/school/profile');
        revalidatePath(`/dashboard/school/programs`);
        revalidatePath(`/dashboard/schools/${universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to bulk insert programs:', error);
        return { error: 'Failed to save programs' };
    }
}
