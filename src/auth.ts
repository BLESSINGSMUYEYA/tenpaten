import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { User, Role } from '@prisma/client';

async function getUser(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    session: {
        strategy: 'jwt',
        maxAge: 2 * 60 * 60, // 2 hours
    },
    basePath: '/api/auth',
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
                    if (passwordsMatch) {
                        return user;
                    }
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user }) {
            // At sign-in, populate token from the user object
            if (user) {
                token.role = user.role;
                token.name = (user as User).fullName ?? user.name;
                token.managedUniversityId = (user as User).managedUniversityId;
                token.emailVerified = (user as User).emailVerified;
            }

            // On every token refresh, re-fetch from DB to pick up admin role/affiliate changes
            if (token.sub) {
                try {
                    const freshUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: {
                            role: true,
                            fullName: true,
                            managedUniversityId: true,
                            emailVerified: true,
                            affiliateProfile: { select: { status: true } },
                        },
                    });
                    if (freshUser) {
                        token.role = freshUser.role;
                        token.name = freshUser.fullName ?? token.name;
                        token.managedUniversityId = freshUser.managedUniversityId;
                        token.emailVerified = freshUser.emailVerified;
                        // True if they have an approved affiliate profile regardless of primary role
                        token.affiliateApproved = freshUser.affiliateProfile?.status === 'APPROVED';
                    }
                } catch {
                    // If DB lookup fails, keep the existing token values
                }
            }

            return token;
        },
    },
    secret: process.env.AUTH_SECRET,
});
