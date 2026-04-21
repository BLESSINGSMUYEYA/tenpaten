import { getAffiliatesByCountry } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { approveAffiliate, rejectAffiliate } from '@/lib/actions/country-director';
import {
    Users,
    Mail,
    Calendar,
    CheckCircle,
    XCircle,
    Building2,
    ExternalLink,
    FileText,
    TrendingUp
} from 'lucide-react';

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const { page } = (await searchParams) || {};
    const currentPage = Number(page) || 1;
    const { affiliates, metadata } = await getAffiliatesByCountry(currentPage);

    return (
        <div className="w-full space-y-5 pb-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36335e]/10 text-[#36335e] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <Users className="w-3 h-3" />
                        Partner Ecosystem
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Affiliate Management</h1>
                    <p className="text-gray-500 mt-2 font-medium italic">Verify and manage regional referral partners and their performance.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="h-10 w-10 rounded-xl bg-[#d5a22d]/10 flex items-center justify-center text-[#d5a22d]">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Network Capacity</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{metadata.total} Active Partners</p>
                    </div>
                </div>
            </div>

            {affiliates.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#36335e]/5 text-slate-200">
                        <Users className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Partner Network Empty</h3>
                    <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                        Currently no registered affiliate partners in your country. New registrations will appear here for review.
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl shadow-xl shadow-[#36335e]/10 overflow-hidden border border-slate-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Partner Profile</th>
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Network Metrics</th>
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Commission</th>
                                        <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Status</th>
                                        <th className="px-5 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {affiliates.map((aff) => (
                                        <tr key={aff.id} className="group hover:bg-slate-50/50 transition-all duration-500">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-[#36335e]/5 flex items-center justify-center text-[#36335e] font-black text-xl shadow-inner group-hover:scale-110 group-hover:bg-[#36335e] group-hover:text-white transition-all duration-500">
                                                        {aff.user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-black text-slate-900 group-hover:text-[#36335e] transition-colors uppercase tracking-tight leading-none mb-2">
                                                            {aff.user.fullName}
                                                        </p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            <Mail className="w-3.5 h-3.5 text-[#d5a22d]" />
                                                            {aff.user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="space-y-1.5">
                                                    <p className="text-sm font-black text-slate-700 uppercase tracking-tight leading-tight">
                                                        {aff._count.referrals} Direct Referrals
                                                    </p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Building2 className="w-3.5 h-3.5 text-[#36335e]/40" />
                                                        {aff.university?.name || 'Continental Hub'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <TrendingUp className="w-4 h-4 text-[#d5a22d]" />
                                                    <span className="text-lg font-black text-[#36335e] tracking-tighter">
                                                        {aff.commissionRate}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border
                                            ${aff.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        aff.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                    {aff.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    {aff.status === 'PENDING' && (
                                                        <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                                                            <form action={async () => {
                                                                'use server';
                                                                await approveAffiliate(aff.id);
                                                            }}>
                                                                <Button size="icon" variant="ghost" className="h-10 w-10 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                                                                    <CheckCircle className="w-5 h-5" />
                                                                </Button>
                                                            </form>
                                                            <form action={async () => {
                                                                'use server';
                                                                await rejectAffiliate(aff.id);
                                                            }}>
                                                                <Button size="icon" variant="ghost" className="h-10 w-10 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                                                    <XCircle className="w-5 h-5" />
                                                                </Button>
                                                            </form>
                                                        </div>
                                                    )}
                                                    <Link href={`/dashboard/country-director/affiliates/${aff.id}`}>
                                                        <Button size="icon" variant="ghost" className="h-12 w-12 rounded-[1.25rem] text-slate-300 border border-transparent hover:border-slate-100 hover:text-[#36335e] hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all duration-300">
                                                            <ExternalLink className="w-6 h-6" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <Pagination totalPages={metadata.totalPages} currentPage={currentPage} />
                    </div>
                </>
            )}
        </div>
    );
}
