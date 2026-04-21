import { PageHeader } from '@/components/ui/PageHeader';
import { CardSkeleton } from '@/components/ui/SkeletonLoader';
import { BookOpen } from 'lucide-react';

export default function Loading() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <BookOpen className="w-3 h-3 animate-pulse" />
                        Academics
                    </div>
                }
                title="Programs & Departments"
                subtitle="Loading academic structure..."
            />

            <div className="bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50 inline-flex mb-8 w-fit">
                <div className="flex gap-2">
                    <div className="h-10 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="h-10 w-32 bg-slate-100 rounded-xl animate-pulse"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
