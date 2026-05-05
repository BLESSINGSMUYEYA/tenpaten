'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { createNotification } from '../notifications';
import { sendApplicationStatusEmail } from '../email-templates';
import { pusherServer } from '../pusher';
import { cookies } from 'next/headers';

export async function submitApplication(prevState: string | undefined, formData: FormData) {
    const user = await requireRole('PROSPECT'); // Security check

    const programId = formData.get('programId') as string;
    let referralCode = formData.get('referralCode') as string;

    // Fallback to cookie if no code provided
    if (!referralCode) {
        const cookieStore = await cookies();
        referralCode = cookieStore.get('tenpaten_ref')?.value || '';
    }

    if (!programId) {
        return 'Please select a program.';
    }

    try {
        let affiliateId: string | undefined;

        if (referralCode) {
            const affiliate = await prisma.affiliateProfile.findUnique({
                where: { referralCode },
            });
            if (affiliate) {
                affiliateId = affiliate.id;
            } else {
                return 'Invalid referral code.';
            }
        }

        const application = await prisma.application.create({
            data: {
                prospectId: user.id as string,
                programId,
                affiliateId,
                status: 'SUBMITTED',
            }
        });

        await prisma.applicationStatusHistory.create({
            data: {
                applicationId: application.id,
                status: 'SUBMITTED',
                changedBy: user.id as string,
                note: 'Application submitted by prospect.',
            }
        });

        await logAction(user.id as string, 'SUBMIT_APPLICATION', { applicationId: application.id, programId });

        // Automated Communication
        try {
            const program = await prisma.program.findUnique({
                where: { id: programId },
                include: { university: { include: { admins: true } } }
            });

            const detailedUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { fullName: true }
            });

            if (program && detailedUser) {
                // 1. Notify Admins (In-App)
                for (const admin of program.university.admins) {
                    await createNotification(
                        admin.id,
                        'New Application Received',
                        `A new application has been submitted for ${program.name} from ${detailedUser.fullName}.`,
                        'INFO',
                        `/dashboard/school/applications/${application.id}`
                    );
                }

                // 2. Start Chat Conversation
                const schoolAdmin = program.university.admins[0];
                if (schoolAdmin) {
                    let conversation = await prisma.conversation.findFirst({
                        where: {
                            AND: [
                                { participants: { some: { userId: user.id } } },
                                { participants: { some: { userId: schoolAdmin.id } } }
                            ]
                        }
                    });

                    if (!conversation) {
                        conversation = await prisma.conversation.create({
                            data: {
                                participants: {
                                    create: [
                                        { userId: user.id },
                                        { userId: schoolAdmin.id }
                                    ]
                                }
                            }
                        });
                    }

                    await prisma.message.create({
                        data: {
                            conversationId: conversation.id,
                            senderId: schoolAdmin.id,
                            content: `Hello ${detailedUser.fullName}! Thank you for your application to the ${program.name} program at ${program.university.name}. We have received your application and will be reviewing it shortly.`
                        }
                    });

                    await prisma.conversation.update({
                        where: { id: conversation.id },
                        data: { updatedAt: new Date() }
                    });
                }
            }
        } catch (msgError) {
            console.error('Failed to initiate automated communication:', msgError);
        }

        // 3. Real-time Pusher Notification for Admin Feed
        try {
            const program = await prisma.program.findUnique({
                where: { id: programId },
                select: { universityId: true, name: true }
            });
            if (program) {
                await pusherServer.trigger(`university-${program.universityId}`, 'new-activity', {
                    type: 'NEW_APPLICATION',
                    message: `New application for ${program.name}`,
                    timestamp: new Date(),
                });
            }
        } catch (pError) {
            console.error('Pusher trigger failed:', pError);
        }

        return 'success';

    } catch (error) {
        console.error('Submission error:', error);
        return 'Failed to submit application.';
    }
}

