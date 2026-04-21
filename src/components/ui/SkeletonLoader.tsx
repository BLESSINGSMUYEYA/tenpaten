import React from 'react';

interface SkeletonProps {
    className?: string;
}

export function CardSkeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 ${className}`}>
            <div className="animate-pulse space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                        <div className="h-5 bg-slate-100 rounded-md w-1/3"></div>
                        <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                    <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
                    <div className="h-4 bg-slate-100 rounded-md w-4/6"></div>
                </div>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse">
            <div className="h-14 bg-slate-50 border-b border-slate-100"></div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-6 border-b border-slate-50">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-100 rounded-md w-1/4"></div>
                        <div className="h-3 bg-slate-100 rounded-md w-3/4"></div>
                    </div>
                    <div className="w-24 h-8 bg-slate-100 rounded-full shrink-0"></div>
                </div>
            ))}
        </div>
    );
}
