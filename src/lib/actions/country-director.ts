'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export async function approveUniversity(universityId: string) {
    await requireRole(['COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    try {
        await prisma.university.update({
            where: { id: universityId },
            data: { status: 'APPROVED' }
        });

        revalidatePath('/dashboard/country-director/universities');
        revalidatePath(`/dashboard/country-director/universities/${universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to approve university:', error);
        return { error: 'Failed to approve university' };
    }
}

export async function rejectUniversity(universityId: string, reason: string) {
    await requireRole(['COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    try {
        await prisma.university.update({
            where: { id: universityId },
            data: {
                status: 'REJECTED',
                rejectionReason: reason
            }
        });

        revalidatePath('/dashboard/country-director/universities');
        revalidatePath(`/dashboard/country-director/universities/${universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to reject university:', error);
        return { error: 'Failed to reject university' };
    }
}

export async function approveAffiliate(affiliateId: string) {
    const user = await requireRole(['COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    try {
        await prisma.affiliateProfile.update({
            where: { id: affiliateId },
            data: {
                status: 'APPROVED',
                approvedBy: user.id
            }
        });

        revalidatePath('/dashboard/country-director/affiliates');
        return { success: true };
    } catch (error) {
        console.error('Failed to approve affiliate:', error);
        return { error: 'Failed to approve affiliate' };
    }
}

export async function rejectAffiliate(affiliateId: string) {
    await requireRole(['COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    try {
        await prisma.affiliateProfile.update({
            where: { id: affiliateId },
            data: { status: 'REJECTED' }
        });

        revalidatePath('/dashboard/country-director/affiliates');
        return { success: true };
    } catch (error) {
        console.error('Failed to reject affiliate:', error);
        return { error: 'Failed to reject affiliate' };
    }
}

export async function updateApplicationStatus(applicationId: string, status: any, note?: string) {
    const user = await requireRole(['COUNTRY_DIRECTOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN']);

    try {
        await prisma.$transaction([
            prisma.application.update({
                where: { id: applicationId },
                data: { status }
            }),
            prisma.applicationStatusHistory.create({
                data: {
                    applicationId,
                    status,
                    changedBy: user.id,
                    note
                }
            })
        ]);

        revalidatePath(`/dashboard/country-director/applications/${applicationId}`);
        revalidatePath('/dashboard/country-director/applications');
        return { success: true };
    } catch (error) {
        console.error('Failed to update application status:', error);
        return { error: 'Failed to update application status' };
    }
}

export async function updateAffiliateCommission(affiliateId: string, rate: number) {
    await requireRole(['COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    try {
        await prisma.affiliateProfile.update({
            where: { id: affiliateId },
            data: { commissionRate: rate }
        });

        revalidatePath(`/dashboard/country-director/affiliates/${affiliateId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update commission rate:', error);
        return { error: 'Failed to update commission rate' };
    }
}
