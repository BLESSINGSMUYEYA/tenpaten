import type { NextAuthConfig } from 'next-auth';
import type { Role } from '@prisma/client';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as Role;
            }

            if (token.managedUniversityId && session.user) {
                session.user.managedUniversityId = token.managedUniversityId as string;
            }

            if (session.user) {
                session.user.affiliateApproved = !!(token.affiliateApproved);
                session.user.emailVerified = token.emailVerified as Date | null;
            }

            // Explicitly forward the user's real name from the JWT token
            if (token.name && session.user) {
                session.user.name = token.name as string;
            }

            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isEmailVerified = !!(auth?.user as any)?.emailVerified;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnVerifyPage = nextUrl.pathname.startsWith('/verify-email');
            const userRole = (auth?.user as any)?.role;

            // 1. Force unverified STUDENT users to verify page if they are trying to access protected areas (Dashboard)
            // Administrative roles (SCHOOL_ADMIN, SUPER_ADMIN, etc.) bypass this since their accounts are created manually
            if (isLoggedIn && !isEmailVerified && isOnDashboard && !isOnVerifyPage && userRole === 'STUDENT') {
                return Response.redirect(new URL('/verify-email', nextUrl));
            }

            // 2. Protect Dashboard routes
            if (isOnDashboard) {
                if (!isLoggedIn) return false; // Redirect unauthenticated users to login page

                // Define protected routes and their required roles
                const protectedRoutes = {
                    '/dashboard/admin': 'SUPER_ADMIN',
                    '/dashboard/school': 'SCHOOL_ADMIN',
                    '/dashboard/affiliate': 'AFFILIATE',
                    '/dashboard/country-director': 'COUNTRY_DIRECTOR',
                };

                // Check role-based access

                for (const [route, requiredRole] of Object.entries(protectedRoutes)) {
                    if (nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)) {
                        // Special case: allow /dashboard/affiliate for users with approved affiliate profile
                        if (route === '/dashboard/affiliate' && (auth?.user as any)?.affiliateApproved) {
                            return true;
                        }
                        if (userRole !== requiredRole) {
                            return Response.redirect(new URL('/dashboard', nextUrl));
                        }
                    }
                }

                return true;
            } else if (isLoggedIn && isEmailVerified) {
                // Redirect logged-in and verified users away from login/register pages
                if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register' || nextUrl.pathname === '/' || nextUrl.pathname === '/school/login') {
                    let targetUrl = '/dashboard';
                    switch (userRole) {
                        case 'SCHOOL_ADMIN': targetUrl = '/dashboard/school'; break;
                        case 'AFFILIATE': targetUrl = '/dashboard/affiliate'; break;
                        case 'COUNTRY_DIRECTOR': targetUrl = '/dashboard/country-director'; break;
                        case 'SUPER_ADMIN': targetUrl = '/dashboard/admin'; break;
                    }
                    return Response.redirect(new URL(targetUrl, nextUrl));
                }
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
