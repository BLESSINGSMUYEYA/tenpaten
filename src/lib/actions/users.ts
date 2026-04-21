'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';


export async function createUserByAdmin(prevState: string | undefined, formData: FormData) {
    const user = await requireRole('SUPER_ADMIN');

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const countryId = formData.get('countryId') as string;

    if (!fullName || !email || !password || !role) {
        return 'All fields are required.';
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return 'User already exists.';

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName,
                role: role as Role,
                managedCountry: (role === 'COUNTRY_DIRECTOR' && countryId) ? {
                    connect: { id: countryId }
                } : undefined,
            }
        });

        await logAction(user.id as string, 'CREATE_USER_BY_ADMIN', { createdUserId: newUser.id, role });

        revalidatePath('/dashboard/admin/users');
        return 'User created successfully.';
    } catch (error) {
        console.error('Failed to create user:', error);
        return 'Failed to create user.';
    }
}
