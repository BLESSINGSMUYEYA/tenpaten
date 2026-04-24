'use server';
 
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { sendSchoolAdminCredentials } from '@/lib/email-templates';

export async function registerUniversityByAdmin(formData: FormData) {
    const user = await requireRole('SUPER_ADMIN');

    const universityName = formData.get('universityName') as string;
    const countryId = formData.get('countryId') as string;
    const adminName = formData.get('adminName') as string;
    const adminEmail = formData.get('adminEmail') as string;

    if (!universityName || !countryId || !adminName || !adminEmail) {
        return { error: 'Missing required fields' };
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingUser) {
            return { error: 'A user with this email already exists.' };
        }

        // Generate temporary password
        const tempPassword = randomBytes(6).toString('hex'); // 12 characters
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create University and User in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const university = await tx.university.create({
                data: {
                    name: universityName,
                    countryId: countryId,
                    status: 'APPROVED', // Admin creation is auto-approved
                }
            });

            const newUser = await tx.user.create({
                data: {
                    email: adminEmail,
                    fullName: adminName,
                    passwordHash: hashedPassword,
                    role: 'SCHOOL_ADMIN',
                    managedUniversityId: university.id,
                    status: 'ACTIVE'
                }
            });

            return { university, newUser };
        });

        // Send email with credentials
        await sendSchoolAdminCredentials(adminEmail, adminName, tempPassword, universityName);

        // Log the action
        await logAction(user.id, 'ADMIN_REGISTER_UNIVERSITY', {
            universityId: result.university.id,
            universityName: result.university.name,
            adminEmail: adminEmail
        });

        revalidatePath('/dashboard/admin/schools');
        
        return { success: true };
    } catch (error) {
        console.error('Failed to register university:', error);
        return { error: 'Failed to register university. Please try again.' };
    }
}
