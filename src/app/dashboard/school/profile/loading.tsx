import { PageHeader } from '@/components/ui/PageHeader';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';
import { Building2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Building2 className="w-3 h-3 animate-pulse" />
                        Settings
                    </div>
                }
                title="University Profile"
                subtitle="Loading institutional details..."
                action={<div className="w-32 h-12 bg-slate-100 rounded-2xl animate-pulse" />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                {/* Main Profile Form Skeleton */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="animate-pulse space-y-8">
                        {/* Logo Skeleton */}
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-slate-100 rounded-2xl"></div>
                            <div className="w-48 h-10 bg-slate-100 rounded-xl"></div>
                        </div>
                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-14 bg-slate-50 border border-slate-100 rounded-2xl"></div>
                            <div className="h-14 bg-slate-50 border border-slate-100 rounded-2xl"></div>
                            <div className="h-14 bg-slate-50 border border-slate-100 rounded-2xl md:col-span-2"></div>
                            <div className="h-32 bg-slate-50 border border-slate-100 rounded-2xl md:col-span-2"></div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Cards Skeleton */}
                <div className="space-y-6">
                    <CardSkeleton className="p-6" />
                    <CardSkeleton className="p-6" />
                </div>
            </div>
        </div>
    );
}
