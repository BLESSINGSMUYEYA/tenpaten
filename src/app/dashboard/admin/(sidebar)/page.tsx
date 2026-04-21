import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Users, School, FileText, TrendingUp, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminStats } from '@/lib/actions/analytics';
import StatsCard from '@/components/dashboard/analytics/StatsCard';
import AdminDashboardChart from '@/components/dashboard/analytics/AdminDashboardChart';

export default async function AdminDashboardPage() {
    const session = await auth();

    if (session?.user?.role !== 'SUPER_ADMIN') {
        redirect('/dashboard');
    }

    const { metrics, chartData } = await getAdminStats();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Platform overview and management.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#36335e] text-white rounded-xl text-sm font-semibold shadow-lg shadow-[#36335e]/20">
                    <ShieldCheck className="w-4 h-4 text-[#d5a22d]" />
                    <span>Administrator Access</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((stat, idx) => (
                    <StatsCard
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        trendUp={true}
                    />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AdminDashboardChart data={chartData} />
                </div>

                <div className="bg-gradient-to-br from-[#36335e] to-[#2a284a] rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group h-full">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#d5a22d]/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none group-hover:bg-[#d5a22d]/20 transition-colors duration-500" />

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[#d5a22d]">Global Status</span>
                        </div>
                        <h2 className="text-2xl font-black mb-2 tracking-tight">Platform Health</h2>
                        <p className="text-white/70 text-sm mb-8 leading-relaxed">Infrastructure monitoring.</p>

                        <div className="space-y-6 mt-auto">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <span className="text-sm font-medium text-white/80">Database</span>
                                <span className="text-xs font-bold px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">Healthy</span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <span className="text-sm font-medium text-white/80">WebSocket</span>
                                <span className="text-xs font-bold px-2 py-1 bg-green-500/20 text-green-400 rounded-lg">Connected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-[#36335e] tracking-tight">System Controls</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href="/dashboard/admin/users/create" className="p-6 rounded-2xl border border-gray-100 hover:border-[#d5a22d] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                        <div className="w-10 h-10 rounded-xl bg-[#36335e]/5 flex items-center justify-center group-hover:bg-[#36335e] transition-colors shadow-sm">
                            <UserCheck className="w-5 h-5 text-[#36335e] group-hover:text-[#d5a22d]" />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">Add New User</span>
                    </Link>
                    <Link href="/dashboard/admin/schools/create" className="p-6 rounded-2xl border border-gray-100 hover:border-[#d5a22d] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                        <div className="w-10 h-10 rounded-xl bg-[#36335e]/5 flex items-center justify-center group-hover:bg-[#36335e] transition-colors shadow-sm">
                            <School className="w-5 h-5 text-[#36335e] group-hover:text-[#d5a22d]" />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">Add University</span>
                    </Link>
                    <Link href="/dashboard/admin/users" className="p-6 rounded-2xl border border-gray-100 hover:border-[#d5a22d] hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                        <div className="w-10 h-10 rounded-xl bg-[#36335e]/5 flex items-center justify-center group-hover:bg-[#36335e] transition-colors shadow-sm">
                            <Users className="w-5 h-5 text-[#36335e] group-hover:text-[#d5a22d]" />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">Manage Staff</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
