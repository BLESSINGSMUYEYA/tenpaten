import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function checkRole(allowedRoles: string[]) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const role = (session.user as any).role;

    if (!role || !allowedRoles.includes(role)) {
        redirect('/dashboard');
    }
}
