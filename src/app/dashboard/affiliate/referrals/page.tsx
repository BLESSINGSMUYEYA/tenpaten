import { getAffiliateReferrals } from '@/lib/data/affiliates';
import Link from 'next/link';
import { ApplicationStatus } from '@prisma/client';
import { Users, ArrowLeft, TrendingUp, CheckCircle2 } from 'lucide-react';

export default async function Page() {
    const referrals = await getAffiliateReferrals();

    const total = referrals.length;
    const enrolled = referrals.filter(r => r.status === 'ENROLLED').length;
    const active = referrals.filter(r => !['ENROLLED', 'REJECTED', 'DRAFT'].includes(r.status)).length;

    return (
        <div className="w-full space-y-5 pb-6 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <Users className="w-3 h-3" />
                        Referral Network
                    </div>
                    <h1 className="text-2xl font-black text-brand-primary tracking-tight">My Referrals</h1>
                </div>
                <Link href="/dashboard/affiliate" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-brand-primary hover:border-brand-accent/40 transition-colors self-start sm:self-auto">
                    <ArrowLeft className="w-4 h-4" />
                    Dashboard
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total', value: total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'In Progress', value: active, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Enrolled', value: enrolled, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-black text-brand-primary">{s.value}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Referrals Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {referrals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-base font-black text-brand-primary mb-1">No Referrals Yet</h3>
                        <p className="text-sm text-gray-400 max-w-xs">
                            Share your referral link to start building your network. Every enrolled student earns you a commission.
                        </p>
                        <Link href="/dashboard/affiliate/links" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary-hover transition-colors">
                            Get Sharing Tools →
                        </Link>
                    </div>
                ) : (
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="px-5 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prospect</th>
                                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">University</th>
                                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Program</th>
                                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3.5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">Applied</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {referrals.map((ref) => (
                                <tr key={ref.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="font-bold text-sm text-brand-primary">{ref.prospect.fullName}</div>
                                        <div className="text-xs text-slate-400 md:hidden">{ref.program.university.name}</div>
                                    </td>
                                    <td className="px-4 py-4 hidden md:table-cell">
                                        <div className="text-sm font-medium text-slate-600">{ref.program.university.name}</div>
                                    </td>
                                    <td className="px-4 py-4 hidden lg:table-cell">
                                        <div className="text-sm font-medium text-slate-600">{ref.program.name}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${ref.status === ApplicationStatus.ENROLLED
                                                ? 'bg-green-100 text-green-700'
                                                : ref.status === ApplicationStatus.OFFER_ACCEPTED || ref.status === ApplicationStatus.OFFER_ISSUED
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : ref.status === ApplicationStatus.COUNTRY_REVIEW || ref.status === ApplicationStatus.UNIVERSITY_REVIEW
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : ref.status === 'REJECTED'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {ref.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 hidden sm:table-cell">
                                        <div className="text-xs font-medium text-slate-400">{new Date(ref.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
