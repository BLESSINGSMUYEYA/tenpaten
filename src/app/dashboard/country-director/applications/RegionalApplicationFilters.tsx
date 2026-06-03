'use client';

import { Search, Filter, X, Calendar } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RegionalApplicationFilters() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const currentStatus = searchParams.get('status') || 'ALL';
    const currentSort = searchParams.get('sort') || 'newest';

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            // Reset to page 1 on search
            params.delete('page');
            replace(`${pathname}?${params.toString()}`);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== 'ALL' && value !== 'newest') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete('page');
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-full">
            <div className="flex-1 min-w-[300px] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-accent transition-colors pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by student name, email, or university..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-brand-accent/30 focus:ring-0 rounded-xl text-sm font-medium transition-all"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                <div className="relative group">
                    <select
                        value={currentStatus}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="appearance-none pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="COUNTRY_REVIEW">Under Review</option>
                        <option value="UNIVERSITY_REVIEW">University Review</option>
                        <option value="OFFER_ISSUED">Offer Issued</option>
                        <option value="ENROLLED">Enrolled</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-brand-accent transition-colors pointer-events-none" />
                </div>

                <div className="relative group">
                    <select
                        value={currentSort}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                        className="appearance-none pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent/20 cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-brand-accent transition-colors pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
