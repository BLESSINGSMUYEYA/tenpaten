'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ApplicationStatus } from '@prisma/client';
import { StatusBadge } from '@/components/school/StatusBadge';
import ApplicantSidePanel from '@/components/school/ApplicantSidePanel';
import BulkActionBar from '@/components/school/BulkActionBar';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Applicant {
    id: string;
    status: ApplicationStatus;
    rank: number | null;
    meritScore: number | null;
    createdAt: Date;
    alternativeProgramId: string | null;
    alternativeStatus: string | null;
    prospect: { fullName: string; email: string };
    program: { id: string; name: string };
    statusHistory: any[];
    academicInfo: any;
    activitiesInfo: any;
    reviewData: any;
}

interface Program {
    id: string;
    name: string;
}

interface ApplicantListClientProps {
    applicants: Applicant[];
    programs: Program[];
    total: number;
    currentPage: number;
    totalPages: number;
    initialPanelId?: string | null;
}

function FilterBar({ programs }: { programs: Program[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (search) params.set('search', search); else params.delete('search');
            params.delete('page');
            replace(`${pathname}?${params.toString()}`);
        }, 350);
        return () => clearTimeout(timer);
    }, [search, searchParams, pathname, replace]);

    const setParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'ALL') params.set(key, value); else params.delete(key);
        params.delete('page');
        replace(`${pathname}?${params.toString()}`);
    };

    const hasFilters = search || searchParams.get('status') || searchParams.get('programId') || searchParams.get('sortBy');

    const clearAll = () => {
        setSearch('');
        replace(pathname);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 px-8 py-5 border-b border-slate-100 bg-slate-50/30">
            {/* Search */}
            <div className="flex-1 min-w-[280px] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search applicants..."
                    className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl text-sm font-bold text-brand-primary placeholder:text-slate-300 border-none focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                )}
            </div>

            {/* Status Filter */}
            <div className="relative">
                <select
                    value={searchParams.get('status') ?? 'ALL'}
                    onChange={(e) => setParam('status', e.target.value)}
                    className="appearance-none pl-6 pr-10 h-12 bg-white rounded-2xl text-sm font-black text-brand-primary border-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer shadow-sm"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="DRAFT">Drafts</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNIVERSITY_REVIEW">Under Review</option>
                    <option value="OFFER_ISSUED">Offer Issued</option>
                    <option value="OFFER_ACCEPTED">Accepted</option>
                    <option value="ENROLLED">Enrolled</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-accent pointer-events-none" />
            </div>

            {/* Programme Filter */}
            <div className="relative">
                <select
                    value={searchParams.get('programId') ?? 'ALL'}
                    onChange={(e) => setParam('programId', e.target.value)}
                    className="appearance-none pl-6 pr-10 h-12 bg-white rounded-2xl text-sm font-black text-brand-primary border-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer shadow-sm max-w-[220px]"
                >
                    <option value="ALL">All Programmes</option>
                    {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-accent pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
                <select
                    value={searchParams.get('sortBy') ?? 'rank'}
                    onChange={(e) => setParam('sortBy', e.target.value)}
                    className="appearance-none pl-6 pr-10 h-12 bg-white rounded-2xl text-sm font-black text-brand-primary border-none focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer shadow-sm"
                >
                    <option value="rank">By Rank</option>
                    <option value="merit-desc">Top Merit</option>
                    <option value="newest">Newest</option>
                    <option value="name-asc">A–Z</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-accent pointer-events-none" />
            </div>

            {/* Clear */}
            {hasFilters && (
                <button
                    onClick={clearAll}
                    className="h-12 flex items-center gap-2 px-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <X className="w-4 h-4" /> Clear
                </button>
            )}
        </div>
    );
}

