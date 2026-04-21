'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { createCheckoutLink, verifyTransaction } from '@/lib/paychangu';
import { headers } from 'next/headers';

const PLATFORM_FEE_PERCENTAGE = 0.1; // 10%

export async function initiateApplicationPayment(applicationId: string) {
    const user = await requireRole('PROSPECT');

    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                program: {
                    include: {
                        university: true
                    }
                },
                affiliate: true // Include affiliate if present
            }
        });

        if (!application || application.prospectId !== user.id) {
            return { error: 'Application not found or unauthorized.' };
        }

        const university = application.program.university;
        const feeAmount = university.applicationFeeAmount;

        if (!feeAmount || feeAmount <= 0) {
            return { success: true, noPaymentRequired: true };
        }

        // Check for existing PENDING transaction to avoid duplicates
        const existingTransaction = await prisma.institutionalTransaction.findFirst({
            where: {
                applicationId: application.id,
                status: 'PENDING',
                type: 'APPLICATION_FEE'
            }
        });

        let transaction = existingTransaction;
        let referenceId = existingTransaction?.referenceId;

        if (!transaction) {
            // Calculate breakdown
            const platformFeeAmount = Number((feeAmount * PLATFORM_FEE_PERCENTAGE).toFixed(2));
            
            // Calculate affiliate commission if application has an affiliate
            let affiliateAmount = 0;
            let affiliateId = null;
            
            if (application.affiliate) {
                const commissionRate = application.affiliate.commissionRate || 10.0;
                affiliateAmount = Number((feeAmount * (commissionRate / 100)).toFixed(2));
                affiliateId = application.affiliateId;
            }

            const schoolAmount = Number((feeAmount - platformFeeAmount - affiliateAmount).toFixed(2));
            referenceId = `TEN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

            transaction = await prisma.institutionalTransaction.create({
                data: {
                    userId: user.id as string,
                    universityId: university.id,
                    applicationId: application.id,
                    affiliateId: affiliateId,
                    totalAmount: feeAmount,
                    platformFee: platformFeeAmount,
                    affiliateAmount: affiliateAmount,
                    schoolAmount: schoolAmount,
                    currency: university.applicationFeeCurrency,
                    status: 'PENDING',
                    type: 'APPLICATION_FEE',
                    referenceId: referenceId as string,
                }
            });
        } else {
            // If we have an existing pending transaction, generate a NEW referenceId 
            // for this checkout attempt to avoid "tx_ref already used" errors from PayChangu
            referenceId = `TEN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            transaction = await prisma.institutionalTransaction.update({
                where: { id: transaction.id },
                data: { referenceId: referenceId as string }
            });
        }

        // Try to generate real PayChangu link if keys are configured
        let checkoutUrl = null;
        const isGatewayConfigured = !!process.env.PAYCHANGU_SECRET_KEY;

        if (isGatewayConfigured) {
            const host = (await headers()).get('host');
            // Improved protocol detection for local development (supports 127.0.0.1, localhost, etc.)
            const isLocal = host?.includes('localhost') || host?.includes('127.0.0.1') || host?.includes('[::1]');
            const protocol = isLocal ? 'http' : (await headers()).get('x-forwarded-proto') || 'https';
            const baseUrl = `${protocol}://${host}`;

            const dbUser = await prisma.user.findUnique({
                where: { id: user.id }
            });

            const linkResult = await createCheckoutLink({
                amount: feeAmount,
                currency: university.applicationFeeCurrency,
                email: user.email as string,
                first_name: dbUser?.fullName?.split(' ')[0] || 'Student',
                last_name: dbUser?.fullName?.split(' ')[1] || 'User',
                tx_ref: referenceId,
                callback_url: `${baseUrl}/api/payments/paychangu/callback`,
                return_url: `${baseUrl}/dashboard/applications/${application.id}?payment=success`,
            });

            if (linkResult.success) {
                checkoutUrl = linkResult.checkout_url;
            } else {
                return { error: `Gateway Error: ${linkResult.error}` };
            }
        }

        return { 
            success: true, 
            transactionId: transaction.id, 
            referenceId: transaction.referenceId, 
            totalAmount: transaction.totalAmount, 
            currency: transaction.currency,
            isGatewayConfigured,
            breakdown: {
                platformFee: transaction.platformFee,
                schoolAmount: transaction.schoolAmount,
                affiliateAmount: transaction.affiliateAmount,
            },
            checkoutUrl 
        };
    } catch (error) {
        console.error('Failed to initiate payment:', error);
        return { error: 'Failed to initiate payment process.' };
    }
}

export async function forceVerifyTransaction(transactionId: string) {
    const user = await requireRole('PROSPECT');

    try {
        const transaction = await prisma.institutionalTransaction.findUnique({
            where: { id: transactionId },
            include: { application: true }
        });

        if (!transaction || transaction.userId !== user.id) {
            return { error: 'Transaction not found or unauthorized.' };
        }

        if (transaction.status === 'SUCCESS') {
            return { success: true, alreadyProcessed: true };
        }

        const verification = await verifyTransaction(transaction.referenceId);

        if (verification.status === 'success' && (verification.data.status === 'success' || verification.data.status === 'completed')) {
             // Update database
             await prisma.$transaction([
                prisma.institutionalTransaction.update({
                    where: { id: transaction.id },
                    data: { 
                        status: 'SUCCESS',
                        gatewayReference: verification.data.reference || verification.data.id?.toString()
                    }
                }),
                prisma.application.update({
                    where: { id: transaction.applicationId! },
                    data: { status: 'SUBMITTED' }
                }),
                prisma.applicationStatusHistory.create({
                    data: {
                        applicationId: transaction.applicationId!,
                        status: 'SUBMITTED',
                        changedBy: transaction.userId,
                        note: 'Application manually verified and submitted after PayChangu check.',
                    }
                })
            ]);
            revalidatePath(`/dashboard/applications/${transaction.applicationId}`);
            return { success: true };
        }

        return { error: 'Payment could not be verified yet. If you have paid, please wait a few minutes or contact support.' };
    } catch (error) {
        console.error('Failed to verify transaction:', error);
        return { error: 'Failed to verify payment status.' };
    }
}

export async function simulatePaymentSuccess(transactionId: string) {
    const user = await requireRole('PROSPECT');

    try {
        const transaction = await prisma.institutionalTransaction.findUnique({
            where: { id: transactionId },
            include: { application: true }
        });

        if (!transaction || transaction.userId !== user.id) {
            return { error: 'Transaction not found or unauthorized.' };
        }

        if (transaction.status !== 'PENDING') {
            return { error: 'Transaction is already processed.' };
        }

        // Update transaction and application in a transaction
        await prisma.$transaction([
            prisma.institutionalTransaction.update({
                where: { id: transactionId },
                data: { 
                    status: 'SUCCESS',
                    gatewayReference: `MOCK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                }
            }),
            prisma.application.update({
                where: { id: transaction.applicationId! },
                data: { status: 'SUBMITTED' }
            }),
            prisma.applicationStatusHistory.create({
                data: {
                    applicationId: transaction.applicationId!,
                    status: 'SUBMITTED',
                    changedBy: user.id as string,
                    note: 'Application submitted after successful payment (Simulated).',
                }
            })
        ]);

        revalidatePath(`/dashboard/applications/${transaction.applicationId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to simulate payment success:', error);
        return { error: 'Failed to process payment simulation.' };
    }
}
