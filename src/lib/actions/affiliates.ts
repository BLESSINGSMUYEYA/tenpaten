'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser, requireRole } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function joinAffiliateProgram(prevState: string | undefined, formData: FormData) {
    const sessionUser = await getCurrentUser();

    const bankName = formData.get('bankName') as string;
    const accountName = formData.get('accountName') as string;
    const accountNumber = formData.get('accountNumber') as string;
    const swiftCode = formData.get('swiftCode') as string;
    const rewardType = formData.get('rewardType') as string;

    const idType = formData.get('idType') as string;
    const idNumber = formData.get('idNumber') as string;

    // URLs from client-side Cloudinary uploads
    const idFrontUrl = formData.get('idFrontUrl') as string;
    const idFrontPublicId = formData.get('idFrontPublicId') as string;
    const idFrontName = formData.get('idFrontName') as string;
    const idBackUrl = formData.get('idBackUrl') as string;
    const idBackPublicId = formData.get('idBackPublicId') as string;
    const idBackName = formData.get('idBackName') as string;
    const idSelfieUrl = formData.get('idSelfieUrl') as string;
    const idSelfiePublicId = formData.get('idSelfiePublicId') as string;
    const idSelfieName = formData.get('idSelfieName') as string;
    const countryId = formData.get('countryId') as string;

    if (!bankName || !accountName || !accountNumber) {
        return 'Please fill in all required bank details.';
    }

    if (!countryId) {
        return 'Please select your operating country.';
    }

    if (!idType || !idNumber) {
        return 'Please provide your School ID number.';
    }

    if (!idFrontUrl || !idBackUrl || !idSelfieUrl) {
        return 'Please upload all three ID images (front, back, and selfie).';
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id as string },
            include: { affiliateProfile: true }
        });

        if (!user) return 'User not found.';
        if (user.affiliateProfile) return 'You are already an affiliate.';

        const codeBase = user.fullName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const referralCode = `${codeBase}${randomNum}`;

        await prisma.affiliateProfile.create({
            data: {
                userId: user.id,
                referralCode,
                status: 'PENDING',
                commissionRate: 10.0,
                countryId,
                rewardType: (rewardType as 'CASH' | 'TUITION_DISCOUNT') || 'CASH',
                bankDetails: {
                    bankName,
                    accountName,
                    accountNumber,
                    swiftCode
                }
            }
        });

        // Store all ID documents in User documents
        const currentDocuments = (user.documents as any[]) || [];
        const newDocuments = [
            { label: 'Front of ID', url: idFrontUrl, publicId: idFrontPublicId, name: idFrontName },
            { label: 'Back of ID', url: idBackUrl, publicId: idBackPublicId, name: idBackName },
            { label: 'Selfie with ID', url: idSelfieUrl, publicId: idSelfiePublicId, name: idSelfieName },
        ].map(doc => ({
            type: 'IDENTITY',
            subType: idType,
            label: doc.label,
            number: idNumber,
            url: doc.url,
            publicId: doc.publicId,
            name: doc.name,
            uploadedAt: new Date().toISOString()
        }));

        await prisma.user.update({
            where: { id: user.id },
            data: {
                role: 'AFFILIATE',
                documents: [...currentDocuments, ...newDocuments]
            }
        });

        await logAction(user.id, 'JOIN_AFFILIATE_PROGRAM', { referralCode });

        revalidatePath('/dashboard');
        return 'Application submitted successfully! Your application is pending review.';
    } catch (error) {
        console.error('Failed to join affiliate program:', error);
        return 'Failed to join affiliate program.';
    }
}

export async function updateAffiliateStatus(affiliateId: string, status: 'APPROVED' | 'REJECTED') {
    const user = await requireRole(['SUPER_ADMIN', 'COUNTRY_DIRECTOR']);

    try {
        const affiliate = await prisma.affiliateProfile.update({
            where: { id: affiliateId },
            data: { status },
            include: { user: true }
        });

        await logAction(user.id as string, 'UPDATE_AFFILIATE_STATUS', { affiliateId, status, targetUserId: affiliate.userId });

        // If rejected, maybe revert role from AFFILIATE to PROSPECT?
        if (status === 'REJECTED') {
            await prisma.user.update({
                where: { id: affiliate.userId },
                data: { role: 'PROSPECT' }
            });
        }

        revalidatePath('/dashboard/admin/affiliates');
        revalidatePath(`/dashboard/admin/affiliates/${affiliate.userId}`);
        return 'success';
    } catch (error) {
        console.error('Failed to update affiliate status:', error);
        return 'Failed to update status.';
    }
}
