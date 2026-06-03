'use server';

import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export type SchoolDocumentType = 'offerLetterUrl' | 'acceptanceLetterUrl' | 'enrollmentDetailsUrl';

export async function uploadSchoolDocument(
    fileUrl: string,
    applicationId: string,
    type: SchoolDocumentType
) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
    const universityId = userRole === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : (session?.user as any)?.managedUniversityId;

    if ((userRole !== 'SCHOOL_ADMIN' && userRole !== 'SCHOOL_SUPER_AGENT') || !universityId) {
        return { success: false, error: 'Unauthorized' };
    }

    if (!fileUrl) {
        return { success: false, error: 'No file URL provided' };
    }

    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { program: true }
        });

        if (!application || application.program.universityId !== universityId) {
            return { success: false, error: 'Application not found or access denied' };
        }

        // Update application with document URL
        await prisma.application.update({
            where: { id: applicationId },
            data: { [type]: fileUrl }
        });

        // Add history entry if not already present for this stage
        let newStatus = application.status;
        let note = '';

        if (type === 'offerLetterUrl' && application.status !== 'OFFER_ISSUED') {
            newStatus = 'OFFER_ISSUED';
            note = 'Offer letter uploaded';
        } else if (type === 'acceptanceLetterUrl' && application.status !== 'OFFER_ACCEPTED') {
            newStatus = 'OFFER_ACCEPTED';
            note = 'Acceptance letter uploaded';
        } else if (type === 'enrollmentDetailsUrl' && application.status !== 'ENROLLED') {
            newStatus = 'ENROLLED';
            note = 'Enrollment details uploaded';
        }

        if (newStatus !== application.status) {
            await prisma.application.update({
                where: { id: applicationId },
                data: { status: newStatus },
            });

            await prisma.applicationStatusHistory.create({
                data: {
                    applicationId,
                    status: newStatus,
                    note,
                    changedBy: session?.user?.email || 'System'
                }
            });
        }

        revalidatePath(`/dashboard/school/applications/${applicationId}`);
        revalidatePath(`/dashboard/applications/${applicationId}`);
        return { success: true };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to save document. Please try again.' };
    }
}

export async function deleteSchoolDocument(applicationId: string, type: SchoolDocumentType) {
    const session = await auth();
    if (!session?.user || ((session.user as any).role !== 'SCHOOL_ADMIN' && (session.user as any).role !== 'SCHOOL_SUPER_AGENT')) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const application = (await prisma.application.findUnique({
            where: { id: applicationId },
            select: {
                program: {
                    select: { universityId: true }
                }
            }
        })) as any;

        const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
        const activeId = (session.user as any).role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : (session.user as any).managedUniversityId;

        if (!application || application.program.universityId !== activeId) {
            return { success: false, error: 'Unauthorized' };
        }

        // Note: Actual deletion from Cloudinary requires public_id. 
        // We are just unlinking from the DB for now.
        await prisma.application.update({
            where: { id: applicationId },
            data: {
                [type]: null
            }
        });

        revalidatePath(`/dashboard/school/applications/${applicationId}`);
        revalidatePath(`/dashboard/applications/${applicationId}`);

        return { success: true };
    } catch (error) {
        console.error('Delete failed:', error);
        return { success: false, error: 'Delete failed' };
    }
}
