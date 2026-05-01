import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Prisma, ApplicationStatus } from '@prisma/client';
import { FileText } from 'lucide-react';
import ApplicantListClient from '@/components/school/ApplicantListClient';
import ExportButton from '@/components/school/ExportButton';

export default async function SchoolApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    let universityId = (session?.user as any)?.managedUniversityId;

    if (userRole !== 'SCHOOL_ADMIN') redirect('/dashboard');

    if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true },
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) redirect('/dashboard');

    // ── Parse search params ──────────────────────────────────────────────────
    const params = await searchParams;
    const searchTerm     = typeof params.search    === 'string' ? params.search    : undefined;
    const statusFilter   = typeof params.status    === 'string' && params.status    !== 'ALL' ? params.status    : undefined;
    const programFilter  = typeof params.programId === 'string' && params.programId !== 'ALL' ? params.programId : undefined;
    const sortBy         = typeof params.sortBy    === 'string' ? params.sortBy    : 'rank';
    const panelId        = typeof params.panel     === 'string' ? params.panel     : null;
    const currentPage    = Math.max(1, parseInt(typeof params.page === 'string' ? params.page : '1') || 1);
    const itemsPerPage   = 15;

    // ── Programmes for filter dropdown ────────────────────────────────────────
    const universityPrograms = await prisma.program.findMany({
        where: { universityId },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    // ── Build WHERE clause ────────────────────────────────────────────────────
    const where: Prisma.ApplicationWhereInput = {
        program: { universityId },
        ...(searchTerm && {
            OR: [
                { prospect: { fullName: { contains: searchTerm, mode: 'insensitive' } } },
                { prospect: { email:    { contains: searchTerm, mode: 'insensitive' } } },
            ],
        }),
        ...(statusFilter  && { status:    statusFilter  as any }),
        ...(programFilter && { programId: programFilter }),
    };

    // ── Build ORDER BY ────────────────────────────────────────────────────────
    const orderBy: Prisma.ApplicationOrderByWithRelationInput =
        sortBy === 'merit-desc' ? { meritScore: 'desc' }           :
        sortBy === 'name-asc'   ? { prospect: { fullName: 'asc' } } :
        sortBy === 'oldest'     ? { createdAt: 'asc' }              :
        sortBy === 'newest'     ? { createdAt: 'desc' }             :
        // Default: rank ascending (nulls last via Prisma nulls: 'last')
        { rank: { sort: 'asc', nulls: 'last' } };

    // ── Paginated fetch ───────────────────────────────────────────────────────
    const [total, applicants] = await Promise.all([
        prisma.application.count({ where }),
        prisma.application.findMany({
            where,
            orderBy,
            skip:  (currentPage - 1) * itemsPerPage,
            take:  itemsPerPage,
            include: {
                prospect:      { select: { fullName: true, email: true } },
                program:       { select: { id: true, name: true } },
                statusHistory: {
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        status: true,
                        changedBy: true,
                        note: true,
                        createdAt: true,
                        isOverride: true,
                        overrideReason: true,
                    },
                },
            },
        }),
    ]);

    const totalPages = Math.ceil(total / itemsPerPage);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#1d1b41] tracking-tight">
                        Applicant Registry
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm italic">
                        Review, rank, and action student applications across all programmes.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <ExportButton />
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#d5a22d]/10 text-[#d5a22d] rounded-xl text-sm font-black uppercase tracking-widest border border-[#d5a22d]/20">
                        <FileText className="w-4 h-4" />
                        <span>{total} Applications</span>
                    </div>
                </div>
            </div>

            {/* Client shell — owns all interactivity */}
            <ApplicantListClient
                applicants={applicants as any}
                programs={universityPrograms}
                total={total}
                currentPage={currentPage}
                totalPages={totalPages}
                initialPanelId={panelId}
            />
        </div>
    );
}
