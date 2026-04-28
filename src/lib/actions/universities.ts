'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { CreateUniversitySchema } from '../definitions';
import { revalidatePath } from 'next/cache';
import { slugify, generateUniqueSlug } from '@/lib/utils/slugify';

export async function createUniversity(prevState: string | undefined, formData: FormData) {
    const user = await requireRole('COUNTRY_DIRECTOR');

    const data = Object.fromEntries(formData);
    const parsed = CreateUniversitySchema.safeParse(data);

    if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        return Object.values(errors).flat().join(', ');
    }

    try {
        const detailedUser = await prisma.user.findUnique({
            where: { id: user.id as string },
            include: { managedCountry: true }
        });

        if (!detailedUser?.managedCountry) return 'You do not manage any country.';

        const university = await prisma.university.create({
            data: {
                name: parsed.data.name,
                description: parsed.data.description,
                website: parsed.data.website || null,
                tuition: parsed.data.tuition,
                countryId: detailedUser.managedCountry.id,
                status: 'APPROVED', // CD creations are auto-approved
            }
        });

        await logAction(user.id as string, 'CREATE_UNIVERSITY', { universityId: university.id, name: parsed.data.name });

        revalidatePath('/dashboard/country-director/universities');
        return 'success';
    } catch (error) {
        console.error('Failed to create university:', error);
        return 'Failed to create university.';
    }
}

export async function createProgram(prevState: string | undefined, formData: FormData) {
    const user = await requireRole(['SCHOOL_ADMIN', 'COUNTRY_DIRECTOR', 'SUPER_ADMIN']);

    const name = formData.get('name') as string;
    const universityId = formData.get('universityId') as string;

    if (!name || !universityId) return 'Missing required fields';

    try {
        // Ownership check for non-Super Admins
        if (user.role === 'COUNTRY_DIRECTOR') {
            const country = await prisma.country.findFirst({
                where: { directorId: user.id }
            });
            const university = await prisma.university.findUnique({
                where: { id: universityId }
            });

            if (!country || !university || university.countryId !== country.id) {
                return 'Unauthorized: You do not manage this university.';
            }
        } else if (user.role === 'SCHOOL_ADMIN') {
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id }
            });
            if (dbUser?.managedUniversityId !== universityId) {
                return 'Unauthorized: You do not manage this university.';
            }
        }

        const program = await prisma.program.create({
            data: {
                name,
                universityId
            }
        });

        await logAction(user.id as string, 'CREATE_PROGRAM', { programId: program.id, name });

        revalidatePath(`/dashboard/country-director/universities/${universityId}`);
        revalidatePath('/dashboard/school/programs');

        return 'success';
    } catch (error) {
        console.error('Failed to create program:', error);
        return 'Failed to create program.';
    }
}

export async function deleteUniversity(universityId: string, force = false) {
    const user = await requireRole(['SUPER_ADMIN']);

    try {
        if (!force) {
            // Check for associations (Programs, Applications)
            const [programCount, adminCount] = await Promise.all([
                prisma.program.count({ where: { universityId } }),
                prisma.user.count({ where: { managedUniversityId: universityId } })
            ]);

            if (programCount > 0) {
                return { 
                    error: `Cannot delete university: ${programCount} program(s) are still active.`,
                    hasPrograms: true 
                };
            }

            if (adminCount > 0) {
                return { error: `Cannot delete university: ${adminCount} administrator(s) are still assigned to it.` };
            }
        }

        // Use a transaction for forceful deletion
        await prisma.$transaction(async (tx) => {
            if (force) {
                // Find all programs for this university
                const programs = await tx.program.findMany({
                    where: { universityId },
                    select: { id: true }
                });
                const programIds = programs.map(p => p.id);

                if (programIds.length > 0) {
                    // Delete Application Status History
                    await tx.applicationStatusHistory.deleteMany({
                        where: { application: { programId: { in: programIds } } }
                    });

                    // Delete Applications
                    await tx.application.deleteMany({
                        where: { programId: { in: programIds } }
                    });

                    // Delete Programs
                    await tx.program.deleteMany({
                        where: { universityId }
                    });
                }

                // Delete Departments
                await tx.department.deleteMany({
                    where: { universityId }
                });

                // Unlink any users managing this university
                await tx.user.updateMany({
                    where: { managedUniversityId: universityId },
                    data: { managedUniversityId: null }
                });
            }

            // Finally, delete the university
            await tx.university.delete({ where: { id: universityId } });
        });

        revalidatePath('/dashboard/admin/schools');
        revalidatePath('/dashboard/country-director/universities');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete university:', error);
        return { error: 'Failed to delete university. It may have hidden dependencies.' };
    }
}

export async function updateUniversityStatus(universityId: string, status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'DRAFT') {
    const user = await requireRole(['SUPER_ADMIN', 'COUNTRY_DIRECTOR']);

    try {
        // Permissions check for CD
        if (user.role === 'COUNTRY_DIRECTOR') {
            const country = await prisma.country.findFirst({ where: { directorId: user.id } });
            const university = await prisma.university.findUnique({ where: { id: universityId } });
            if (!country || !university || university.countryId !== country.id) {
                return { error: 'Unauthorized' };
            }
        }

        // Auto-generate slug when first approved
        let slugData: { slug?: string } = {};
        if (status === 'APPROVED') {
            const existing = await prisma.university.findUnique({
                where: { id: universityId },
                select: { slug: true, name: true },
            });
            if (existing && !existing.slug) {
                const base = slugify(existing.name);
                const uniqueSlug = await generateUniqueSlug(base, universityId);
                slugData.slug = uniqueSlug;
            }
        }

        await prisma.university.update({
            where: { id: universityId },
            data: { status, ...slugData },
        });

        revalidatePath('/dashboard/admin/schools');
        revalidatePath('/dashboard/country-director/universities');
        revalidatePath(`/dashboard/admin/schools/${universityId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update university status:', error);
        return { error: 'Failed to update status' };
    }
}
