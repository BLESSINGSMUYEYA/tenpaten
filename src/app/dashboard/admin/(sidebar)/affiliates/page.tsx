import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllAffiliates } from '@/lib/data/affiliates';
import AdminAffiliatesView from '@/components/admin/AdminAffiliatesView';
import { Users, ShieldCheck } from 'lucide-react';

export default async function AdminAffiliatesPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const session = await auth();

    if (session?.user?.role !== 'SUPER_ADMIN') {
        redirect('/dashboard');
    }

    const awaitedSearchParams = await searchParams;
    const page = Number(awaitedSearchParams.page) || 1;
    const { affiliates, metadata } = await getAllAffiliates(page);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Affiliate Partners</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage global affiliate applications and status across the platform.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#d5a22d]/10 text-[#d5a22d] rounded-xl text-sm font-black uppercase tracking-widest border border-[#d5a22d]/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Administrative Oversight</span>
                </div>
            </div>

            <AdminAffiliatesView
                initialAffiliates={affiliates}
                metadata={metadata}
            />
        </div>
    );
}
