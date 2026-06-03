import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getActiveSchoolId } from '@/lib/getActiveSchool';
import { Prisma } from '@prisma/client';
import { FileText, Users } from 'lucide-react';
import ApplicantListClient from '@/components/school/ApplicantListClient';
import ExportButton from '@/components/school/ExportButton';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function SchoolApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    let universityId = (session?.user as any)?.managedUniversityId;

    if (userRole !== 'SCHOOL_ADMIN' && userRole !== 'SCHOOL_SUPER_AGENT') redirect('/dashboard');

    if (userRole === 'SCHOOL_SUPER_AGENT') {
        universityId = await getActiveSchoolId();
    } else if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true },
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) redirect('/dashboard');

    const university = await prisma.university.findUnique({
        where: { id: universityId },
        select: { name: true }
    });

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

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <PageHeader 
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Users className="w-3.5 h-3.5" />
                        Admissions Pipeline
                    </div>
                }
                title="Applicant Registry"
                subtitle={
                    <>
                        Managing <span className="font-bold text-brand-accent">{total}</span> active applications for <span className="font-bold text-brand-primary">{university?.name}</span>.
                    </>
                }
                action={
                    <div className="flex items-center gap-3">
                        <ExportButton />
                    </div>
                }
            />

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <ApplicantListClient
                    applicants={applicants as any}
                    programs={universityPrograms}
                    total={total}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    initialPanelId={panelId}
                />
            </div>
        </div>
    );
}
