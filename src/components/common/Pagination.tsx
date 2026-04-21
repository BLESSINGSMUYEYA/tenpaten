'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            {/* Previous Button */}
            <Link
                href={createPageURL(currentPage - 1)}
                className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage <= 1
                    ? 'pointer-events-none opacity-50 bg-gray-50'
                    : 'hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                aria-disabled={currentPage <= 1}
            >
                <ChevronLeft className="w-5 h-5" />
            </Link>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Simple logic: show all pages for now. 
                    // For very large numbers, we'd want ellipsis logic.
                    const isActive = page === currentPage;

                    return (
                        <Link
                            key={page}
                            href={createPageURL(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${isActive
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {page}
                        </Link>
                    );
                })}
            </div>

            {/* Next Button */}
            <Link
                href={createPageURL(currentPage + 1)}
                className={`p-2 rounded-lg border border-gray-200 transition-colors ${currentPage >= totalPages
                    ? 'pointer-events-none opacity-50 bg-gray-50'
                    : 'hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                aria-disabled={currentPage >= totalPages}
            >
                <ChevronRight className="w-5 h-5" />
            </Link>
        </div>
    );
}
