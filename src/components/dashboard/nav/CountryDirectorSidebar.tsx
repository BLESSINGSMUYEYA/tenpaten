'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationConfig } from '@/config/navigation';
import UnifiedHelpCard from './UnifiedHelpCard';
import PerformanceToggle from './PerformanceToggle';

export default function CountryDirectorSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) =>
        href === '/dashboard/country-director'
            ? pathname === '/dashboard/country-director'
            : pathname === href || pathname.startsWith(href + '/');

    return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="pt-6 pb-2 px-4">
                <span className="text-[10px] font-black text-[#d5a22d]/70 uppercase tracking-[0.2em]">Management Console</span>
            </div>
            <div className="flex-1 space-y-0.5">
                {navigationConfig.country_director.map((item) => {
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

                <div className="mt-4">
                    <PerformanceToggle />
                </div>
            </div>

            <UnifiedHelpCard
                title="Director Support"
                description="Contact HQ for assistance with regional operations or system access."
                buttonText="HQ Support"
            />

            <div className="p-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#d5a22d] animate-pulse" />
                        <p className="text-[10px] font-black text-[#d5a22d] uppercase tracking-widest">Support Active</p>
                    </div>
                    <p className="text-[11px] text-white/50 font-medium leading-relaxed">System status is nominal. Reach out to HQ for regional overrides.</p>
                </div>
            </div>
        </div>
    );
}
