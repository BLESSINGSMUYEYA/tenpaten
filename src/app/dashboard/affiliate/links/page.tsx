import { getAffiliateStats as getRawAffiliate } from '@/lib/data/affiliates';
import LinksClient from './LinksClient';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
    const affiliate = await getRawAffiliate();

    if (!affiliate) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-400">No affiliate profile found.</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-5 pb-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36335e]/10 text-[#36335e] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <Link2 className="w-3 h-3" />
                        Sharing Tools
                    </div>
                    <h1 className="text-2xl font-black text-[#36335e] tracking-tight">My Links</h1>
                    <p className="text-sm text-slate-500 mt-1">Copy, share and track your referral link</p>
                </div>
                <Link href="/dashboard/affiliate" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-[#36335e] hover:border-[#d5a22d]/40 transition-colors self-start sm:self-auto">
                    <ArrowLeft className="w-4 h-4" />
                    Dashboard
                </Link>
            </div>

            <LinksClient referralCode={affiliate.referralCode} />
        </div>
    );
}
