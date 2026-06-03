import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { getActiveSchoolId } from '@/lib/getActiveSchool';
import { PageHeader } from '@/components/ui/PageHeader';
import { School, Building2, MapPin, Search } from 'lucide-react';
import ManageSchoolButton from '@/components/dashboard/super-agent/ManageSchoolButton';
import Link from 'next/link';

export default async function SuperAgentSchoolsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const user = await requireRole('SCHOOL_SUPER_AGENT');
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search.toLowerCase() : '';

    // Get assignments
    const assignments = await prisma.schoolSuperAgentUniversity.findMany({
        where: {
            userId: user.id,
            university: {
                name: { contains: search, mode: 'insensitive' }
            }
        },
        include: {
            university: {
                include: {
                    country: true,
                    _count: { select: { programs: true } }
                }
            }
        },
        orderBy: { createdAt: 'asc' }
    });

    const activeSchoolId = await getActiveSchoolId();

    const universitiesData = await Promise.all(assignments.map(async (a) => {
        const uni = a.university;
        
        // Count applications
        const appsCount = await prisma.application.count({
            where: {
                program: { universityId: uni.id }
            }
        });

        // Sum revenue
        const successTransactions = await prisma.institutionalTransaction.aggregate({
            where: {
                universityId: uni.id,
                status: 'SUCCESS'
            },
            _sum: {
                totalAmount: true,
            }
        });

        return {
            ...uni,
            appsCount,
            revenue: successTransactions._sum.totalAmount || 0,
        };
    }));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <Building2 className="w-3.5 h-3.5" />
                        Portfolio Registry
                    </div>
                }
                title="Your Managed Institutions"
                subtitle="View and manage the schools assigned under your operator account."
            />

            {/* Toolbar / Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                <form className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Search schools by name..."
                        className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/20 transition-all text-indigo-900"
                    />
                </form>
                <div className="text-xs font-bold text-slate-400">
                    Showing <span className="text-brand-primary font-black">{universitiesData.length}</span> schools
                </div>
            </div>

            {/* Schools Grid */}
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
                                        {isActive && (
                                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest leading-none">
                                                Active Context
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-brand-primary tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {uni.name}
                                        </h4>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                            <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                                            {uni.country?.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-50" />

                                <div className="space-y-3.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Gross Volume</span>
                                        <span className="text-brand-primary font-black">{uni.revenue.toLocaleString()} MWK</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Applications</span>
                                        <span className="text-brand-primary font-black">{uni.appsCount} applicants</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-bold uppercase tracking-wider">Academic Programs</span>
                                        <span className="text-brand-primary font-black">{uni._count.programs} active</span>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-50" />

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
                    <h3 className="text-2xl font-black text-brand-primary">No Schools Match Your Search</h3>
                    <p className="text-slate-500 max-w-sm mx-auto italic">No institutions found matching "{search}". Try searching with a different keyword.</p>
                </div>
            )}
        </div>
    );
}
