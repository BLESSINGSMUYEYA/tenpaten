'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export async function createCountry(name: string, code: string) {
    await requireRole(['SUPER_ADMIN']);

    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedName) return { error: 'Country name is required' };
    if (!trimmedCode) return { error: 'Country code is required (e.g. ZA, US, NG)' };

    try {
        const exists = await prisma.country.findFirst({
            where: { OR: [{ name: { equals: trimmedName, mode: 'insensitive' } }, { code: trimmedCode }] }
        });
        if (exists) return { error: `A country with that name or code already exists` };

        const country = await prisma.country.create({
            data: { name: trimmedName, code: trimmedCode }
        });

        revalidatePath('/dashboard/admin/countries');
        return { success: true, country };
    } catch (error) {
        console.error('Failed to create country:', error);
        return { error: 'Failed to create country' };
    }
}

export async function updateCountry(countryId: string, name: string, code: string) {
    await requireRole(['SUPER_ADMIN']);

    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();

    if (!trimmedName) return { error: 'Country name is required' };
    if (!trimmedCode) return { error: 'Country code is required' };

    try {
        const exists = await prisma.country.findFirst({
            where: { 
                AND: [
                    { id: { not: countryId } },
                    { OR: [{ name: { equals: trimmedName, mode: 'insensitive' } }, { code: trimmedCode }] }
                ]
            }
        });
        if (exists) return { error: `A country with that name or code already exists` };

        const country = await prisma.country.update({
            where: { id: countryId },
            data: { name: trimmedName, code: trimmedCode }
        });

        revalidatePath('/dashboard/admin/countries');
        return { success: true, country };
    } catch (error) {
        console.error('Failed to update country:', error);
        return { error: 'Failed to update country' };
    }
}

export async function deleteCountry(countryId: string) {
    await requireRole(['SUPER_ADMIN']);

    try {
        // Check for associations
        const [uniCount, affiliateCount, residentCount] = await Promise.all([
            prisma.university.count({ where: { countryId } }),
            prisma.affiliateProfile.count({ where: { countryId } }),
            prisma.user.count({ where: { residenceCountryId: countryId } })
        ]);

        if (uniCount > 0) {
            return { error: `Cannot delete country: ${uniCount} university/universities are still associated with it.` };
        }

        if (affiliateCount > 0) {
            return { error: `Cannot delete country: ${affiliateCount} affiliate(s) are still associated with it.` };
        }

        if (residentCount > 0) {
            return { error: `Cannot delete country: ${residentCount} user(s) are still listed as residents of this country.` };
        }

        // Unlink director before deleting
        await prisma.country.update({
            where: { id: countryId },
            data: { directorId: null }
        });

        await prisma.country.delete({ where: { id: countryId } });

        revalidatePath('/dashboard/admin/countries');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete country:', error);
        return { error: 'Failed to delete country. It may have active associations.' };
    }
}
