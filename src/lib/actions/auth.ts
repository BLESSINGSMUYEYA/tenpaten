'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { RegisterFormSchema, LoginFormSchema } from '../definitions';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { sendWelcomeEmail, sendVerificationEmail } from '../email-templates';
import crypto from 'crypto';
import { getCurrentUser, requireRole } from '@/lib/auth-utils';
import { logAction } from '@/lib/audit';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { createNotification } from '../notifications';


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const ip = await getClientIp();
    if (!rateLimit(`login-${ip}`, 5, 60000)) { // 5 attempts per minute
        return 'Too many login attempts. Please try again later.';
    }

    try {
        const data = Object.fromEntries(formData);
        const parsed = LoginFormSchema.safeParse(data);

        if (!parsed.success) {
            return 'Invalid input.';
        }

        await signIn('credentials', {
            ...parsed.data,
            redirect: false,
        });

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
    redirect('/dashboard');
}

export async function register(prevState: string | undefined, formData: FormData) {
    const ip = await getClientIp();
    if (!rateLimit(`register-${ip}`, 3, 3600000)) { // 3 attempts per hour
        return 'Too many registration attempts. Please try again later.';
    }

    const data = Object.fromEntries(formData);
    const parsed = RegisterFormSchema.safeParse(data);

    if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        // Produce a readable message instead of raw Zod internals
        const friendlyMessages: string[] = [];
        if (fieldErrors.fullName) friendlyMessages.push('Full name is required (min 2 characters).');
        if (fieldErrors.email) friendlyMessages.push('Please enter a valid email address.');
        if (fieldErrors.password) friendlyMessages.push('Password must be at least 6 characters.');
        if (fieldErrors.residenceCountryId) friendlyMessages.push('Please select your country of residence.');
        return friendlyMessages.length > 0
            ? friendlyMessages.join(' ')
            : 'Please fill in all required fields correctly.';
    }

    const { email, password, fullName, role, residenceCountryId, callbackUrl } = parsed.data;
    const userRole = role === 'SCHOOL_ADMIN' ? 'SCHOOL_ADMIN' : 'PROSPECT';

    // Students must select a country; school admins don't need one
    if (userRole === 'PROSPECT' && (!residenceCountryId || residenceCountryId.trim() === '')) {
        return 'Please select your country of residence.';
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
                role: userRole,
                emailVerified: null,
                ...(residenceCountryId && residenceCountryId.trim() !== '' ? { residenceCountryId } : {}),
            }
        });

        const otp = crypto.randomInt(100000, 999999).toString();
        
        await prisma.verificationToken.create({
            data: {
                email,
                token: otp,
                expires: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
            }
        });

        // Background tasks (non-blocking for faster response)
        logAction(newUser.id, 'REGISTER_USER', { role: userRole }).catch(console.error);
        // We only send verification email here, welcome email triggers AFTER verification
        sendVerificationEmail(email, otp, fullName).catch(console.error);
 
        // Auto-login after registration (establish session so middleware can lock to verification page)
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

    } catch (error) {
        console.error('Registration error:', error);
        return 'Failed to register user.';
    }

    const searchParams = new URLSearchParams({ email });
    if (callbackUrl && callbackUrl.startsWith('/')) {
        searchParams.set('callbackUrl', callbackUrl);
    }

    redirect(`/verify-email?${searchParams.toString()}`);
}

export async function verifyEmailOTP(prevState: any, formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const otp = formData.get('otp') as string;

        if (!email || !otp) return { error: 'Missing required fields.' };

        const tokenRecord = await prisma.verificationToken.findFirst({
            where: { email, token: otp },
            orderBy: { createdAt: 'desc' }
        });

        if (!tokenRecord) return { error: 'Invalid verification code.' };

        if (new Date() > tokenRecord.expires) {
            return { error: 'Verification code has expired. Please request a new one.' };
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { error: 'User not found.' };

        await prisma.$transaction([
            prisma.user.update({
                where: { email },
                data: { emailVerified: new Date() }
            }),
            prisma.verificationToken.deleteMany({
                where: { email }
            })
        ]);

        // Send Welcome Email (fire-and-forget)
        sendWelcomeEmail(email, user.fullName).catch(console.error);

        // In-App Welcome Notification
        createNotification(
            user.id,
            '🎉 Welcome to Tenpaten!',
            user.role === 'SCHOOL_ADMIN'
                ? 'Your institution account is verified. Complete your university profile to start receiving applications.'
                : 'Your account is verified! Start exploring universities and submit your first application.',
            'SUCCESS',
            user.role === 'SCHOOL_ADMIN' ? '/dashboard/school' : '/dashboard/colleges'
        ).catch(console.error);

        const targetPath = user.role === 'SCHOOL_ADMIN'
            ? '/dashboard/school?welcome=true'
            : '/dashboard?welcome=true';

        // Clear caches
        revalidatePath('/', 'layout');
        revalidatePath('/dashboard', 'layout');
        revalidatePath('/verify-email', 'layout');

        return { success: true, targetPath };

    } catch (error) {
        console.error('Verification error:', error);
        return { error: 'An unexpected error occurred during verification.' };
    }
}

export async function resendVerificationOTP(email: string) {
    if (!email) return { error: 'Email is required.' };

    const ip = await getClientIp();
    if (!rateLimit(`resend-otp-${ip}`, 3, 3600000)) { // 3 attempts per hour
        return { error: 'Too many requests. Please try again later.' };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: 'User not found.' };

    if (user.emailVerified) {
        return { error: 'Email is already verified.' };
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    
    await prisma.verificationToken.deleteMany({ where: { email } }); // clear old tokens
    
    await prisma.verificationToken.create({
        data: {
            email,
            token: otp,
            expires: new Date(Date.now() + 15 * 60 * 1000)
        }
    });

    try {
        await sendVerificationEmail(email, otp, user.fullName);
        return { success: true };
    } catch (error) {
        console.error('Failed to resend auth code', error);
        return { error: 'Failed to send verification email. Try again.' };
    }
}

export async function changePassword(prevState: string | undefined, formData: FormData) {
    const user = await getCurrentUser();

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return 'All fields are required.';
    }

    if (newPassword !== confirmPassword) {
        return 'New passwords do not match.';
    }

    if (newPassword.length < 6) {
        return 'Password must be at least 6 characters.';
    }

    try {
        // Need password hash from DB
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id as string },
        });

        if (!dbUser) return 'User not found.';

        const passwordsMatch = await bcrypt.compare(currentPassword, dbUser.passwordHash);
        if (!passwordsMatch) {
            return 'Incorrect current password.';
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id as string },
            data: { passwordHash: hashedPassword }
        });

        await logAction(user.id as string, 'CHANGE_PASSWORD');

        revalidatePath('/dashboard/student-settings');
        return 'Password changed successfully.';
    } catch (error) {
        console.error('Failed to change password:', error);
        return 'Failed to change password.';
    }
}
