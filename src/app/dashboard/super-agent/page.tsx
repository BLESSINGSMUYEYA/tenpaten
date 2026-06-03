import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { getActiveSchoolId } from '@/lib/getActiveSchool';
import { PageHeader } from '@/components/ui/PageHeader';
import StatsCard from '@/components/dashboard/analytics/StatsCard';
import { Building2, School, Users, GraduationCap, Percent, Wallet, BarChart3, Star } from 'lucide-react';
import ManageSchoolButton from '@/components/dashboard/super-agent/ManageSchoolButton';
import Link from 'next/link';

export default async function SuperAgentDashboard() {
    const user = await requireRole('SCHOOL_SUPER_AGENT');

    // Get assignments
    const assignments = await prisma.schoolSuperAgentUniversity.findMany({
        where: { userId: user.id },
        include: {
            university: {
                include: {
                    country: true,
                    programs: {
                        select: { id: true }
                    },
                    _count: {
                        select: {
                            programs: true,
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    const universityIds = assignments.map(a => a.universityId);

    // Dynamic stats queries
    const [totalAppsCount, successTransactions] = await Promise.all([
        prisma.application.count({
            where: {
                program: { universityId: { in: universityIds } }
            }
        }),
        prisma.institutionalTransaction.aggregate({
            where: {
                universityId: { in: universityIds },
                status: 'SUCCESS'
            },
            _sum: {
                totalAmount: true,
                schoolAmount: true,
            }
        })
    ]);

    const grossVolume = successTransactions._sum.totalAmount || 0;
    const schoolEarnings = successTransactions._sum.schoolAmount || 0;

    // Map stats to university objects
    const universitiesData = await Promise.all(assignments.map(async (a) => {
        const uni = a.university;
        
        // Count applications for this specific university
        const appsCount = await prisma.application.count({
            where: {
                program: { universityId: uni.id }
            }
        });

        return {
            ...uni,
            appsCount,
        };
    }));

    const activeSchoolId = await getActiveSchoolId();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <Star className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        Schools Super Agent Dashboard
                    </div>
                }
                title="Consolidated Portfolio Overview"
                subtitle={`Welcome back, ${user.fullName || 'Super Agent'}. Managing operations across ${assignments.length} assigned institutions.`}
            />

            {/* Aggregated Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    label="Assigned Institutions"
                    value={assignments.length}
                    trend="Active Partners"
                />
                <StatsCard
                    label="Total Applications"
                    value={totalAppsCount}
                    trend="Across Portfolio"
                />
                <StatsCard
                    label="Portfolio Gross Volume"
                    value={`${grossVolume.toLocaleString()} MWK`}
                    trend="Application & Tuition Fees"
                />
                <StatsCard
                    label="Net Partner Earnings"
                    value={`${schoolEarnings.toLocaleString()} MWK`}
                    trend="Receivable by Schools"
                />
            </div>

            {/* List of Managed Universities */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-brand-primary" />
                        <h3 className="text-xl font-black text-brand-primary tracking-tight">Your Managed Schools</h3>
                    </div>
                    <Link href="/dashboard/super-agent/schools">
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
                            View Full List
                        </span>
                    </Link>
                </div>

                {universitiesData.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {universitiesData.map((uni) => {
                            const isActive = uni.id === activeSchoolId;
                            return (
                                <div
                                    key={uni.id}
                                    className={`relative group overflow-hidden bg-white rounded-[2.5rem] border p-8 space-y-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-between ${
                                        isActive
                                            ? 'border-indigo-500 shadow-xl shadow-indigo-500/5'
                                            : 'border-slate-100 shadow-xl shadow-slate-200/50'
                                    }`}
                                >
                                    {/* Top Header */}
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            {uni.logo ? (
                                                <img
                                                    src={uni.logo}
                                                    alt={uni.name}
                                                    className="w-14 h-14 rounded-2xl object-contain bg-slate-50 p-1 border border-slate-100"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold border border-indigo-100">
                                                    <School className="w-6 h-6" />
                                                </div>
                                            )}
                                            {isActive ? (
                                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest leading-none">
                                                    Active Context
                                                </span>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest leading-none border ${
                                                    uni.status === 'APPROVED' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                    {uni.status}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-brand-primary tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {uni.name}
                                            </h4>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                                {uni.country?.name || 'International'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-50" />

                                    {/* Stats Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Applications</span>
                                            <span className="text-xl font-black text-brand-primary mt-0.5">{uni.appsCount}</span>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Programs</span>
                                            <span className="text-xl font-black text-brand-primary mt-0.5">{uni._count.programs}</span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-50" />

                                    {/* Switch Context Button */}
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            ID: {uni.id.slice(-8).toUpperCase()}
                                        </span>
                                        <ManageSchoolButton schoolId={uni.id} schoolName={uni.name} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-16 text-center space-y-4 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300 border border-slate-100">
                            <School className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-brand-primary">No Schools Assigned</h3>
                        <p className="text-slate-500 max-w-sm mx-auto italic">You currently do not have any universities assigned to your portfolio. Please contact your Country Director or Super Admin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
