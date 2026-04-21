import { getAffiliateStats as getRawAffiliate } from '@/lib/data/affiliates';
import { getAffiliateReferrals } from '@/lib/data/affiliates';
import CopyReferralLink from './copy-referral-link';
import Link from 'next/link';
import {
    TrendingUp, Users, DollarSign, Share2,
    ArrowRight, LayoutDashboard, Link2, CheckCircle2, Clock, XCircle
} from 'lucide-react';

export default async function Page() {
    const affiliate = await getRawAffiliate();

    if (!affiliate) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-gray-300" />
                </div>
                <h1 className="text-2xl font-black text-[#36335e] tracking-tight mb-2">Partner Portal</h1>
                <p className="text-gray-500 max-w-sm">You are not registered as an affiliate yet or your profile is pending approval.</p>
            </div>
        );
    }

    const referrals = await getAffiliateReferrals();
    const totalReferrals = referrals.length;
    const enrolledReferrals = referrals.filter(r => r.status === 'ENROLLED').length;
    const activeReferrals = referrals.filter(r => !['ENROLLED', 'REJECTED', 'DRAFT'].includes(r.status)).length;
    const estimatedEarnings = enrolledReferrals * (affiliate.commissionRate || 10) * 10; // simplified mock

    const statusBadge = affiliate.status === 'APPROVED'
        ? { label: 'Active', icon: CheckCircle2, cls: 'bg-green-500/20 text-green-300 border-green-500/30' }
        : affiliate.status === 'PENDING'
            ? { label: 'Pending Review', icon: Clock, cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' }
            : { label: 'Rejected', icon: XCircle, cls: 'bg-red-500/20 text-red-300 border-red-500/30' };

    const StatusIcon = statusBadge.icon;

    const statCards = [
        { label: 'Total Referrals', value: totalReferrals, icon: Users, color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-400' },
        { label: 'Active Applications', value: activeReferrals, icon: TrendingUp, color: 'from-purple-500/20 to-purple-600/20', iconColor: 'text-purple-400' },
        { label: 'Successful Enrolments', value: enrolledReferrals, icon: CheckCircle2, color: 'from-green-500/20 to-green-600/20', iconColor: 'text-green-400' },
        { label: 'Estimated Earnings', value: `$${estimatedEarnings}`, icon: DollarSign, color: 'from-[#d5a22d]/20 to-[#b08523]/20', iconColor: 'text-[#d5a22d]' },
    ];

    return (
        <div className="w-full space-y-5 pb-6 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <TrendingUp className="w-3 h-3" />
                        Affiliate Partner
                    </div>
                    <h1 className="text-2xl font-black text-[#36335e] tracking-tight">Partner Dashboard</h1>
                    <p className="text-slate-500 mt-1 font-medium text-sm">
                        Managing referrals as <span className="font-black text-[#d5a22d]">{affiliate.referralCode}</span>
                    </p>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${statusBadge.cls}`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusBadge.label}
                </div>
            </div>

            {/* Referral Link Banner */}
            <div className="bg-gradient-to-br from-[#36335e] to-[#2a284a] rounded-2xl shadow-xl shadow-[#36335e]/20 p-5 md:p-6 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#d5a22d]/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none group-hover:bg-[#d5a22d]/20 transition-colors duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                                <Share2 className="w-4 h-4 text-[#d5a22d]" />
                            </div>
                            <h2 className="text-base font-black tracking-tight">Spread Your Referral Link</h2>
                        </div>
                        <p className="text-white/60 font-medium text-sm max-w-sm">
                            Every student who registers with your link earns you a commission when they enrol.
                        </p>
                    </div>
                    <div className="w-full md:w-auto md:min-w-[380px]">
                        <CopyReferralLink referralCode={affiliate.referralCode} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 border border-white/5 shadow-sm space-y-3`}>
                            <div className={`w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center ${stat.iconColor}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#36335e]">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-500 mt-0.5">{stat.label}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Program Details + Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Program Details */}
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Program Details</h4>
                    <div className="space-y-2">
                        {[
                            { label: 'Reward Type', value: affiliate.rewardType },
                            { label: 'Commission Rate', value: `${affiliate.commissionRate}%` },
                            { label: 'Referral Code', value: affiliate.referralCode },
                        ].map(row => (
                            <div key={row.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <span className="text-sm font-bold text-[#36335e]">{row.label}</span>
                                <span className="text-xs font-black text-[#d5a22d] px-2 py-1 bg-white rounded-lg border border-gray-100">{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</h4>
                    <div className="space-y-2">
                        {[
                            { label: 'View My Referrals', href: '/dashboard/affiliate/referrals', icon: Users, desc: `${totalReferrals} total referrals` },
                            { label: 'Earnings Breakdown', href: '/dashboard/affiliate/earnings', icon: DollarSign, desc: `Est. $${estimatedEarnings} earned` },
                            { label: 'Sharing Tools', href: '/dashboard/affiliate/links', icon: Link2, desc: 'Links, banners & tips' },
                        ].map(action => {
                            const ActionIcon = action.icon;
                            return (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#d5a22d]/40 hover:bg-[#d5a22d]/5 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#36335e]/5 flex items-center justify-center">
                                            <ActionIcon className="w-4 h-4 text-[#36335e]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-[#36335e]">{action.label}</div>
                                            <div className="text-xs text-slate-400">{action.desc}</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#d5a22d] transition-colors" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Referrals Preview */}
            {referrals.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recent Referrals</h4>
                        <Link href="/dashboard/affiliate/referrals" className="text-xs font-bold text-[#d5a22d] hover:underline flex items-center gap-1">
                            View all <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {referrals.slice(0, 5).map((ref) => (
                            <div key={ref.id} className="flex items-center justify-between px-5 py-3">
                                <div>
                                    <div className="text-sm font-bold text-[#36335e]">{ref.prospect.fullName}</div>
                                    <div className="text-xs text-slate-400">{ref.program.university.name} · {ref.program.name}</div>
                                </div>
                                <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide ${ref.status === 'ENROLLED' ? 'bg-green-100 text-green-700' :
                                        ['OFFER_ACCEPTED', 'OFFER_ISSUED'].includes(ref.status) ? 'bg-blue-100 text-blue-700' :
                                            ['COUNTRY_REVIEW', 'UNIVERSITY_REVIEW'].includes(ref.status) ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                    }`}>
                                    {ref.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
