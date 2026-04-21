'use client';

import { usePathname } from 'next/navigation';
import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';

export default function DynamicBreadcrumbs() {
    const pathname = usePathname();
    
    // Don't show on main dashboard
    if (pathname === '/dashboard') return null;

    const segments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Map segments to readable labels
    const labelMap: Record<string, string> = {
        'dashboard': 'Dashboard',
        'prospect': 'Student',
        'student': 'Student',
        'colleges': 'Browse Universities',
        'schools': 'University',
        'programs': 'Programs',
        'applications': 'My Applications',
        'settings': 'Account Settings',
        'apply': 'Apply Now',
        'resources': 'Resources',
        'affiliate': 'Affiliate Program',
        'messages': 'Messages'
    };

    let currentHref = '';
    segments.forEach((segment, index) => {
        currentHref += `/${segment}`;
        
        // Skip some segments for a cleaner path
        if (segment === 'dashboard') return;

        // If it looks like a UUID (length 36) or long ID, we label it generically for now
        const isId = segment.length > 20 && (segment.includes('-') || /\d/.test(segment));
        
        let label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        let href: string | undefined = index < segments.length - 1 ? currentHref : undefined;

        // Special case: link schools and programs back to colleges listing
        if (segment === 'schools' || segment === 'programs') {
            href = '/dashboard/colleges';
        }
        
        if (isId) {
            label = 'Details';
        }

        items.push({
            label,
            href
        });
    });

    if (items.length === 0) return null;

    return (
        <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-2.5">
            <Breadcrumbs items={items} />
        </div>
    );
}
