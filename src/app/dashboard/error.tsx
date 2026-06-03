'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Dashboard caught error:", error);
    }, [error]);

    const isDbError = error.message.includes('Can\'t reach database server') || error.message.includes('Prisma');

    return (
        <div className="min-h-screen bg-gray-50/30 flex flex-col items-center justify-center p-6 text-center">
            <div className="space-y-6 max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-rose-100 animate-in fade-in zoom-in duration-500">
                <AlertCircle className="w-16 h-16 text-rose-500 mx-auto animate-pulse" />
                
                <h1 className="text-2xl font-black text-brand-primary">
                    {isDbError ? 'Database Connection Error' : 'Something went wrong!'}
                </h1>
                
                <p className="text-slate-500 font-medium">
                    {isDbError 
                        ? "We couldn't connect to the server right now. It might be experiencing high traffic or temporarily sleeping. Please try again in a few moments."
                        : "An unexpected error occurred while loading this page. We've been notified and are looking into it."}
                </p>
                
                <div className="pt-4 flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full py-4 bg-brand-primary hover:bg-brand-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-brand-primary/20"
                    >
                        Try Again
                    </button>
                    
                    <Link
                        href="/"
                        className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-brand-primary rounded-2xl font-black uppercase tracking-widest text-xs transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
