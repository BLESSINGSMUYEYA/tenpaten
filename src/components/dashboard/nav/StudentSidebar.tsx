'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navigationConfig, NavItem } from '@/config/navigation';
import UnifiedHelpCard from './UnifiedHelpCard';
import PerformanceToggle from './PerformanceToggle';

interface StudentSidebarProps {
    isEnrolled?: boolean;
    hasAffiliateAccess?: boolean;
}

export default function StudentSidebar({ isEnrolled = false, hasAffiliateAccess = false }: StudentSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === href || pathname.startsWith(href + '/');

    // Build navigation items
    const baseItems = [...navigationConfig.student];
    const messagesIndex = baseItems.findIndex(item => item.name === 'Messages');

    const dynamicItems: NavItem[] = [
        ...(isEnrolled && !hasAffiliateAccess ? [{ name: 'Affiliate Program', href: '/dashboard/student-rewards', icon: Users }] : []),
        ...(hasAffiliateAccess ? [{ name: 'Affiliate Dashboard', href: '/dashboard/affiliate', icon: Users }] : []),
    ];

    const navItems = messagesIndex !== -1
        ? [...baseItems.slice(0, messagesIndex), ...dynamicItems, ...baseItems.slice(messagesIndex)]
        : [...baseItems, ...dynamicItems];

    return (
        <>
            <div className="pt-6 pb-2 px-4">
                <span className="text-[10px] font-black text-brand-accent/70 uppercase tracking-[0.2em]">My Journey</span>
            </div>
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                            active
                                ? 'bg-brand-accent/15 text-white border-l-2 border-brand-accent'
                                : 'text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            active ? 'bg-brand-accent/20' : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                            <Icon className={`w-4 h-4 ${active ? 'text-brand-accent' : 'text-white/60 group-hover:text-white'}`} />
                        </div>
                        <span className={`font-semibold text-sm ${active ? 'text-white' : ''}`}>{item.name}</span>
                        {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] font-black bg-brand-accent text-brand-primary uppercase tracking-widest">
                                {item.badge}
                            </span>
                        )}
                        {active && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                        )}
                    </Link>
                );
            })}

            <PerformanceToggle />
            <UnifiedHelpCard />
        </>
    );
}
