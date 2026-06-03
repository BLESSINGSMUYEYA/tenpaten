'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';
import UnifiedHelpCard from './UnifiedHelpCard';
import PerformanceToggle from './PerformanceToggle';
import SchoolSwitcher from './SchoolSwitcher';

interface SuperAgentSidebarProps {
    assignedSchools: {
        id: string;
        name: string;
        logo: string | null;
        slug: string | null;
    }[];
    activeSchoolId: string | null;
}

export default function SuperAgentSidebar({ assignedSchools, activeSchoolId }: SuperAgentSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === '/dashboard/super-agent'
            ? pathname === '/dashboard/super-agent'
            : pathname === href || pathname.startsWith(href + '/');

    const isActiveSchool = (href: string) =>
        href === '/dashboard/school'
            ? pathname === '/dashboard/school'
            : pathname === href || (pathname.startsWith(href + '/') && !pathname.startsWith('/dashboard/school/settings') && !pathname.startsWith('/dashboard/school/profile'));

    return (
        <>
            {/* School Switcher Section */}
            <div className="px-4 pt-4 pb-2 border-b border-white/5 space-y-2">
                <span className="text-[10px] font-black text-brand-accent/70 uppercase tracking-[0.2em] block">Switch School</span>
                <SchoolSwitcher assignedSchools={assignedSchools} activeSchoolId={activeSchoolId} />
            </div>

            {/* Global Super Agent Navigation */}
            <div className="pt-4 pb-2 px-4">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Global Agent View</span>
            </div>
            {navigationConfig.school_super_agent.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                            active
                                ? 'bg-indigo-500/15 text-white border-l-2 border-indigo-500'
                                : 'text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            active ? 'bg-indigo-500/20' : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                            <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-white/60 group-hover:text-white'}`} />
                        </div>
                        <span className={`font-semibold text-sm ${active ? 'text-white' : ''}`}>{item.name}</span>
                        {active && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        )}
                    </Link>
                );
            })}

            {/* Active School Management Links (only if a school is active) */}
            {activeSchoolId && (
                <>
                    <div className="pt-6 pb-2 px-4 border-t border-white/5 mt-4">
                        <span className="text-[10px] font-black text-brand-accent/70 uppercase tracking-[0.2em]">Active School Admin</span>
                    </div>
                    {navigationConfig.school_super_agent_school.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveSchool(item.href);
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
                </>
            )}

            <PerformanceToggle />
            <UnifiedHelpCard />
        </>
    );
}
