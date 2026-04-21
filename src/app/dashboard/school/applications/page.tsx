import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Prisma, ApplicationStatus } from '@prisma/client';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
    GraduationCap, 
    FileText, 
    Search, 
    Filter, 
    User, 
    Building2, 
    Calendar, 
    ArrowRight,
    Sparkles,
    Trophy,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    Clock,
    LayoutGrid,
    ChevronDown
} from 'lucide-react';
import { calculateMeritScore, AcademicInfo } from '@/lib/utils/scoring';

export default async function SchoolApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    let universityId = (session?.user as any)?.managedUniversityId;

    if (userRole !== 'SCHOOL_ADMIN') {
        redirect('/dashboard');
    }

    if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) {
        redirect('/dashboard');
    }

    const awaitedSearchParams = await searchParams;
    const { 
        search, 
        status, 
        page, 
        sortBy = 'newest', 
        programId, 
        meritTier 
    } = awaitedSearchParams;

    const searchTerm = typeof search === 'string' ? search : undefined;
    const statusFilter = typeof status === 'string' && status !== 'ALL' ? status : undefined;
    const programFilter = typeof programId === 'string' && programId !== 'ALL' ? programId : undefined;
    const tierFilter = typeof meritTier === 'string' && meritTier !== 'ALL' ? meritTier : undefined;
    const currentPage = parseInt(typeof page === 'string' ? page : '1') || 1;
    const itemsPerPage = 12;

    // Fetch university programs for the filter dropdown
    const universityPrograms = await prisma.program.findMany({
        where: { universityId },
        select: { id: true, name: true }
    });

    // Base query for applications
    const where: Prisma.ApplicationWhereInput = {
        program: { universityId },
        ...(searchTerm && {
            OR: [
                { prospect: { fullName: { contains: searchTerm, mode: 'insensitive' } } },
                { prospect: { email: { contains: searchTerm, mode: 'insensitive' } } },
            ]
        }),
        ...(statusFilter && { status: statusFilter as any }),
        ...(programFilter && { programId: programFilter })
    };

    // We fetch ALL matching applications to perform multi-dimensional sorting/filtering (like merit)
    // For extreme scale, this would need to move to DB-level JSON indexing, but for typical school loads this is fine and more flexible.
    const rawApplications = await prisma.application.findMany({
        where,
        include: {
            prospect: { select: { fullName: true, email: true } },
            program: { select: { name: true, university: { select: { name: true } } } }
        }
    });

    // Process and score all applications
    const scoredApps = rawApplications.map(app => ({
        ...app,
        merit: calculateMeritScore(app.academicInfo as unknown as AcademicInfo)
    }));

    // Apply Merit Tier filtering in JS
    let filteredApps = scoredApps;
    if (tierFilter === 'EXCEPTIONAL') filteredApps = filteredApps.filter(a => a.merit.score >= 90);
    else if (tierFilter === 'HIGH') filteredApps = filteredApps.filter(a => a.merit.score >= 80);
    else if (tierFilter === 'STRONG') filteredApps = filteredApps.filter(a => a.merit.score >= 70);
    else if (tierFilter === 'GOOD') filteredApps = filteredApps.filter(a => a.merit.score >= 60);

    // Apply Sorting in JS
    filteredApps.sort((a, b) => {
        if (sortBy === 'merit-desc') return b.merit.score - a.merit.score;
        if (sortBy === 'merit-asc') return a.merit.score - b.merit.score;
        if (sortBy === 'name-asc') return a.prospect.fullName.localeCompare(b.prospect.fullName);
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        // default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Calculate Pagination
    const total = filteredApps.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const paginatedApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    // Header Metrics
    const avgScore = total > 0 
        ? Math.round(filteredApps.reduce((acc, curr) => acc + curr.merit.score, 0) / total)
        : 0;
    
    const topTalent = filteredApps[0] && filteredApps[0].merit.score >= 90 ? filteredApps[0] : null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Powerful Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.3em] border border-[#d5a22d]/20">
                        <Sparkles className="w-3 h-3" />
                        Admissions Intelligence Hub
                    </div>
                    <h1 className="text-5xl font-black text-[#1d1b41] tracking-tight leading-tight">
                        Student Selection <span className="text-slate-300">Registry</span>
                    </h1>
                    <p className="text-slate-500 font-bold max-w-xl text-sm leading-relaxed">
                        Precision-targeted filtering and sorting to identify top-tier candidates from your <span className="text-[#1d1b41]">{total} active</span> applications.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <Button variant="outline" className="rounded-2xl border-gray-100 text-slate-500 font-black text-[10px] uppercase tracking-widest px-8 h-16 bg-white shadow-xl shadow-slate-100 flex items-center gap-3 group/download border-2 hover:border-[#1d1b41] hover:text-[#1d1b41] transition-all">
                        <FileText className="w-4 h-4 transition-transform group-hover/download:-translate-y-1" />
                        Export Data
                    </Button>
                    <div className="bg-[#1d1b41] px-8 py-5 rounded-[2rem] shadow-2xl shadow-[#1d1b41]/20 flex items-center gap-6 border border-white/10">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#d5a22d]">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{avgScore}%</div>
                            <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Avg Match</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Talent Spotlight */}
            {topTalent && (
                <div className="relative overflow-hidden bg-[#1d1b41] rounded-[3rem] p-10 text-white shadow-2xl shadow-[#1d1b41]/30 border border-white/5 group animate-in zoom-in-95 duration-700">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Sparkles className="w-64 h-64 text-[#d5a22d]" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-6 max-w-2xl">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#d5a22d] text-[#1d1b41] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#d5a22d]/20">
                                <Trophy className="w-4 h-4" />
                                Tier 1 Candidate
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
                                {topTalent.prospect.fullName}
                            </h2>
                            <p className="text-white/70 text-xl font-bold leading-relaxed max-w-lg">
                                Exceptional profile matching for <span className="text-[#d5a22d]">{topTalent.program.name}</span> with a <span className="text-white font-black">{topTalent.merit.score}%</span> proficiency score.
                            </p>
                        </div>
                        <div className="shrink-0 w-full md:w-auto">
                            <Link href={`/dashboard/school/applications/${topTalent.id}`} className="block">
                                <Button className="w-full md:w-auto bg-white text-[#1d1b41] hover:bg-[#d5a22d] hover:text-[#1d1b41] rounded-2xl font-black px-12 py-10 h-auto shadow-2xl group/btn text-xl transition-all active:scale-95">
                                    Strategic Review
                                    <ArrowRight className="ml-3 w-8 h-8 transition-transform group-hover/btn:translate-x-3" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Hub */}
            <Card className="rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
                <CardContent className="p-10">
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Identifier</label>
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#d5a22d] transition-colors" />
                                <input 
                                    name="search"
                                    defaultValue={searchTerm}
                                    placeholder="Name/Email lookup..."
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-4 focus:ring-[#d5a22d]/5 rounded-2xl text-sm font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ordering</label>
                            <select 
                                name="sortBy"
                                defaultValue={sortBy as string}
                                className="w-full px-5 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-4 focus:ring-[#d5a22d]/5 rounded-2xl text-sm font-bold transition-all appearance-none cursor-pointer"
                            >
                                <option value="newest">Chronological: Newest</option>
                                <option value="merit-desc">Proficiency: High/Low</option>
                                <option value="merit-asc">Proficiency: Low/High</option>
                                <option value="name-asc">Alphabetical: A-Z</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Academic Tier</label>
                            <select 
                                name="meritTier"
                                defaultValue={tierFilter}
                                className="w-full px-5 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-4 focus:ring-[#d5a22d]/5 rounded-2xl text-sm font-bold transition-all appearance-none cursor-pointer"
                            >
                                <option value="ALL">All Match Grades</option>
                                <option value="EXCEPTIONAL">Exceptional (90%+)</option>
                                <option value="HIGH">High (80%+)</option>
                                <option value="STRONG">Strong (70%+)</option>
                                <option value="GOOD">Standard (60%+)</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Departmental Program</label>
                            <select 
                                name="programId"
                                defaultValue={programFilter}
                                className="w-full px-5 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-4 focus:ring-[#d5a22d]/5 rounded-2xl text-sm font-bold transition-all appearance-none cursor-pointer"
                            >
                                <option value="ALL">Global Admissions</option>
                                {universityPrograms.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <Button className="w-full bg-[#1d1b41] text-white hover:bg-black rounded-2xl py-8 h-auto font-black shadow-2xl shadow-[#1d1b41]/20 active:scale-95 transition-all text-xs uppercase tracking-widest">
                                Refresh Registry
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Applications Registry Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Candidate Nexus</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Proficiency Profile</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Chronicle</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Lifecycle Status</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedApps.length > 0 ? paginatedApps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/30 transition-all duration-500 group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-[#1d1b41]/5 flex items-center justify-center text-[#1d1b41] group-hover:bg-[#1d1b41] group-hover:text-[#d5a22d] transition-all relative border border-slate-100 group-hover:border-[#1d1b41] group-hover:shadow-xl group-hover:shadow-[#1d1b41]/20">
                                                <User className="w-6 h-6" />
                                                {app.merit.score >= 90 && (
                                                    <div className="absolute -top-1.5 -right-1.5 bg-[#d5a22d] rounded-xl p-1.5 border-4 border-white shadow-2xl shadow-[#d5a22d]/30">
                                                        <Sparkles className="w-3 h-3 text-[#1d1b41]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-[#1d1b41] text-lg group-hover:text-[#d39c1d] transition-colors leading-none tracking-tight">
                                                        {app.prospect.fullName}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-3 mt-2.5">
                                                    <span className="text-[10px] font-black text-[#d5a22d] uppercase tracking-widest bg-[#d5a22d]/5 px-2 py-1 rounded-lg border border-[#d5a22d]/10">
                                                        {app.program.name}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                                        {app.prospect.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-10 py-8">
                                        <div className="space-y-2.5 w-56">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest leading-none" style={{ color: app.merit.color }}>
                                                    {app.merit.label}
                                                </span>
                                                <span className="text-sm font-black italic tracking-tighter" style={{ color: app.merit.color }}>
                                                    {app.merit.score}% Profile Match
                                                </span>
                                            </div>
                                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                <div 
                                                    className="h-full transition-all duration-1000 ease-out relative" 
                                                    style={{ 
                                                        width: `${app.merit.score}%`, 
                                                        backgroundColor: app.merit.color
                                                    }} 
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-[#1d1b41]">
                                                <Clock className="w-4 h-4 text-[#d5a22d]" />
                                                {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 ml-6 uppercase">Submission Finalized</span>
                                        </div>
                                    </td>

                                    <td className="px-10 py-8">
                                        <StatusBadge status={app.status as ApplicationStatus} />
                                    </td>

                                    <td className="px-10 py-8 text-center">
                                        <Link href={`/dashboard/school/applications/${app.id}`}>
                                            <Button size="icon" variant="ghost" className="rounded-2xl text-[#1d1b41] hover:bg-[#1d1b41] hover:text-[#d39c1d] transition-all h-14 w-14 shadow-sm border border-slate-100 hover:border-[#1d1b41] hover:shadow-2xl hover:shadow-[#1d1b41]/20">
                                                <ArrowRight className="w-6 h-6" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center bg-slate-50/20">
                                        <div className="flex flex-col items-center gap-6 text-slate-200">
                                            <Search className="w-24 h-24 stroke-[1px]" />
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-slate-400 tracking-tight">Registry Search Exhausted</h3>
                                                <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Adjust filters to broaden admissions scope</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-10 py-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Displaying <span className="text-[#1d1b41]">{paginatedApps.length}</span> of <span className="text-[#1d1b41]">{total}</span> Registry Entries
                    </p>
                    <div className="flex items-center gap-4">
                         <Link href={`?page=${currentPage - 1}${searchTerm ? `&search=${searchTerm}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${programFilter ? `&programId=${programFilter}` : ''}${tierFilter ? `&meritTier=${tierFilter}` : ''}`}>
                            <Button
                                disabled={!hasPrevPage}
                                variant="outline"
                                className="rounded-2xl text-[10px] font-black uppercase tracking-widest px-8 h-14 border-2 border-slate-200 hover:border-[#1d1b41] hover:text-[#1d1b41] bg-white transition-all shadow-sm"
                            >
                                Previous
                            </Button>
                        </Link>
                        <Link href={`?page=${currentPage + 1}${searchTerm ? `&search=${searchTerm}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${programFilter ? `&programId=${programFilter}` : ''}${tierFilter ? `&meritTier=${tierFilter}` : ''}`}>
                            <Button
                                disabled={!hasNextPage}
                                className="bg-[#1d1b41] text-white hover:bg-black rounded-2xl text-[10px] font-black uppercase tracking-widest px-10 h-14 shadow-2xl shadow-[#1d1b41]/20 transition-all active:scale-95"
                            >
                                Next Strategy
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const styles = {
        DRAFT: "bg-slate-100 text-slate-500 border-slate-200 shadow-slate-100/50",
        PAYMENT_PENDING: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-500/10",
        SUBMITTED: "bg-[#1d1b41] text-[#d5a22d] border-[#1d1b41] shadow-[#1d1b41]/20 font-black",
        COUNTRY_REVIEW: "bg-indigo-50 text-indigo-700 border-indigo-200",
        UNIVERSITY_REVIEW: "bg-violet-50 text-violet-700 border-violet-200",
        OFFER_ISSUED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        OFFER_ACCEPTED: "bg-[#d5a22d] text-[#1d1b41] border-[#d5a22d] shadow-[#d5a22d]/20 font-black",
        ENROLLED: "bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/30 font-black px-6",
        REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
        <span className={`px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all inline-flex items-center gap-2 ${styles[status]}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
            {status.replace(/_/g, ' ')}
        </span>
    );
}
