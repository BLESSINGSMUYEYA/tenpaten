'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { logAction } from '@/lib/audit';

export async function assignSchoolToSuperAgent(superAgentId: string, universityId: string) {
    const actor = await requireRole(['SUPER_ADMIN', 'COUNTRY_DIRECTOR']);

    try {
        // Validate that the target user is indeed a SCHOOL_SUPER_AGENT
        const targetUser = await prisma.user.findUnique({
            where: { id: superAgentId },
            select: { role: true },
        });

        if (!targetUser || targetUser.role !== 'SCHOOL_SUPER_AGENT') {
            return { error: 'Target user is not a Schools Super Agent.' };
        }

        // Fetch university to check country
        const university = await prisma.university.findUnique({
            where: { id: universityId },
            select: { id: true, countryId: true, name: true },
        });

        if (!university) {
            return { error: 'University not found.' };
        }

        // CD security boundary
        if (actor.role === 'COUNTRY_DIRECTOR') {
            const country = await prisma.country.findFirst({
                where: { directorId: actor.id },
                select: { id: true },
            });
            if (!country || university.countryId !== country.id) {
                return { error: 'Unauthorized: You can only assign schools within your managed country.' };
            }
        }

        // Create assignment
        await prisma.schoolSuperAgentUniversity.upsert({
            where: {
                userId_universityId: {
                    userId: superAgentId,
                    universityId,
                },
            },
            update: {},
            create: {
                userId: superAgentId,
                universityId,
            },
        });

        // Audit log
        await logAction(actor.id, 'ASSIGN_SUPER_AGENT_SCHOOL', {
            superAgentId,
            universityId,
            universityName: university.name,
        });

        revalidatePath('/dashboard/admin/users');
        revalidatePath('/dashboard/country-director/universities');

        return { success: true };
    } catch (error) {
        console.error('Failed to assign school to super agent:', error);
        return { error: 'Failed to assign school. Please try again.' };
    }
}

export async function unassignSchoolFromSuperAgent(superAgentId: string, universityId: string) {
    const actor = await requireRole(['SUPER_ADMIN', 'COUNTRY_DIRECTOR']);

    try {
        const university = await prisma.university.findUnique({
            where: { id: universityId },
            select: { id: true, countryId: true, name: true },
        });

        if (!university) {
            return { error: 'University not found.' };
        }

        // CD security boundary
        if (actor.role === 'COUNTRY_DIRECTOR') {
            const country = await prisma.country.findFirst({
                where: { directorId: actor.id },
                select: { id: true },
            });
            if (!country || university.countryId !== country.id) {
                return { error: 'Unauthorized: You can only manage schools within your managed country.' };
            }
        }

        // Delete assignment
        await prisma.schoolSuperAgentUniversity.delete({
            where: {
                userId_universityId: {
                    userId: superAgentId,
                    universityId,
                },
            },
        });

        // Audit log
        await logAction(actor.id, 'UNASSIGN_SUPER_AGENT_SCHOOL', {
            superAgentId,
            universityId,
            universityName: university.name,
        });

        revalidatePath('/dashboard/admin/users');
        revalidatePath('/dashboard/country-director/universities');

        return { success: true };
    } catch (error) {
        console.error('Failed to unassign school from super agent:', error);
        return { error: 'Failed to unassign school.' };
    }
}

export async function getSuperAgentAssignedSchools(superAgentId: string) {
    await requireRole(['SUPER_ADMIN', 'COUNTRY_DIRECTOR']);

    const assignments = await prisma.schoolSuperAgentUniversity.findMany({
        where: { userId: superAgentId },
        include: {
            university: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                },
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    return assignments.map(a => a.university);
}