export async function updateApplicationStatus(id: string, newStatus: string, note?: string) {
    // Both School Admins and Country Directors can update status (in simplified model)
    const user = await requireRole(['SCHOOL_ADMIN', 'COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    try {
        const application = await prisma.application.update({
            where: { id },
            data: { status: newStatus as any },
            include: { prospect: true, program: true }
        });

        await prisma.applicationStatusHistory.create({
            data: {
                applicationId: id,
                status: newStatus as any,
                changedBy: user.id as string,
                note: note || `Status updated to ${newStatus}`,
            }
        });

        await logAction(user.id as string, 'UPDATE_APPLICATION_STATUS', { applicationId: id, newStatus });

        const statusLabels: Record<string, string> = {
            DRAFT: 'Draft', PAYMENT_PENDING: 'Payment Pending', SUBMITTED: 'Submitted',
            COUNTRY_REVIEW: 'Under Country Review', UNIVERSITY_REVIEW: 'Under University Review',
            OFFER_ISSUED: 'Offer Issued 🎉', OFFER_ACCEPTED: 'Offer Accepted',
            ENROLLED: 'Enrolled 🏆', REJECTED: 'Not Accepted',
        };
        const statusLabel = statusLabels[newStatus] || newStatus.replace(/_/g, ' ');
        const isPositive = ['OFFER_ISSUED', 'OFFER_ACCEPTED', 'ENROLLED'].includes(newStatus);
        const isNegative = newStatus === 'REJECTED';
        const notifType = isPositive ? 'SUCCESS' : isNegative ? 'ERROR' : 'INFO';

        // 1. Notify Student
        const studentMessages: Record<string, string> = {
            OFFER_ISSUED: `Congratulations! You have received an offer for ${application.program.name}. Log in to review and accept your offer.`,
            ENROLLED: `You are now enrolled in ${application.program.name}. Welcome to your future!`,
            REJECTED: `Your application for ${application.program.name} was not accepted. Don't give up — explore other universities!`,
            COUNTRY_REVIEW: `Your ${application.program.name} application is now under country review.`,
            UNIVERSITY_REVIEW: `Your ${application.program.name} application has moved to university review.`,
        };
        createNotification(
            application.prospectId,
            `Application Update: ${statusLabel}`,
            studentMessages[newStatus] || `Your ${application.program.name} application has been updated to "${statusLabel}".`,
            notifType,
            `/dashboard/applications/${application.id}`
        ).catch(e => console.error('Student notification failed:', e));

        // 2. Notify School Admin when CD/Admin changes status
        if (['COUNTRY_DIRECTOR', 'SUPER_ADMIN'].includes(user.role as string)) {
            prisma.user.findFirst({ where: { managedUniversityId: application.program.universityId } }).then(admin => {
                if (admin) createNotification(
                    admin.id,
                    `Application Updated by ${user.role === 'SUPER_ADMIN' ? 'Admin' : 'Country Director'}`,
                    `${application.prospect.fullName}'s application for ${application.program.name} → "${statusLabel}"`,
                    'INFO',
                    `/dashboard/school/applications/${application.id}`
                ).catch(console.error);
            }).catch(console.error);
        }

        // 3. Notify Country Director when School Admin changes status
        if (user.role === 'SCHOOL_ADMIN') {
            prisma.country.findFirst({
                where: { universities: { some: { id: application.program.universityId } } },
                include: { director: true }
            }).then(country => {
                if (country?.director) createNotification(
                    country.director.id,
                    `Application Status Change`,
                    `${application.program.name} — ${application.prospect.fullName} → "${statusLabel}"`,
                    'INFO',
                    `/dashboard/country-director/applications`
                ).catch(console.error);
            }).catch(console.error);
        }

        // 4. Send automated status chat message in existing student↔school conversation
        try {
            const schoolAdmin = await prisma.user.findFirst({
                where: { managedUniversityId: application.program.universityId }
            });
            if (schoolAdmin) {
                const conversation = await prisma.conversation.findFirst({
                    where: {
                        AND: [
                            { participants: { some: { userId: application.prospectId } } },
                            { participants: { some: { userId: schoolAdmin.id } } }
                        ]
                    }
                });
                if (conversation) {
                    const chatMessages: Record<string, string> = {
                        OFFER_ISSUED: `🎉 Great news, ${application.prospect.fullName}! We're pleased to offer you a place in ${application.program.name}. Please log in to review and accept your offer.`,
                        ENROLLED: `🏆 Congratulations on your enrollment! We look forward to welcoming you.`,
                        REJECTED: `Thank you for applying to ${application.program.name}. After careful review, we're unable to offer you a place. We encourage you to explore other programs.`,
                    };
                    await prisma.message.create({
                        data: {
                            conversationId: conversation.id,
                            senderId: schoolAdmin.id,
                            content: chatMessages[newStatus] || `📢 Your application for ${application.program.name} has moved to "${statusLabel}".`
                        }
                    });
                    await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
                }
            }
        } catch (msgError) {
            console.error('Failed to send status update message:', msgError);
        }

        await sendApplicationStatusEmail(
            application.prospect.email,
            application.prospect.fullName,
            newStatus,
            application.program.name
        );

        // 5. Real-time Pusher Notification for Student
        try {
            await pusherServer.trigger(`user-${application.prospectId}`, 'status-update', {
                applicationId: id,
                newStatus,
                programName: application.program.name,
                message: studentMessages[newStatus] || `Your application status is now ${statusLabel}`
            });
            
            // Also notify the university feed
            await pusherServer.trigger(`university-${application.program.universityId}`, 'new-activity', {
                type: 'STATUS_CHANGE',
                message: `Status of ${application.prospect.fullName}'s application updated to ${statusLabel}`,
                timestamp: new Date(),
            });
        } catch (pError) {
            console.error('Pusher trigger failed:', pError);
        }

        return 'success';
    } catch (error) {
        console.error('Failed to update status:', error);
        return 'Failed to update status.';
    }
}

export async function saveApplicationDraft(data: any) {
    const user = await requireRole('PROSPECT');

    const { programId, referralCode, personalInfo, academicInfo, familyInfo, activitiesInfo, financialInfo, workExperience } = data;

    if (!programId) throw new Error("Program ID is required");

    let affiliateId: string | undefined;
    let finalReferralCode = referralCode;

    if (!finalReferralCode) {
        const cookieStore = await cookies();
        finalReferralCode = cookieStore.get('tenpaten_ref')?.value || '';
    }

    if (finalReferralCode) {
        const affiliate = await prisma.affiliateProfile.findUnique({ where: { referralCode: finalReferralCode } });
        if (affiliate) affiliateId = affiliate.id;
    }

    const existingDraft = await prisma.application.findFirst({
        where: { prospectId: user.id, programId, status: 'DRAFT' }
    });

    if (existingDraft) {
        return await prisma.application.update({
            where: { id: existingDraft.id },
            data: {
                affiliateId,
                personalInfo: personalInfo as any,
                academicInfo: academicInfo as any,
                familyInfo: familyInfo as any,
                activitiesInfo: activitiesInfo as any,
                financialInfo: financialInfo as any,
                workExperience: workExperience as any,
                expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 28 days window
            }
        });
    } else {
        return await prisma.application.create({
            data: {
                prospectId: user.id,
                programId,
                affiliateId,
                status: 'DRAFT',
                personalInfo: personalInfo as any,
                academicInfo: academicInfo as any,
                familyInfo: familyInfo as any,
                activitiesInfo: activitiesInfo as any,
                financialInfo: financialInfo as any,
                workExperience: workExperience as any,
                expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) // 28 days window
            }
        });
    }
}