export default function ApplicantListClient({
    applicants,
    programs,
    total,
    currentPage,
    totalPages,
    initialPanelId,
}: ApplicantListClientProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openPanel, setOpenPanel] = useState<Applicant | null>(
        initialPanelId ? (applicants.find(a => a.id === initialPanelId) ?? null) : null
    );

    const allIds = applicants.map(a => a.id);
    const allSelected = selectedIds.length === allIds.length && allIds.length > 0;

    const toggleId = useCallback((id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }, []);

    const toggleAll = useCallback(() => {
        setSelectedIds(allSelected ? [] : allIds);
    }, [allSelected, allIds]);

    const clearSelection = useCallback(() => setSelectedIds([]), []);

    const openApplicant = useCallback((applicant: Applicant) => {
        setOpenPanel(applicant);
    }, []);

    return (
        <div>
            <FilterBar programs={programs} />

            <BulkActionBar
                selectedIds={selectedIds}
                onClearSelection={clearSelection}
            />

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-brand-primary text-white">
                            <th className="px-8 py-5 w-12">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleAll}
                                    className="w-5 h-5 rounded-lg border-white/30 bg-white/10 accent-brand-accent cursor-pointer"
                                />
                            </th>
                            <th className="px-5 py-5 text-xs font-black tracking-widest uppercase text-white/70">Applicant</th>
                            <th className="px-5 py-5 text-xs font-black tracking-widest uppercase text-white/70">Programme</th>
                            <th className="px-5 py-5 text-xs font-black tracking-widest uppercase text-white/70 text-center">Rank</th>
                            <th className="px-8 py-5 text-xs font-black tracking-widest uppercase text-white/70">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {applicants.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center bg-slate-50/20">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100">
                                            <Search className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-brand-primary tracking-tight">No results found</p>
                                            <p className="text-sm font-bold text-slate-400 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            applicants.map((app) => {
                                const isSelected = selectedIds.includes(app.id);
                                const isPanelOpen = openPanel?.id === app.id;

                                return (
                                    <tr
                                        key={app.id}
                                        onClick={() => openApplicant(app)}
                                        className={`transition-all duration-300 group cursor-pointer border-l-4 ${
                                            isPanelOpen
                                                ? 'bg-brand-primary/5 border-brand-accent'
                                                : isSelected
                                                ? 'bg-brand-accent/5 border-brand-accent/30'
                                                : 'hover:bg-slate-50/80 border-transparent'
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <td
                                            className="px-8 py-6 w-12"
                                            onClick={(e) => { e.stopPropagation(); toggleId(app.id); }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => toggleId(app.id)}
                                                className="w-5 h-5 rounded-lg border-slate-200 accent-brand-primary cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>

                                        {/* Name */}
                                        <td className="px-5 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center text-sm font-black transition-all shrink-0 shadow-sm ${isPanelOpen ? 'bg-brand-primary text-brand-accent' : 'bg-brand-primary/5 text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-accent'}`}>
                                                    {app.prospect.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-brand-primary text-[15px] leading-tight group-hover:text-brand-accent transition-colors">
                                                        {app.prospect.fullName}
                                                    </p>
                                                    <p className="text-xs font-bold text-slate-400 mt-1 truncate max-w-[200px]">
                                                        {app.prospect.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Programme */}
                                        <td className="px-5 py-6">
                                            <p className="text-sm font-bold text-slate-700 truncate max-w-[220px]">
                                                {app.program.name}
                                            </p>
                                        </td>

                                        {/* Rank */}
                                        <td className="px-5 py-6 text-center">
                                            {app.rank !== null ? (
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-[14px] bg-brand-primary/5 text-brand-primary font-black text-sm shadow-sm group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                    {app.rank}
                                                </span>
                                            ) : (
                                                <span className="text-slate-200 text-sm font-black">—</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <StatusBadge
                                                status={app.status}
                                                size="sm"
                                                showOverride={
                                                    app.statusHistory.some(h => h.isOverride)
                                                }
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        {total} Applicants <span className="mx-2 text-slate-200">|</span> Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-3">
                        <PaginationLink page={currentPage - 1} disabled={currentPage <= 1} label="Previous" />
                        <PaginationLink page={currentPage + 1} disabled={currentPage >= totalPages} label="Next" primary />
                    </div>
                </div>
            )}

            {/* Side Panel */}
            {openPanel && (
                <ApplicantSidePanel
                    applicant={openPanel}
                    onClose={() => setOpenPanel(null)}
                />
            )}
        </div>
    );
}

function PaginationLink({
    page,
    disabled,
    label,
    primary = false,
}: {
    page: number;
    disabled: boolean;
    label: string;
    primary?: boolean;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    const href = `${pathname}?${params.toString()}`;

    if (disabled) {
        return (
            <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-30 ${primary ? 'bg-brand-primary text-white' : 'border border-slate-100 text-slate-400'}`}>
                {label}
            </span>
        );
    }

    return (
        <Link
            href={href}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm ${primary ? 'bg-brand-primary text-brand-accent hover:bg-brand-primary-hover shadow-brand-primary/10' : 'bg-white border border-slate-100 text-slate-600 hover:border-brand-primary/30 hover:text-brand-primary'}`}
        >
            {label}
        </Link>
    );
}
