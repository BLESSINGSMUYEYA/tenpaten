'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { slugify, isValidSlug, generateUniqueSlug } from '@/lib/utils/slugify';


const CreateUniversitySchema = z.object({
    name: z.string().min(2, 'University name is required'),
    countryId: z.string().min(1, 'Please select a country'),
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional(),
    logo: z.string().optional(),
    images: z.array(z.string()).optional(),
});

const UpdateUniversitySchema = z.object({
    name: z.string().min(2, 'University name is required'),
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    images: z.array(z.string()).optional(),
    logo: z.string().optional(),
    tuition: z.string().optional(),
    phone: z.string().optional(),
    applicationFeeAmount: z.number().nullable().optional(),
    applicationFeeCurrency: z.string().optional(),
    bankName: z.string().optional().nullable(),
    accountNumber: z.string().optional().nullable(),
    accountName: z.string().optional().nullable(),
    mobileMoneyNumber: z.string().optional().nullable(),
});

export async function updateUniversityProfileJson(
    data: {
        name?: string;
        description?: string;
        website?: string;
        images?: string[];
        logo?: string;
        tuition?: string;
        phone?: string;
        applicationFeeAmount?: number | null;
        applicationFeeCurrency?: string;
        bankName?: string | null;
        accountNumber?: string | null;
        accountName?: string | null;
        mobileMoneyNumber?: string | null;
    },
    targetUniversityId?: string
) {
    const session = await auth();
    const user = session?.user as any;

    if (!user) return { error: 'Unauthorized' };

    const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
    const activeId = user.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : user.managedUniversityId;
    const universityId = targetUniversityId || activeId;

    if (!universityId) return { error: 'No university specified' };

    // Permissions check
    if (user.role === 'COUNTRY_DIRECTOR') {
        const country = await prisma.country.findFirst({
            where: { directorId: user.id }
        });
        const university = await prisma.university.findUnique({
            where: { id: universityId }
        });

        if (!country || !university || university.countryId !== country.id) {
            return { error: 'Unauthorized: You do not manage this university' };
        }
    } else if (user.role === 'SCHOOL_ADMIN' || user.role === 'SCHOOL_SUPER_AGENT') {
        const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
        const activeId = user.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : user.managedUniversityId;
        if (universityId !== activeId) {
            return { error: 'Unauthorized: You can only manage your own university' };
        }
    } else if (user.role !== 'SUPER_ADMIN') {
        return { error: 'Unauthorized' };
    }

    const validatedFields = UpdateUniversitySchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields', details: validatedFields.error.flatten() };
    }

    try {
        await prisma.university.update({
            where: { id: universityId },
            data: {
                name: validatedFields.data.name,
                description: validatedFields.data.description,
                website: validatedFields.data.website || null,
                images: validatedFields.data.images,
                logo: validatedFields.data.logo,
                tuition: validatedFields.data.tuition,
                phone: validatedFields.data.phone,
                applicationFeeAmount: validatedFields.data.applicationFeeAmount,
                applicationFeeCurrency: validatedFields.data.applicationFeeCurrency,
                bankName: validatedFields.data.bankName,
                accountNumber: validatedFields.data.accountNumber,
                accountName: validatedFields.data.accountName,
                mobileMoneyNumber: validatedFields.data.mobileMoneyNumber,
            },
        });

        revalidatePath(`/dashboard/school/profile`);
        revalidatePath(`/dashboard/country-director/universities/${universityId}`);
        revalidatePath(`/dashboard/schools/${universityId}`);
        return { success: 'Profile updated successfully' };
    } catch (error) {
        console.error('Failed to update university profile:', error);
        return { error: 'Failed to update profile' };
    }
}

export async function uploadUniversityImage(formData: FormData, targetUniversityId?: string) {
    const session = await auth();
    const user = session?.user as any;

    if (!user) throw new Error('Unauthorized');

    const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
    const activeId = user.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : user.managedUniversityId;
    const universityId = targetUniversityId || activeId;

    if (!universityId) throw new Error('No university specified');

    // Permissions check
    if (user.role === 'COUNTRY_DIRECTOR') {
        const country = await prisma.country.findFirst({
            where: { directorId: user.id }
        });
        const university = await prisma.university.findUnique({
            where: { id: universityId }
        });

        if (!country || !university || university.countryId !== country.id) {
            throw new Error('Unauthorized: You do not manage this university');
        }
    } else if (user.role === 'SCHOOL_ADMIN' || user.role === 'SCHOOL_SUPER_AGENT') {
        const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
        const activeId = user.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : user.managedUniversityId;
        if (universityId !== activeId) {
            throw new Error('Unauthorized: You can only manage your own university');
        }
    } else if (user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
    }

    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file provided');
    }

    const cloudinary = (await import('@/lib/cloudinary')).default;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: `tenpaten/universities/${universityId}`,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return { success: true, url: result.secure_url };
    } catch (error) {
        console.error('Upload failed:', error);
        return { success: false, error: 'Upload failed' };
    }
}