export async function submitFullApplication(data: any) {
    const user = await requireRole('PROSPECT');
    const { programId, referralCode, personalInfo, academicInfo, familyInfo, activitiesInfo, financialInfo, workExperience, saveToProfile } = data;

    if (!programId || !personalInfo || !academicInfo) {
        throw new Error('Missing required fields');
    }

    // Update user profile if requested
    if (saveToProfile) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                personalInfo: personalInfo as any,
                academicInfo: academicInfo as any,
                familyInfo: familyInfo as any,
                activitiesInfo: activitiesInfo as any,
                financialInfo: financialInfo as any,
                workExperience: workExperience as any,
            },
        });
    }

    let affiliateId: string | undefined;
    let finalReferralCode = referralCode;

    if (!finalReferralCode) {
        const cookieStore = await cookies();
        finalReferralCode = cookieStore.get('tenpaten_ref')?.value || '';
    }

    if (finalReferralCode) {
        const affiliate = await prisma.affiliateProfile.findUnique({ where: { referralCode: finalReferralCode } });
        if (affiliate) affiliateId = affiliate.id;
    }

    const existingDraft = await prisma.application.findFirst({
        where: { prospectId: user.id, programId, status: 'DRAFT' }
    });

    // Check for application fee
    const program = await prisma.program.findUnique({
        where: { id: programId },
        include: { university: true }
    });

    const university = program?.university;
    const requiresPayment = (university?.applicationFeeAmount || 0) > 0;
    const finalStatus = requiresPayment ? 'PAYMENT_PENDING' as any : 'SUBMITTED' as any;

    let application;
    if (existingDraft) {
        application = await prisma.application.update({
            where: { id: existingDraft.id },
            include: { program: { include: { university: { include: { admins: true } } } } },
            data: {
                affiliateId,
                personalInfo: personalInfo as any,
                academicInfo: academicInfo as any,
                familyInfo: familyInfo as any,
                activitiesInfo: activitiesInfo as any,
                financialInfo: financialInfo as any,
                workExperience: workExperience as any,
                status: finalStatus,
            },
        });
    } else {
        application = await prisma.application.create({
            include: { program: { include: { university: { include: { admins: true } } } } },
            data: {
                prospectId: user.id,
                programId,
                affiliateId,
                status: finalStatus,
                personalInfo: personalInfo as any,
                academicInfo: academicInfo as any,
                familyInfo: familyInfo as any,
                activitiesInfo: activitiesInfo as any,
                financialInfo: financialInfo as any,
                workExperience: workExperience as any,
            },
        });
    }

    await prisma.applicationStatusHistory.create({
        data: {
            applicationId: application.id,
            status: finalStatus,
            changedBy: user.id,
            note: requiresPayment ? 'Application started, awaiting payment.' : 'Application submitted by prospect (Full multi-step form).',
        },
    });

    if (requiresPayment) {
        return { success: true, requiresPayment: true, applicationId: application.id };
    }

    await createNotification(
        user.id,
        'Application Submitted',
        `Your application for ${application.program.name} has been successfully submitted.`,
        'SUCCESS',
        `/dashboard/applications/${application.id}`
    );

    // Notify School Admins
    if (application.program?.university?.admins) {
        for (const admin of application.program.university.admins) {
            await createNotification(
                admin.id,
                'New Application',
                `New application for ${application.program.name} received from ${personalInfo.fullName}.`,
                'INFO',
                `/dashboard/school/applications/${application.id}`
            );
        }
    }

    // Pusher for Live Feed
    try {
        await pusherServer.trigger(`university-${application.program.universityId}`, 'new-activity', {
            type: 'NEW_APPLICATION',
            message: `New application for ${application.program.name} from ${personalInfo.fullName}`,
            timestamp: new Date(),
        });
    } catch (e) {}

    return { success: true, applicationId: application.id };
}
