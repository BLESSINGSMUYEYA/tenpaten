'use client';

import dynamic from 'next/dynamic';

const ChartSkeleton = () => (
    <div className="h-[400px] w-full bg-slate-50/50 animate-pulse rounded-[2.5rem] border border-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#36335e]/20 border-t-[#36335e] rounded-full animate-spin" />
    </div>
);

const StatusPieChart = dynamic(() => import('@/components/dashboard/analytics/StatusPieChart'), { 
    ssr: false,
    loading: () => <ChartSkeleton />
});
const YieldRateChart = dynamic(() => import('@/components/school/analytics/YieldRateChart'), { 
    ssr: false,
    loading: () => <ChartSkeleton />
});
const MeritDistributionChart = dynamic(() => import('@/components/school/analytics/MeritDistributionChart'), { 
    ssr: false,
    loading: () => <ChartSkeleton />
});

interface AnalyticsChartsGridProps {
    yieldChartData: any[];
    meritDistribution: any[];
    statusChartData: any[];
    programChartData: any[];
}

export default function AnalyticsChartsGrid({
    yieldChartData,
    meritDistribution,
    statusChartData,
    programChartData
}: AnalyticsChartsGridProps) {
    return (
        <>
            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <YieldRateChart data={yieldChartData} />
                <MeritDistributionChart data={meritDistribution} />
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <StatusPieChart data={statusChartData} title="Pipeline Status" />
                <StatusPieChart data={programChartData} title="Programme Interest" />
            </div>
        </>
    );
}
