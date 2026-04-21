'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Role } from '@prisma/client';

const UniversitySchema = z.object({
    name: z.string().min(2, { message: "University name is required." }),
});

export async function createUniversity(prevState: string | undefined, formData: FormData) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== Role.COUNTRY_DIRECTOR) {
        return 'Unauthorized: Only Country Directors can add universities.';
    }

    const data = Object.fromEntries(formData);
    const parsed = UniversitySchema.safeParse(data);

    if (!parsed.success) {
        return 'Invalid input.';
    }

    const { name } = parsed.data;

    try {
        // Get the director's country
        const director = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { managedCountry: true }
        });

        if (!director?.managedCountry) {
            return 'Error: You are not assigned to a country.';
        }

        await prisma.university.create({
            data: {
                name,
                countryId: director.managedCountry.id,
            },
        });

        revalidatePath('/dashboard/country-director/universities');
        return 'University created successfully.';
    } catch (error) {
        console.error('Database Error:', error);
        return 'Failed to create university.';
    }
}
