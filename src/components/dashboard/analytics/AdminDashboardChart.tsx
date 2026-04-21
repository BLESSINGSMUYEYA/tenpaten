'use client';

import dynamic from 'next/dynamic';

const EnrollmentAreaChart = dynamic(() => import('@/components/dashboard/analytics/EnrollmentAreaChart'), { 
    ssr: false,
    loading: () => <div className="h-[480px] bg-white rounded-[2.5rem] animate-pulse border border-slate-100/50" />
});

export default function AdminDashboardChart({ data }: { data: any[] }) {
    return <EnrollmentAreaChart data={data} title="Global Application Volume" />;
}
