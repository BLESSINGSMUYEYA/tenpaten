import { auth } from '@/auth';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export type AuthSession = {
    user: {
        id: string;
        email: string;
        name?: string | null;
        fullName?: string | null;
        role: Role;
        managedUniversityId?: string | null;
        managedCountryId?: string; // Assuming we might add this to session later or fetch it
    };
};

export async function getCurrentUser(): Promise<AuthSession['user']> {
    const session = await auth();

    if (!session?.user?.email || !session.user.id) {
        redirect('/login');
    }

    return session.user as AuthSession['user'];
}

export async function requireRole(allowedRoles: Role | Role[]) {
    const user = await getCurrentUser();

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // SCHOOL_SUPER_AGENT can access anything SCHOOL_ADMIN can access,
    // since they operate school dashboards on behalf of the assigned school.
    const effectiveRoles = roles.includes('SCHOOL_ADMIN')
        ? [...roles, 'SCHOOL_SUPER_AGENT']
        : roles;

    if (!effectiveRoles.includes(user.role)) {
        throw new Error(`Unauthorized: Role ${user.role} is not allowed to perform this action.`);
    }

    return user;
}

export async function verifyOwnership(resourceUserId: string) {
    const user = await getCurrentUser();

    if (user.role === 'SUPER_ADMIN') return user;

    if (user.id !== resourceUserId) {
        throw new Error('Unauthorized: You do not own this resource.');
    }

    return user;
}
