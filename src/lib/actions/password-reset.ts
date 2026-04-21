'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email-templates';
import { rateLimit, getClientIp } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const ip = await getClientIp();
    if (!rateLimit(`reset-${ip}`, 3, 3600000)) { // 3 attempts per hour
        return { error: 'Too many requests. Please try again later.' };
    }

    const email = formData.get('email') as string;
    
    if (!email || !email.includes('@')) {
        return { error: 'Please enter a valid email address.' };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        
        // We always return success to prevent email enumeration attacks
        if (!user) {
            console.log(`Password reset requested for non-existent email: ${email}`);
            return { success: 'If an account with that email exists, we sent a password reset link.' };
        }

        // Generate token and expiry (1 hour)
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000);

        // Delete any existing tokens for this email
        await prisma.passwordResetToken.deleteMany({
            where: { email }
        });

        // Save the new token
        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires
            }
        });

        // Send email
        await sendPasswordResetEmail(email, token);
        
        await logAction(user.id, 'REQUEST_PASSWORD_RESET').catch(console.error);

        return { success: 'If an account with that email exists, we sent a password reset link.' };
        
    } catch (error) {
        console.error('Password reset request error:', error);
        return { error: 'Failed to process request. Please try again later.' };
    }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!token) return { error: 'Missing reset token.' };
    
    if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match.' };
    }

    try {
        // Find token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken) {
            return { error: 'Invalid or expired reset token.' };
        }

        if (resetToken.expires < new Date()) {
            await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
            return { error: 'Reset token has expired. Please request a new one.' };
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        });

        if (!user) {
            return { error: 'User not found.' };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hashedPassword }
        });

        // Delete token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id }
        });
        
        await logAction(user.id, 'RESET_PASSWORD').catch(console.error);

        return { success: 'Password reset successfully! You can now log in.' };

    } catch (error) {
        console.error('Password reset error:', error);
        return { error: 'Failed to reset password. Please try again.' };
    }
}
