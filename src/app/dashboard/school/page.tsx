import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    FileText, CheckCircle2, Clock, AlertCircle, Users, Sparkles, 
    MessageSquare, Building2, ArrowRight, ImageIcon, Search, 
    ChevronRight, LayoutDashboard, GraduationCap 
} from 'lucide-react';
import Link from 'next/link';
import { submitUniversityForReview } from '@/app/actions/universityActions';
import { getSchoolStats } from '@/lib/actions/analytics';
import StatsCard from '@/components/dashboard/analytics/StatsCard';
import SchoolDashboardCharts from '@/components/dashboard/analytics/SchoolDashboardCharts';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { getHomeUrl } from '@/lib/navigation';
import SchoolQRCode from '@/components/school/SchoolQRCode';
import LiveActivityFeed from '@/components/school/LiveActivityFeed';
import TaskQueue from '@/components/school/TaskQueue';
import ProgrammeCard from '@/components/school/ProgrammeCard';

export default async function UniversityDashboard() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    if (userRole !== 'SCHOOL_ADMIN') {
        redirect(getHomeUrl(userRole));
    }

    let universityId = (session?.user as any)?.managedUniversityId;

    // Fallback: If session is stale (post-registration), fetch from DB
    if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    let university = null;
    let isDbConnected = true;

    try {
        if (universityId) {
            university = await prisma.university.findUnique({
                where: { id: universityId },
                include: {
                    programs: {
                        include: {
                            _count: {
                                select: { applications: true }
                            }
                        }
                    },
                    _count: {
                        select: { programs: true }
                    }
                }
            }) as any;
        }
    } catch (error) {
        console.error("Failed to connect to database for university:", error);
        isDbConnected = false;
    }

    if (!isDbConnected) {
        return (
            <div className="min-h-screen bg-gray-50/30 flex flex-col items-center py-12 px-4">
                <div className="w-full max-w-xl text-center space-y-6 pt-20">
                    <AlertCircle className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
                    <h1 className="text-3xl font-black text-[#36335e]">Database Unreachable</h1>
                    <p className="text-slate-500 font-medium pb-8 max-w-sm mx-auto">
                        We couldn't connect to the database. The server might be experiencing high traffic or temporarily sleeping.
                    </p>
                    <Link href={getHomeUrl(userRole)} className="px-8 py-4 bg-[#36335e] text-white rounded-2xl font-black hover:bg-[#d5a22d] transition-colors shadow-xl">
                        Retry Connection
                    </Link>
                </div>
            </div>
        );
    }

    if (!university) {
        redirect('/school/setup');
    }

    if (university.status === 'DRAFT' || university.status === 'REJECTED') {
        const readiness = {
            hasLogo: !!university.logo,
            hasDescription: !!university.description && university.description.length > 50,
            hasPrograms: university.programs.length > 0,
            hasGallery: university.images.length > 0,
        };

        const isReady = readiness.hasLogo && readiness.hasDescription && readiness.hasPrograms;

        return (
            <div className="min-h-screen bg-gray-50/30 p-6 md:p-12 animate-in fade-in duration-700">
                <div className="max-w-5xl mx-auto space-y-10">
                    {/* Header with Glassmorphism Effect */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative p-1">
                        <div className="space-y-3 relative z-10">
                            <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${university.status === 'REJECTED' ? 'bg-rose-50/80 border-rose-100 text-rose-700' : 'bg-[#d5a22d]/10 border-[#d5a22d]/20 text-[#d5a22d]'}`}>
                                {university.status === 'REJECTED' ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">{university.status} Submission Status</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-[#36335e] tracking-tighter uppercase leading-[0.9]">Launch <br className="hidden sm:block" /> Checklist</h1>
                            <p className="text-slate-500 font-bold text-base lg:text-lg max-w-xl">
                                {university.status === 'REJECTED'
                                    ? "Action required: Update your profile based on the director's feedback to resubmit."
                                    : "Establish your institution's global presence by completing these essential steps."}
                            </p>
                        </div>

                        {university.rejectionReason && (
                            <div className="bg-rose-50/50 backdrop-blur-xl border border-rose-100 p-8 rounded-[2.5rem] max-w-md animate-in slide-in-from-right-10 duration-700 shadow-[0_32px_64px_-16px_rgba(225,29,72,0.12)] border-rose-200/50">
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-12 transition-transform">
                                        <MessageSquare className="w-7 h-7 text-rose-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-rose-900 uppercase tracking-[0.3em] text-[10px] mb-2">Director's Feedback</h4>
                                        <p className="text-sm text-rose-700 leading-relaxed font-bold">
                                            {university.rejectionReason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Readiness Checklist */}
                        <div className="lg:col-span-2 space-y-6">
                            {[
                                {
                                    label: 'Global Identity',
                                    desc: 'Upload institution logo and brand assets',
                                    done: readiness.hasLogo,
                                    href: '/dashboard/school/profile',
                                    icon: Building2
                                },
                                {
                                    label: 'Academic Registry',
                                    desc: 'Register degree programs for application',
                                    done: readiness.hasPrograms,
                                    href: '/dashboard/school/programs',
                                    icon: Sparkles
                                },
                                {
                                    label: 'Visual Portfolio',
                                    desc: 'Showcase your campus experience via gallery',
                                    done: readiness.hasGallery,
                                    href: '/dashboard/school/profile',
                                    icon: ImageIcon
                                },
                                {
                                    label: 'Institutional Profile',
                                    desc: 'Detail your mission and history',
                                    done: readiness.hasDescription,
                                    href: '/dashboard/school/profile',
                                    icon: FileText
                                },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={`group flex items-center justify-between p-8 rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-[#36335e]/5 hover:-translate-y-1.5 
                                        ${item.done ? 'bg-white border-[#36335e]/10' : 'bg-white border-gray-100 hover:border-[#36335e]/30'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm
                                            ${item.done ? 'bg-[#36335e] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-[#36335e]/10 group-hover:text-[#36335e]'}`}>
                                            {item.done ? <CheckCircle2 className="w-8 h-8" /> : <item.icon className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <p className={`text-lg font-black uppercase tracking-tight transition-colors ${item.done ? 'text-[#36335e]' : 'text-gray-900 group-hover:text-[#36335e]'}`}>
                                                {item.label}
                                            </p>
                                            <p className="text-sm text-slate-400 font-bold">{item.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${item.done ? 'bg-slate-50 border-transparent' : 'border-gray-100 group-hover:bg-[#36335e] group-hover:text-white'}`}>
                                        <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1`} />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Submission Sidebar */}
                        <div className="space-y-6">
                            <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-700 
                                ${isReady ? 'bg-[#36335e] text-white border-[#36335e] shadow-2xl shadow-[#36335e]/30' : 'bg-white border-gray-100 text-[#36335e]'}`}>
                                <h3 className="text-2xl font-black tracking-tight mb-4">
                                    {university.status === 'REJECTED' ? 'Resubmission' : 'Submission'}
                                </h3>
                                <p className={`text-sm font-medium mb-8 leading-relaxed ${isReady ? 'text-white/70' : 'text-gray-500'}`}>
                                    {isReady
                                        ? "Your institution is ready for review. Once submitted, our team will verify your details within 24-48 hours."
                                        : "Complete the required identity, mission, and academic steps to submit your profile for review."}
                                </p>

                                <form action={async () => {
                                    'use server';
                                    await submitUniversityForReview(university.id);
                                }}>
                                    <button
                                        type="submit"
                                        disabled={!isReady}
                                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all transform active:scale-95 disabled:opacity-30 
                                            ${isReady
                                                ? 'bg-[#d5a22d] hover:bg-[#b08523] text-white shadow-xl shadow-[#d5a22d]/20'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {university.status === 'REJECTED' ? 'Resubmit for Review' : 'Submit for Final Review'}
                                    </button>
                                </form>
                            </div>

                            <div className="p-6 bg-white rounded-3xl border border-gray-100 flex gap-4 items-start">
                                <div className="p-2 bg-[#36335e]/10 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-[#36335e]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#36335e] text-sm">Pro Tip</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                        High-quality campus photos increase student engagement by up to 40%. Upload yours in the visuals section!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (university.status === 'PENDING') {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl border-2 border-[#36335e]/10 max-w-md w-full animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#36335e] to-[#4a4785] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#36335e]/20 animate-pulse">
                        <Clock className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#36335e] mb-4 tracking-tight">Under Review</h1>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                        Thank you for registering <span className="font-bold text-[#d5a22d]">{university.name}</span>. Our team is currently reviewing your application to ensure the highest quality of service.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 bg-[#36335e]/5 rounded-xl border border-[#36335e]/10">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#36335e] animate-pulse" />
                            <p className="text-sm font-bold text-[#36335e] uppercase tracking-wide text-left">Processing Application</p>
                        </div>
                        <p className="text-sm text-slate-400 italic">
                            You will receive an email once your account is active.
                        </p>
                    </div>
                </div>
            </div>
        );
    }


    // Calculate stats & Analytics
    const [stats, programs] = await Promise.all([
        getSchoolStats(university.id),
        (prisma.program as any).findMany({
            where: { universityId: university.id },
            select: { id: true, name: true, intake: true },
            orderBy: { name: 'asc' }
        }) as Promise<any[]>
    ]);

    const { 
        statusChartData, 
        programChartData, 
        totalApplications,
        taskQueue,
        yieldChartData
    } = stats;

    const appCounts = await (prisma.application as any).groupBy({
        by: ['programId', 'status'],
        where: { programId: { in: programs.map(p => p.id) } },
        _count: { id: true }
    });

    const rankCounts = await (prisma.application as any).groupBy({
        by: ['programId'],
        where: { programId: { in: programs.map(p => p.id) }, rank: { not: null } },
        _count: { id: true }
    });

    const programmeCardsData = programs.map(p => {
        const pCounts = appCounts.filter((c: any) => c.programId === p.id);
        const total = pCounts.reduce((acc: number, curr: any) => acc + curr._count.id, 0);
        const ranked = rankCounts.find((c: any) => c.programId === p.id)?._count.id || 0;
        
        const offersIssued = pCounts
            .filter((c: any) => c.status === 'OFFER_ISSUED')
            .reduce((acc: number, curr: any) => acc + curr._count.id, 0);
            
        const offersAccepted = pCounts
            .filter((c: any) => ['OFFER_ACCEPTED', 'ENROLLED'].includes(c.status))
            .reduce((acc: number, curr: any) => acc + curr._count.id, 0);
        
        return {
            programId: p.id,
            programName: p.name,
            intake: p.intake,
            totalApps: total,
            rankedApps: ranked,
            offersIssued,
            offersAccepted,
            quota: 50, // Default quota for now, could be added to schema later
        };
    });

    const activeTasksCount = taskQueue.pendingScoring + taskQueue.pendingOffers + taskQueue.pendingRedirections;


    return (
        <>
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] border border-[#d5a22d]/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <Building2 className="w-3.5 h-3.5" />
                        School Management
                    </div>
                }
                title="Dashboard Overview"
                subtitle={
                    <span className="text-slate-500 font-medium text-sm sm:text-base italic">Managing operations for <span className="font-bold text-[#d5a22d]">{university?.name}</span></span>
                }
                action={
                    <>
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="pl-12 pr-6 py-3.5 bg-white border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-brand-primary/10 focus:bg-white transition-all w-64 shadow-sm text-brand-primary"
                            />
                        </div>
                        <Link href="/dashboard/school/applications">
                            <Button className="h-12 px-6 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 transition-all transform hover:scale-105 active:scale-95 leading-none">
                                <FileText className="w-5 h-5 mr-2" />
                                View Applications
                            </Button>
                        </Link>
                    </>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    label="Total Applications"
                    value={totalApplications}
                    trend="+12%"
                />
                <StatsCard
                    label="Outstanding Tasks"
                    value={activeTasksCount}
                    trend={activeTasksCount > 0 ? "Action Required" : "Cleared"}
                    trendUp={activeTasksCount === 0}
                />
                <StatsCard
                    label="Yield Rate"
                    value={`${((programmeCardsData.reduce((acc, p) => acc + p.offersAccepted, 0) / Math.max(1, programmeCardsData.reduce((acc, p) => acc + p.offersIssued, 0))) * 100).toFixed(0)}%`}
                    trend="Market Average"
                />
            </div>

            {/* Analytics & Distribution */}
            <SchoolDashboardCharts statusChartData={statusChartData} programChartData={programChartData} />

            {/* Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Programme Cards */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <LayoutDashboard className="w-5 h-5 text-[#36335e]" />
                            <h3 className="text-xl font-black text-[#36335e] tracking-tight">Programmes</h3>
                        </div>
                        <Link href="/dashboard/school/applications">
                            <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-[#36335e] hover:bg-[#36335e]/10 hover:text-[#d5a22d] rounded-xl px-4 py-2">
                                View Registry
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {programmeCardsData.length > 0 ? (
                            programmeCardsData.map((p) => (
                                <ProgrammeCard key={p.programId} {...p} />
                            ))
                        ) : (
                            <div className="col-span-2">
                                <EmptyState
                                    icon={GraduationCap}
                                    title="No programmes found"
                                    description="Start by creating your first academic programme"
                                    action={
                                        <Link href="/dashboard/school/programs/new">
                                            <Button className="h-12 px-6 bg-[#36335e] hover:bg-[#2a284a] text-white font-bold rounded-2xl shadow-lg shadow-[#36335e]/20 transition-all">
                                                Create Programme
                                            </Button>
                                        </Link>
                                    }
                                    className="bg-white border border-slate-100 rounded-[2.5rem] p-12"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Task Queue & Activity */}
                <div className="space-y-8">
                    <TaskQueue 
                        pendingScoring={taskQueue.pendingScoring}
                        pendingOffers={taskQueue.pendingOffers}
                        pendingRedirections={taskQueue.pendingRedirections}
                    />

                    {/* Live Activity Feed */}
                    <LiveActivityFeed universityId={university.id} />

                    {/* QR Code & Branded Short URL */}
                    <SchoolQRCode
                        universityId={university.id}
                        universityName={university.name}
                        slug={(university as any).slug ?? null}
                    />

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group hover:border-[#36335e]/20 transition-colors">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="w-24 h-24 text-[#36335e] rotate-12" />
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1">Institutional Support</h4>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center text-[#36335e] group-hover:scale-110 transition-transform duration-300">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 leading-tight mb-1">Help Center</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Contact Support</p>
                                </div>
                                <Button size="sm" variant="ghost" className="ml-auto rounded-xl hover:bg-[#36335e]/10 hover:text-[#36335e]">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
