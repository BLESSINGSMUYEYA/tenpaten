import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AffiliateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const role = (session.user as any).role;
    const affiliateApproved = (session.user as any).affiliateApproved;

    // Allow full AFFILIATE role users OR Student Users with an approved AffiliateProfile
    if (role !== 'AFFILIATE' && !affiliateApproved) {
        redirect('/dashboard');
    }

    return <>{children}</>;
}
