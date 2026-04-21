'use client';

import { Search, Filter, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function ApplicationFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const currentStatus = searchParams.get('status') || 'ALL';

    // Debounce search updates
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            replace(`${pathname}?${params.toString()}`);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]); // Remove searchParams, pathname, replace from dependency array to avoid loop or just use them if stable. 
    // Actually, to avoid infinite loops with `searchParams` changing, we should careful.
    // Better strategy: Only update URL if `searchTerm` changes AND it's different from current URL param.
    // However, specifically `searchTerm` state is driven by input. `searchParams` drives initial state.

    // Let's stick to a simpler handler approach if possible, but `useEffect` is standard for debouncing values.
    // To avoid loop: 
    // 1. Input changes -> `searchTerm` updates.
    // 2. `useEffect` fires -> updates URL.
    // 3. `useEffect` (on top of file) updates `searchTerm` from URL.
    // We need to break the cycle or ensuring stability.

    // Refined approach below in code:

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status && status !== 'ALL') {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    // Update local state if URL changes externally (e.g. back button)
    const [prevParams, setPrevParams] = useState(searchParams);
    if (searchParams !== prevParams) {
        setPrevParams(searchParams);
        setSearchTerm(searchParams.get('search') || '');
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-72 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#36335e] transition-colors" />
                <input
                    type="text"
                    placeholder="Search students..."
                    defaultValue={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    className="pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-sm w-full transition-all shadow-sm hover:shadow-md font-medium text-slate-900 placeholder:text-slate-400"
                />
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            <div className="relative w-full sm:w-auto group">
                <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="appearance-none w-full sm:w-auto pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-white transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] cursor-pointer"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNIVERSITY_REVIEW">Under Review</option>
                    <option value="OFFER_ISSUED">Offer Issued</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-[#36335e] transition-colors" />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 flex items-center justify-center">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-[#36335e] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
