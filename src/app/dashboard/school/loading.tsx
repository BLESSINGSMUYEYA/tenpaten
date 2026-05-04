import { StatsSkeleton } from '@/components/student/DashboardSkeleton';

export default function Loading() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="w-32 h-4 bg-slate-100 rounded-full animate-pulse" />
                    <div className="w-64 h-8 bg-slate-100 rounded-xl animate-pulse" />
                    <div className="w-48 h-4 bg-slate-100 rounded-full animate-pulse" />
                </div>
                <div className="flex gap-3">
                    <div className="w-48 h-12 bg-slate-100 rounded-2xl animate-pulse" />
                    <div className="w-40 h-12 bg-slate-100 rounded-2xl animate-pulse" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                <div className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                <div className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="w-40 h-6 bg-slate-100 rounded-full animate-pulse mx-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-64 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
                        <div className="h-64 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="h-80 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
                    <div className="h-64 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
