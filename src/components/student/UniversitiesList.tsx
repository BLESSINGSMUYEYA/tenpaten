'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import UniversityCard from './UniversityCard';
import { Search, Filter, X, ChevronDown, Sparkles } from 'lucide-react';
import Fuse from 'fuse.js';

interface Program {
    id: string;
    name: string;
    level: string;
    baseTuition: number | null;
    scholarshipPercentage: number | null;
    duration?: string | null;
    intake?: string | null;
    departmentName?: string | null;
    majors?: string[];
}

interface University {
    id: string;
    name: string;
    logo: string | null;
    images: string[];
    description: string;
    country: string;
    programCount: number;
    programs: Program[];
    departments: string[];
    hasScholarship?: boolean;
    adminId?: string;
    matchingProgram?: Program | null;
    createdAt?: Date;
}

interface UniversitiesListProps {
    universities: University[];
    allCountries?: { id: string; name: string }[];
    hideUntilSearch?: boolean;
    children?: React.ReactNode;
}

type SortOption = 'name-asc' | 'name-desc' | 'newest';

export default function UniversitiesList({
    universities,
    allCountries,
    hideUntilSearch = false,
    children
}: UniversitiesListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Internal state for immediate UI feedback (searching)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Fuse.js implementation for client-side fuzzy search
    const fuse = useMemo(() => {
        return new Fuse(universities, {
            keys: [
                'name',
                'description',
                'programs.name',
                'programs.majors',
                'country'
            ],
            threshold: 0.35, // Adjust for sensitivity (0.0 is exact, 1.0 matches everything)
            ignoreLocation: true,
            distance: 100
        });
    }, [universities]);

    const displayUniversities = useMemo(() => {
        if (!searchQuery) return universities;
        return fuse.search(searchQuery).map(result => result.item);
    }, [searchQuery, universities, fuse]);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== (searchParams.get('query') || '')) {
                updateFilters({ query: searchQuery || undefined });
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const updateFilters = useCallback((updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Reset page on filter change
        if (!updates.page) params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    const isSearchActive = (searchParams.get('query') || '').trim().length > 0 ||
        (searchParams.get('country') || 'all') !== 'all' ||
        (searchParams.get('level') || 'all') !== 'all';

    const clearFilters = () => {
        setSearchQuery('');
        router.push(pathname);
    };

    // Static levels for now, or could be passed from server
    const levels = ['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate', 'PhD'];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Conditional Gemini-style Hero - Hides when searching */}
            <div className={`relative transition-all duration-700 ease-in-out origin-top border-b border-transparent ${isSearchActive ? 'max-h-0 opacity-0 overflow-hidden mb-0 pb-0' : 'max-h-[300px] opacity-100 py-12 sm:py-16 px-6'}`}>
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <Sparkles className="w-3 h-3 text-[#d5a22d]" />
                        Explore the Future
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#36335e] tracking-tight leading-tight">
                        What would you like to <span className="text-[#d5a22d]">study?</span>
                    </h1>
                    <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto">
                        Search across hundreds of verified programs and world-class universities around the globe.
                    </p>
                </div>
            </div>

            {/* Unified Search & Discovery Hub - Sticky at top when searching */}
            <div className={`z-[100] transition-all duration-500 max-w-3xl mx-auto w-full group/hub ${isSearchActive ? 'sticky top-2' : '-mt-4'}`}>
                <div className={`bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-500 overflow-hidden ${isSearchActive ? 'shadow-xl border-[#d5a22d]/20 ring-4 ring-[#d5a22d]/5' : ''}`}>
                    {/* Search Field */}
                    <div className="p-1 border-b border-gray-50 flex items-center">
                        <div className="pl-6 pointer-events-none">
                            <Search className="w-5 h-5 text-[#36335e]/40 group-focus-within:text-[#d5a22d] transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find your dream program or university..."
                            className="flex-1 pl-4 pr-6 py-5 bg-transparent outline-none text-sm sm:text-base font-bold text-[#36335e] placeholder:text-gray-300 placeholder:font-medium"
                        />
                        {isSearchActive && (
                            <button
                                onClick={clearFilters}
                                className="mr-4 p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-all active:scale-90"
                                title="Clear all filters"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Integrated Filters Row */}
                    <div className="px-4 py-3 bg-gray-50/30 flex flex-wrap items-center justify-center gap-3">
                        {/* Country Filter */}
                        <div className="relative group/filter">
                            <select
                                value={searchParams.get('country') || 'all'}
                                onChange={(e) => updateFilters({ country: e.target.value })}
                                className="appearance-none pl-4 pr-9 py-2 rounded-xl bg-white border border-gray-200 text-[10px] font-black text-[#36335e] uppercase tracking-wider cursor-pointer hover:border-[#d5a22d]/30 transition-all outline-none"
                            >
                                <option value="all">Everywhere</option>
                                {allCountries?.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Level Filter */}
                        <div className="relative group/filter">
                            <select
                                value={searchParams.get('level') || 'all'}
                                onChange={(e) => updateFilters({ level: e.target.value })}
                                className="appearance-none pl-4 pr-9 py-2 rounded-xl bg-white border border-gray-200 text-[10px] font-black text-[#36335e] uppercase tracking-wider cursor-pointer hover:border-[#d5a22d]/30 transition-all outline-none"
                            >
                                <option value="all">All Levels</option>
                                {levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Sort Filter */}
                        <div className="relative group/filter">
                            <select
                                value={searchParams.get('sortBy') || 'name-asc'}
                                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                                className="appearance-none pl-4 pr-9 py-2 rounded-xl bg-white border border-gray-100 text-[10px] font-black text-[#36335e] uppercase tracking-wider cursor-pointer hover:border-[#d5a22d]/30 transition-all outline-none"
                            >
                                <option value="name-asc">A to Z</option>
                                <option value="name-desc">Z to A</option>
                                <option value="newest">Recent</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="w-[1px] h-4 bg-gray-200 mx-1 hidden md:block" />

                        <div className="hidden md:flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#36335e] text-white' : 'text-gray-400 hover:text-[#36335e]'}`}
                            >
                                <Filter className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#36335e] text-white' : 'text-gray-400 hover:text-[#36335e]'}`}
                            >
                                <X className="w-3.5 h-3.5 rotate-45" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            {(!hideUntilSearch || isSearchActive) && (
                <div className="space-y-8 animate-in fade-in duration-1000">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                            Found <span className="text-[#36335e]">{displayUniversities.length}</span> verified results
                        </p>
                    </div>

                    {displayUniversities.length === 0 ? (
                        <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-[#36335e] tracking-tight mb-2">No Match Found</h3>
                            <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                                We couldn't find anything matching your search. Try different keywords or broaden your filters.
                            </p>
                        </div>
                    ) : (
                        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "flex flex-col gap-4"}>
                            {displayUniversities.map((uni) => (
                                <UniversityCard
                                    key={uni.id}
                                    university={uni}
                                    matchingProgram={uni.matchingProgram}
                                    layout={viewMode === 'grid' ? 'vertical' : 'horizontal'}
                                />
                            ))}
                        </div>
                    )}

                    {children}
                </div>
            )}
        </div>
    );
}
