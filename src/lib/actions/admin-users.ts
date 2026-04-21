'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { Role, UserStatus } from '@prisma/client';

export async function deleteUser(userId: string) {
    await requireRole(['SUPER_ADMIN']);

    try {
        // Step 1: Collect application IDs first (needed to delete child records)
        const applications = await prisma.application.findMany({
            where: { prospectId: userId },
            select: { id: true }
        });
        const appIds = applications.map(a => a.id);

        // Step 2: Run deletions as a batch (array form works with PgBouncer)
        const ops: any[] = [
            // Identity/activity records
            prisma.auditLog.deleteMany({ where: { userId } }),
            prisma.notification.deleteMany({ where: { userId } }),

            // Affiliate profile
            prisma.affiliateProfile.deleteMany({ where: { userId } }),

            // Country Director link
            prisma.country.updateMany({
                where: { directorId: userId },
                data: { directorId: null }
            }),

            // Messaging records
            prisma.message.deleteMany({ where: { senderId: userId } }),
            prisma.conversationParticipant.deleteMany({ where: { userId } }),
        ];

        // Application child records
        if (appIds.length > 0) {
            ops.push(
                prisma.applicationStatusHistory.deleteMany({
                    where: { applicationId: { in: appIds } }
                }),
                prisma.application.deleteMany({
                    where: { id: { in: appIds } }
                })
            );
        }

        await prisma.$transaction(ops);

        // Step 3: Delete the user last (all foreign-key references are gone)
        await prisma.user.delete({ where: { id: userId } });

        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { error: 'Failed to delete user' };
    }
}

export async function updateUserStatus(userId: string, status: UserStatus) {
    await requireRole(['SUPER_ADMIN']);

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { status }
        });

        revalidatePath('/dashboard/admin/users');
        revalidatePath(`/dashboard/admin/users/${userId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update user status:', error);
        return { error: 'Failed to update user status' };
    }
}

export async function updateUserRole(userId: string, role: Role, managedCountryId?: string, managedUniversityId?: string) {
    await requireRole(['SUPER_ADMIN']);

    try {
        // Special case: granting affiliate access to a PROSPECT keeps their primary role
        // and instead creates/approves an AffiliateProfile for them (dual-role)
        if (role === 'AFFILIATE') {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });

            if (user?.role === 'PROSPECT') {
                const referralCode = `AFF-${userId.slice(-8).toUpperCase()}`;
                await prisma.affiliateProfile.upsert({
                    where: { userId },
                    create: {
                        userId,
                        referralCode,
                        status: 'APPROVED',
                    },
                    update: {
                        status: 'APPROVED',
                    },
                });

                revalidatePath('/dashboard/admin/users');
                revalidatePath(`/dashboard/admin/users/${userId}`);
                return { success: true };
            }
        }

        // For all other roles, update the primary role directly
        await prisma.user.update({
            where: { id: userId },
            data: {
                role,
                managedCountry: managedCountryId ? { connect: { id: managedCountryId } } : { disconnect: true },
                managedUniversityId: managedUniversityId || null
            }
        });

        revalidatePath('/dashboard/admin/users');
        revalidatePath(`/dashboard/admin/users/${userId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update user role:', error);
        return { error: 'Failed to update user role' };
    }
}
