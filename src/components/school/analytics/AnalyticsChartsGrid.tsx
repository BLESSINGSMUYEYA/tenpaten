'use client';

import dynamic from 'next/dynamic';

const StatusPieChart = dynamic(() => import('@/components/dashboard/analytics/StatusPieChart'), { ssr: false });
const YieldRateChart = dynamic(() => import('@/components/school/analytics/YieldRateChart'), { ssr: false });
const MeritDistributionChart = dynamic(() => import('@/components/school/analytics/MeritDistributionChart'), { ssr: false });

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
