'use server';

import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function uploadDocument(formData: FormData, applicationId: string) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'File size exceeds 10MB limit.' };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${base64Data}`;

        const result = await cloudinary.uploader.upload(fileUri, {
            folder: `tenpaten/applications/${applicationId}`,
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            timeout: 60000, // 60 second timeout
        });

        // Update Application record
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { documents: true }
        });

        const currentDocuments = (application?.documents as any[]) || [];
        const newDocument = {
            url: result.secure_url,
            publicId: result.public_id,
            name: file.name,
            uploadedAt: new Date().toISOString()
        };

        await prisma.application.update({
            where: { id: applicationId },
            data: {
                documents: [...currentDocuments, newDocument]
            }
        });

        revalidatePath(`/dashboard/applications/${applicationId}`);
        return { success: true, document: newDocument };

    } catch (error) {
        console.error('Upload failed:', error);
        return { success: false, error: 'Upload failed' };
    }
}

export async function deleteDocument(applicationId: string, publicId: string) {
    try {
        await cloudinary.uploader.destroy(publicId);

        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { documents: true }
        });

        const currentDocuments = (application?.documents as any[]) || [];
        const updatedDocuments = currentDocuments.filter((doc: any) => doc.publicId !== publicId);

        await prisma.application.update({
            where: { id: applicationId },
            data: { documents: updatedDocuments }
        });

        revalidatePath(`/dashboard/applications/${applicationId}`);
        return { success: true };
    } catch (error) {
        console.error('Delete failed:', error);
        return { success: false, error: 'Delete failed' };
    }
}

export async function uploadTempDocument(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file provided');
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'File size exceeds 10MB limit.' };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${base64Data}`;

        const result = await cloudinary.uploader.upload(fileUri, {
            folder: `tenpaten/temp-uploads`,
            resource_type: 'auto',
            use_filename: true,
            unique_filename: true,
            timeout: 60000,
        });

        // Return Cloudinary details without mutating the database
        const document = {
            url: result.secure_url,
            publicId: result.public_id,
            name: file.name,
        };

        return { success: true, document };
    } catch (error) {
        console.error('Temp upload failed:', error);
        return { success: false, error: 'Upload failed' };
    }
}

