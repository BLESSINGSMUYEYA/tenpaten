'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Role } from '@prisma/client';
import { getHomeUrl } from '@/lib/navigation';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items = [], className }: BreadcrumbsProps) {
    const { data: session } = useSession();
    const role = session?.user?.role as Role;

    const homeUrl = getHomeUrl(role);

    return (
        <nav className={cn("flex items-center", className)} aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-y-2">
                <li>
                    <Link 
                        href={homeUrl} 
                        className="flex items-center text-slate-400 hover:text-[#d5a22d] transition-colors"
                    >
                        <Home className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        <span className="sr-only">Dashboard</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <span className="mx-2.5 text-slate-200 font-light text-sm">/</span>
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#36335e] transition-colors flex items-center"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d5a22d] truncate max-w-[200px]" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
