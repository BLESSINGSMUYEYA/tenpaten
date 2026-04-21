'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function inviteStudentToApply(studentId: string, universityId: string, programId?: string) {
    const user = await requireRole(['SCHOOL_ADMIN', 'SUPER_ADMIN']);
    
    try {
        // Verify school ownership if not super admin
        if (user.role === 'SCHOOL_ADMIN') {
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { managedUniversityId: true }
            });
            if (dbUser?.managedUniversityId !== universityId) {
                throw new Error('Unauthorized');
            }
        }

        const university = await prisma.university.findUnique({
            where: { id: universityId },
            select: { name: true }
        });

        if (!university) throw new Error('University not found');

        // Create notification for the student
        await prisma.notification.create({
            data: {
                userId: studentId,
                title: 'University Invitation!',
                message: `${university.name} has reviewed your profile and would like to invite you to apply for their programs!`,
                type: 'INVITATION',
                link: programId ? `/dashboard/colleges?programId=${programId}` : '/dashboard/colleges',
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to invite student:', error);
        return { error: 'Failed to send invitation' };
    }
}

export async function getDiscoverableStudents(universityId: string) {
    const user = await requireRole(['SCHOOL_ADMIN', 'SUPER_ADMIN']);

    try {
        // Get students who have completed at least 50% of their profile
        // and have not applied to this university yet
        const students = await prisma.user.findMany({
            where: {
                role: 'PROSPECT',
                // Profile must be partially complete
                academicInfo: { not: Prisma.JsonNull },
                // Not already applied to this university
                applications: {
                    none: {
                        program: {
                            universityId: universityId
                        }
                    }
                }
            } as any, // Cast to any to bypass complex Prisma JSON types for now
            select: {
                id: true,
                fullName: true,
                email: true,
                academicInfo: true,
                personalInfo: true,
                createdAt: true,
                residenceCountry: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return students;
    } catch (error) {
        console.error('Failed to fetch discoverable students:', error);
        return [];
    }
}
