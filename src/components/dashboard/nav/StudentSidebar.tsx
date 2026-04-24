'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';
import UnifiedHelpCard from './UnifiedHelpCard';
import PerformanceToggle from './PerformanceToggle';

interface StudentSidebarProps {
    isEnrolled?: boolean;
}

export default function StudentSidebar({ isEnrolled = false }: StudentSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname === href || pathname.startsWith(href + '/');

    return (
        <>
            <div className="pt-6 pb-2 px-4">
                <span className="text-[10px] font-black text-[#d5a22d]/70 uppercase tracking-[0.2em]">My Journey</span>
            </div>
            {navigationConfig.student.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                            active
                                ? 'bg-[#d5a22d]/15 text-white border-l-2 border-[#d5a22d]'
                                : 'text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            active ? 'bg-[#d5a22d]/20' : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                            <Icon className={`w-4 h-4 ${active ? 'text-[#d5a22d]' : 'text-white/60 group-hover:text-white'}`} />
                        </div>
                        <span className={`font-semibold text-sm ${active ? 'text-white' : ''}`}>{item.name}</span>
                        {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] font-black bg-[#d5a22d] text-[#36335e] uppercase tracking-widest">
                                {item.badge}
                            </span>
                        )}
                        {active && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d5a22d] animate-pulse" />
                        )}
                    </Link>
                );
            })}

            {isEnrolled && (
                <>
                    <div className="pt-6 pb-2 px-4">
                        <span className="text-[10px] font-black text-[#d5a22d]/70 uppercase tracking-[0.2em]">Opportunities</span>
                    </div>
                    <Link
                        href="/dashboard/student-rewards"
                        className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                            isActive('/dashboard/student-rewards')
                                ? 'bg-[#d5a22d]/15 text-white border-l-2 border-[#d5a22d]'
                                : 'text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                        }`}
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-white/60 group-hover:text-white" />
                        </div>
                        <span className="font-semibold text-sm">Affiliate Program</span>
                    </Link>
                </>
            )}

            <PerformanceToggle />
            <UnifiedHelpCard />
        </>
    );
}
