'use client';

import { usePathname } from 'next/navigation';
import DashboardFAQs from '@/components/student/DashboardFAQs';

export default function StudentLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Hide Smart Help on detail pages to give more room
    const isDetailPage = pathname.includes('/dashboard/schools/') || pathname.includes('/dashboard/programs/');

    if (isDetailPage) {
        return (
            <div className="w-full">
                {children}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
                {children}
            </div>

            {/* Right/FAQ Side Column - Sticky */}
            <div className="lg:col-span-1 min-w-0">
                <div className="sticky top-6">
                    <DashboardFAQs />
                </div>
            </div>
        </div>
    );
}
