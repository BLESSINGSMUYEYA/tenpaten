import { getStudentStats, getStudentApplications } from '@/lib/data';
import StudentStats from './StudentStats';
import ApplicationCard from './ApplicationCard';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export async function StatsWrapper() {
    const stats = await getStudentStats();
    if (!stats) return null;
    return <StudentStats stats={stats} />;
}

export async function ApplicationsWrapper() {
    const applications = await getStudentApplications();

    if (applications.length === 0) {
        return (
            <div className="text-center py-16 px-4 rounded-3xl bg-gray-50/80 border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 mb-6">
                    <Sparkles className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-black text-brand-primary">No applications yet</h3>
                <p className="text-sm text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                    You haven't submitted any applications. Start by browsing universities or creating a new application.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {applications.map((app: any) => (
                <ApplicationCard key={app.id} application={app} />
            ))}
        </div>
    );
}
