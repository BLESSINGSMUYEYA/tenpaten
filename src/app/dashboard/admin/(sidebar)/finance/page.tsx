import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import GlobalFinanceClient from './GlobalFinanceClient';

export default async function AdminFinancePage() {
    const session = await auth();

    if (session?.user?.role !== 'SUPER_ADMIN') {
        redirect('/dashboard');
    }

    return (
        <div className="p-4 sm:p-8">
            <GlobalFinanceClient />
        </div>
    );
}
