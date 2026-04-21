import { Role } from "@prisma/client";

export function getHomeUrl(role?: Role | string | null): string {
    if (!role) return '/dashboard';
    
    switch (role) {
        case 'PROSPECT':
            return '/dashboard';
        case 'SCHOOL_ADMIN':
            return '/dashboard/school';
        case 'COUNTRY_DIRECTOR':
            return '/dashboard/country-director';
        case 'AFFILIATE':
            return '/dashboard/affiliate';
        case 'SUPER_ADMIN':
            return '/dashboard/admin/users';
        default:
            return '/dashboard';
    }
}
