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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Institutional Registry</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage and review student applications for your institution.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#d5a22d]/10 text-[#d5a22d] rounded-xl text-sm font-black uppercase tracking-widest border border-[#d5a22d]/20">
                    <FileText className="w-4 h-4" />
                    <span>{total} Active Applications</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <form className="flex-1 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[300px] relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d5a22d] transition-colors" />
                        <input 
                            name="search"
                            defaultValue={searchTerm}
                            placeholder="Search by student name, email, or program..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-0 rounded-xl text-sm font-medium transition-all"
                        />
                    </div>
                    <select 
                        name="sortBy"
                        defaultValue={sortBy as string}
                        className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-0 rounded-xl text-sm font-bold transition-all cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="merit-desc">Top Merit</option>
                        <option value="name-asc">A-Z Name</option>
                    </select>
                    <select 
                        name="programId"
                        defaultValue={programFilter}
                        className="px-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-0 rounded-xl text-sm font-bold transition-all cursor-pointer"
                    >
                        <option value="ALL">All Programs</option>
                        {universityPrograms.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <Button type="submit" className="bg-[#36335e] text-white hover:bg-[#2a284a] rounded-xl px-6 font-bold h-11">
                        Filter
                    </Button>
                </form>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#36335e] text-white">
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Student Details</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Program Profile</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Submitted On</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedApps.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#36335e]/5 flex items-center justify-center text-[#36335e] group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-[#36335e] group-hover:text-[#d5a22d] transition-colors">
                                                    {app.prospect.fullName}
                                                </h3>
                                                <p className="text-xs font-bold text-gray-400 mt-0.5">{app.prospect.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-sm font-black text-[#36335e]">
                                                <GraduationCap className="w-4 h-4 text-[#d5a22d]" />
                                                <span className="truncate max-w-[200px]">{app.program.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tight">
                                                <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                                <span>{app.program.university.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={app.status as ApplicationStatus} />
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Link href={`/dashboard/school/applications/${app.id}`}>
                                            <Button size="icon" variant="ghost" className="rounded-xl text-[#36335e] hover:bg-[#36335e] hover:text-[#d5a22d] transition-all">
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                         <Link href={`?page=${currentPage - 1}${searchTerm ? `&search=${searchTerm}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${programFilter ? `&programId=${programFilter}` : ''}${tierFilter ? `&meritTier=${tierFilter}` : ''}`}>
                            <Button
                                disabled={!hasPrevPage}
                                variant="outline"
                                className="rounded-xl text-xs font-black uppercase tracking-[0.1em]"
                            >
                                Previous
                            </Button>
                        </Link>
                        <Link href={`?page=${currentPage + 1}${searchTerm ? `&search=${searchTerm}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}${sortBy ? `&sortBy=${sortBy}` : ''}${programFilter ? `&programId=${programFilter}` : ''}${tierFilter ? `&meritTier=${tierFilter}` : ''}`}>
                            <Button
                                disabled={!hasNextPage}
                                className="bg-[#36335e] text-[#d5a22d] hover:bg-[#2a284a] rounded-xl text-xs font-black uppercase tracking-[0.1em]"
                            >
                                Next
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
        DRAFT: "bg-gray-100 text-gray-500 border-gray-200",
        PAYMENT_PENDING: "bg-indigo-50 text-indigo-600 border-indigo-100",
        SUBMITTED: "bg-blue-50 text-blue-600 border-blue-100",
        COUNTRY_REVIEW: "bg-amber-50 text-amber-600 border-amber-100",
        UNIVERSITY_REVIEW: "bg-purple-50 text-purple-600 border-purple-100",
        OFFER_ISSUED: "bg-[#d5a22d]/10 text-[#d5a22d] border-[#d5a22d]/20",
        OFFER_ACCEPTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
        ENROLLED: "bg-[#36335e] text-[#d5a22d] border-[#36335e]",
        REJECTED: "bg-red-50 text-red-600 border-red-100",
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${styles[status]}`}>
            {status.replace('_', ' ')}
        </span>
    );
}
