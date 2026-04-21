import { PageHeader } from '@/components/ui/PageHeader';
import { TableSkeleton } from '@/components/ui/SkeletonLoader';
import { FileText } from 'lucide-react';

export default function Loading() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <FileText className="w-3 h-3 animate-pulse" />
                        Admissions
                    </div>
                }
                title="Student Applications"
                subtitle="Loading application data..."
                action={<div className="w-64 h-12 bg-slate-100 rounded-2xl animate-pulse" />}
            />

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <TableSkeleton rows={8} />
            </div>
        </div>
    );
}
