import { FileText, Send } from 'lucide-react';

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl animate-pulse">
            {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                        <div className="bg-gray-200 w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded-md w-12 mb-2" />
                    <div className="h-3 bg-gray-100 rounded-md w-24" />
                </div>
            ))}
        </div>
    );
}

export function ApplicationCardSkeleton() {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm animate-pulse">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                </div>
                <div className="w-20 h-7 bg-gray-100 rounded-lg" />
            </div>
            <div className="space-y-2 mb-5">
                <div className="h-4 bg-gray-50 rounded-md w-1/3" />
                <div className="h-4 bg-gray-50 rounded-md w-1/4" />
            </div>
            <div className="h-10 bg-gray-50 rounded-lg w-full" />
        </div>
    );
}

export function RecentApplicationsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mt-12 mb-12 animate-pulse">
            {[1, 2].map((i) => (
                <ApplicationCardSkeleton key={i} />
            ))}
        </div>
    );
}
