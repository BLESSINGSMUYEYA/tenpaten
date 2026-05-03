'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ApplicationStatus } from '@prisma/client';
import { StatusBadge } from '@/components/school/StatusBadge';
import ApplicantSidePanel from '@/components/school/ApplicantSidePanel';
import BulkActionBar from '@/components/school/BulkActionBar';
import { Search, Filter, X, ChevronDown, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Filter bar ────────────────────────────────────────────────────────────────

function FilterBar({ programs }: { programs: Program[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (search) params.set('search', search); else params.delete('search');
            params.delete('page');
            replace(`${pathname}?${params.toString()}`);
        }, 350);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

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
        <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
            {/* Search */}
            <div className="flex-1 min-w-[220px] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#36335e] transition-colors" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 border-transparent focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 transition-colors">
                        <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                )}
            </div>

            {/* Status Filter */}
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <select
                    value={searchParams.get('status') ?? 'ALL'}
                    onChange={(e) => setParam('status', e.target.value)}
                    className="appearance-none pl-9 pr-8 py-3 bg-slate-50 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 border-transparent focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all cursor-pointer"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="DRAFT">Drafts (Incomplete)</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNIVERSITY_REVIEW">Under Review</option>
                    <option value="OFFER_ISSUED">Offer Issued</option>
                    <option value="OFFER_ACCEPTED">Accepted</option>
                    <option value="ENROLLED">Enrolled</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Programme Filter */}
            <div className="relative">
                <select
                    value={searchParams.get('programId') ?? 'ALL'}
                    onChange={(e) => setParam('programId', e.target.value)}
                    className="appearance-none pl-4 pr-8 py-3 bg-slate-50 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 border-transparent focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all cursor-pointer max-w-[200px]"
                >
                    <option value="ALL">All Programmes</option>
                    {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
                <select
                    value={searchParams.get('sortBy') ?? 'rank'}
                    onChange={(e) => setParam('sortBy', e.target.value)}
                    className="appearance-none pl-4 pr-8 py-3 bg-slate-50 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 border-transparent focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all cursor-pointer"
                >
                    <option value="rank">By Rank</option>
                    <option value="merit-desc">Top Merit</option>
                    <option value="newest">Newest</option>
                    <option value="name-asc">A–Z</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Clear */}
            {hasFilters && (
                <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-3 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <X className="w-3.5 h-3.5" /> Clear
                </button>
            )}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

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
            {/* Filter Bar */}
            <FilterBar programs={programs} />

            {/* Bulk Action Bar */}
            <BulkActionBar
                selectedIds={selectedIds}
                onClearSelection={clearSelection}
            />

            {/* Table — no card wrapper; parent card handles it */}
            <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1d1b41] text-white">
                                <th className="px-5 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        className="w-4 h-4 rounded border-white/30 bg-white/10 accent-[#d5a22d] cursor-pointer"
                                    />
                                </th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Applicant</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Programme</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">Rank</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {applicants.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <p className="text-sm font-bold text-slate-400">No applicants match your current filters.</p>
                                        <p className="text-xs text-slate-300 font-medium mt-1">Try adjusting the search or status filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                applicants.map((app) => {
                                    const isSelected = selectedIds.includes(app.id);
                                    const isPanelOpen = openPanel?.id === app.id;

                                    return (
                                        <tr
                                            key={app.id}
                                            className={`transition-colors duration-150 group cursor-pointer ${
                                                isPanelOpen
                                                    ? 'bg-[#1d1b41]/5'
                                                    : isSelected
                                                    ? 'bg-[#d5a22d]/5'
                                                    : 'hover:bg-slate-50/60'
                                            }`}
                                        >
                                            {/* Checkbox */}
                                            <td
                                                className="px-5 py-4 w-12"
                                                onClick={(e) => { e.stopPropagation(); toggleId(app.id); }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleId(app.id)}
                                                    className="w-4 h-4 rounded border-slate-300 accent-[#36335e] cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </td>

                                            {/* Name */}
                                            <td className="px-5 py-4" onClick={() => openApplicant(app)}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all shrink-0 ${isPanelOpen ? 'bg-[#1d1b41] text-[#d5a22d]' : 'bg-[#1d1b41]/5 text-[#1d1b41] group-hover:bg-[#1d1b41] group-hover:text-[#d5a22d]'}`}>
                                                        {app.prospect.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[#1d1b41] text-sm leading-tight group-hover:text-[#d5a22d] transition-colors">
                                                            {app.prospect.fullName}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate max-w-[160px]">
                                                            {app.prospect.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Programme */}
                                            <td className="px-5 py-4" onClick={() => openApplicant(app)}>
                                                <p className="text-xs font-black text-slate-700 truncate max-w-[180px]">
                                                    {app.program.name}
                                                </p>
                                            </td>

                                            {/* Rank */}
                                            <td className="px-5 py-4 text-center" onClick={() => openApplicant(app)}>
                                                {app.rank !== null ? (
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#1d1b41]/5 text-[#1d1b41] font-black text-sm">
                                                        {app.rank}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-300 text-xs font-medium">—</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4" onClick={() => openApplicant(app)}>
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
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {total} applicants · Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
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

// ── Pagination helper ─────────────────────────────────────────────────────────

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
            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-30 ${primary ? 'bg-[#1d1b41] text-white' : 'border border-slate-200 text-slate-500'}`}>
                {label}
            </span>
        );
    }

    return (
        <Link
            href={href}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${primary ? 'bg-[#1d1b41] text-[#d5a22d] hover:bg-[#2a284a]' : 'border border-slate-200 text-slate-600 hover:border-[#1d1b41]/30 hover:text-[#1d1b41]'}`}
        >
            {label}
        </Link>
    );
}
