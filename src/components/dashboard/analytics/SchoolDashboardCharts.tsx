'use client';

import dynamic from 'next/dynamic';

const StatusPieChart = dynamic(() => import('@/components/dashboard/analytics/StatusPieChart'), { 
    ssr: false,
    loading: () => <div className="h-[300px] bg-white rounded-[2.5rem] animate-pulse border border-slate-100/50" />
});

interface SchoolDashboardChartsProps {
    statusChartData: any[];
    programChartData: any[];
}

export default function SchoolDashboardCharts({ statusChartData, programChartData }: SchoolDashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatusPieChart data={statusChartData} title="Application Pipeline" />
            <StatusPieChart data={programChartData} title="Program Popularity" />
        </div>
    );
}