export async function createUniversityInitial(data: {
    name: string;
    countryId: string;
    description?: string;
    website?: string;
    logo?: string;
    images?: string[];
    phone?: string;
}) {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'SCHOOL_ADMIN') {
        return { error: 'Unauthorized: Only school administrators can register institutions' };
    }

    const validatedFields = CreateUniversitySchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields', details: validatedFields.error.flatten() };
    }

    try {
        const university = await prisma.university.create({
            data: {
                ...validatedFields.data,
                status: 'PENDING', // Directly pending review
                admins: {
                    connect: { id: user.id }
                }
            }
        });

        // Update the user's managedUniversityId in the background
        await prisma.user.update({
            where: { id: user.id },
            data: { managedUniversityId: university.id }
        });

        // Trigger Notification for Country Director
        const country = await prisma.country.findUnique({
            where: { id: university.countryId },
            include: { director: true }
        });

        if (country?.director) {
            await prisma.notification.create({
                data: {
                    userId: country.director.id,
                    title: 'New University Registration',
                    message: `${university.name} has submitted their profile for review.`,
                    type: 'ACTION_REQUIRED',
                    link: `/dashboard/country-director/universities/${university.id}`
                }
            });
        }

        revalidatePath('/dashboard/school');
        return { success: 'Institution application submitted for review', universityId: university.id };
    } catch (error) {
        console.error('Failed to create university:', error);
        return { error: 'Failed to register institution. Please try again.' };
    }
}

export async function updateUniversitySlug(newSlug: string, targetUniversityId?: string) {
    const session = await auth();
    const user = session?.user as any;

    if (!user) return { error: 'Unauthorized' };

    const { getActiveSchoolId } = await import('@/lib/getActiveSchool');
    const activeId = user.role === 'SCHOOL_SUPER_AGENT' ? await getActiveSchoolId() : user.managedUniversityId;
    const universityId = targetUniversityId || activeId;
    if (!universityId) return { error: 'No university specified' };

    // Auth check
    if ((user.role === 'SCHOOL_ADMIN' || user.role === 'SCHOOL_SUPER_AGENT') && universityId !== activeId) {
        return { error: 'Unauthorized: You can only manage your own university' };
    }
    if (!['SUPER_ADMIN', 'COUNTRY_DIRECTOR', 'SCHOOL_ADMIN', 'SCHOOL_SUPER_AGENT'].includes(user.role)) {
        return { error: 'Unauthorized' };
    }

    // Format validation
    const trimmed = newSlug.trim().toLowerCase();
    if (!isValidSlug(trimmed)) {
        return { error: 'Invalid slug. Use 3–60 lowercase letters, numbers, and hyphens only (e.g. my-university).' };
    }

    // Uniqueness check (excluding current university)
    const conflict = await prisma.university.findFirst({
        where: { slug: trimmed, id: { not: universityId } },
        select: { id: true },
    });
    if (conflict) {
        return { error: 'This short URL is already taken. Please choose another.' };
    }

    try {
        await prisma.university.update({
            where: { id: universityId },
            data: { slug: trimmed },
        });

        revalidatePath('/dashboard/school');
        revalidatePath(`/schools/${universityId}`);
        return { success: true, slug: trimmed };
    } catch (error) {
        console.error('Failed to update slug:', error);
        return { error: 'Failed to update short URL.' };
    }
}

/** Quick availability check used by the inline slug editor (no side-effects) */
export async function checkSlugAvailability(slug: string, universityId: string) {
    if (!isValidSlug(slug.trim().toLowerCase())) {
        return { available: false, reason: 'Invalid format' };
    }
    const conflict = await prisma.university.findFirst({
        where: { slug: slug.trim().toLowerCase(), id: { not: universityId } },
        select: { id: true },
    });
    return { available: !conflict };
}
