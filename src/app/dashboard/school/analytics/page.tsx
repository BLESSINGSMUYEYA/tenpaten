import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getActiveSchoolId } from '@/lib/getActiveSchool';
import { PageHeader } from '@/components/ui/PageHeader';
import { BarChart3, TrendingUp, Users, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSchoolStats } from '@/lib/actions/analytics';
import StatsCard from '@/components/dashboard/analytics/StatsCard';
import AnalyticsChartsGrid from '@/components/school/analytics/AnalyticsChartsGrid';

export default async function SchoolAnalyticsPage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    let universityId = (session?.user as any)?.managedUniversityId;

    if (userRole !== 'SCHOOL_ADMIN' && userRole !== 'SCHOOL_SUPER_AGENT') redirect('/dashboard');

    if (userRole === 'SCHOOL_SUPER_AGENT') {
        universityId = await getActiveSchoolId();
    } else if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) redirect('/dashboard');

    const university = await prisma.university.findUnique({
        where: { id: universityId },
        select: { name: true }
    });

    const { 
        statusChartData, 
        programChartData, 
        yieldChartData, 
        meritDistribution, 
        totalApplications 
    } = await getSchoolStats(universityId);

    // Calculate high level metrics
    const totalOffers = yieldChartData.reduce((acc, curr) => acc + curr.offered, 0);
    const totalAccepted = yieldChartData.reduce((acc, curr) => acc + curr.accepted, 0);
    const overallYield = totalOffers > 0 ? ((totalAccepted / totalOffers) * 100).toFixed(1) : '0';

    return (
        <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <BarChart3 className="w-3.5 h-3.5" />
                        Intelligence Panel
                    </div>
                }
                title="Performance Analytics"
                subtitle={`Analyzing enrollment health for ${university?.name}`}
                action={
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                }
            />

            {/* High Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    label="Total Applications"
                    value={totalApplications}
                    trend="+15%"
                />
                <StatsCard
                    label="Total Offers"
                    value={totalOffers}
                    trend="+8%"
                />
                <StatsCard
                    label="Enrolled Students"
                    value={totalAccepted}
                    trend="+12%"
                />
                <StatsCard
                    label="Overall Yield"
                    value={`${overallYield}%`}
                    trend="Target: 85%"
                    trendUp={parseFloat(overallYield) >= 80}
                />
            </div>

            <AnalyticsChartsGrid 
                yieldChartData={yieldChartData}
                meritDistribution={meritDistribution}
                statusChartData={statusChartData}
                programChartData={programChartData}
            />

            {/* Footer Insight */}
            <div className="p-10 bg-[#1d1b41] rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-10 h-10 text-brand-accent" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-xl font-black tracking-tight mb-2">Automated Enrollment Forecast</h4>
                        <p className="text-white/60 text-sm font-medium max-w-2xl leading-relaxed">
                            Based on your current yield rate of <span className="text-brand-accent font-black">{overallYield}%</span> and the <span className="text-white font-black">{totalApplications}</span> pending applications, you are on track to fill <span className="text-brand-accent font-black">84%</span> of your target capacity for the current intake.
                        </p>
                    </div>
                    <Button className="h-14 px-8 bg-white text-[#1d1b41] hover:bg-slate-50 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shrink-0">
                        View Detailed Forecast
                    </Button>
                </div>
            </div>
        </div>
    );
}
