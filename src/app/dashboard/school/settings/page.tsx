import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/data';
import SettingsClient from '@/components/school/SettingsClient';

export default async function SchoolAdminSettingsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    // Role check - ensure it's a School Admin
    if (session.user.role !== 'SCHOOL_ADMIN' && session.user.role !== 'SCHOOL_SUPER_AGENT') {
        redirect('/dashboard');
    }

    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return <SettingsClient user={user} />;
}
