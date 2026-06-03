'use client';

import React, { Fragment } from 'react';
import { Search, Filter, Layers, ExternalLink, AlertCircle, GraduationCap } from 'lucide-react';
import Link from 'next/link';

interface UniversityProgramsListProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    levelFilter: string;
    setLevelFilter: (val: string) => void;
    programLevels: string[];
    groupedPrograms: any;
    currencySym: string;
}

export function UniversityProgramsList({
    searchQuery,
    setSearchQuery,
    levelFilter,
    setLevelFilter,
    programLevels,
    groupedPrograms,
    currencySym
}: UniversityProgramsListProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Search and Filters */}
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-gray-100 shadow-xl flex flex-col sm:flex-row gap-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search programs or departments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl text-sm focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none text-brand-primary font-semibold placeholder-gray-400"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50/50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                        <Filter className="w-5 h-5 text-brand-accent" />
                    </div>
                    <select
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        className="bg-gray-50/50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] py-4 pl-6 pr-12 focus:ring-2 focus:ring-brand-accent/20 transition-all outline-none appearance-none cursor-pointer text-brand-primary"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23d5a22d\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'3\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                    >
                        <option value="all">All Levels</option>
                        {programLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            </div>

            {Object.keys(groupedPrograms).length > 0 ? (
                <div className="space-y-8">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-brand-primary/10">
                                    <th className="px-8 py-6 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] w-1/3">Program Identity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Level</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Specs</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Investment</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {Object.entries(groupedPrograms).map(([deptName, deptPrograms]: [string, any]) => (
                                    <Fragment key={deptName}>
                                        <tr className="group">
                                            <td colSpan={5} className="px-8 py-8 pt-12">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-1px flex-1 bg-slate-100" />
                                                    <div className="flex items-center gap-3 px-6 py-2 bg-[#1a1b41] rounded-2xl shadow-xl shadow-[#1a1b41]/20">
                                                        <Layers className="w-4 h-4 text-brand-accent" />
                                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{deptName}</span>
                                                        <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-black text-brand-accent">{deptPrograms.length}</span>
                                                    </div>
                                                    <div className="h-1px flex-1 bg-slate-100" />
                                                </div>
                                            </td>
                                        </tr>
                                        {deptPrograms.map((program: any) => (
                                            <tr key={program.id} className="group hover:bg-brand-primary/[0.02] transition-all duration-300">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-brand-primary/20 group-hover:bg-brand-primary/5 group-hover:text-brand-primary transition-all">
                                                            <GraduationCap className="w-6 h-6" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h4 className="text-base font-black text-[#1a1b41] group-hover:text-[#d4a017] transition-colors line-clamp-1 uppercase tracking-tight">
                                                                {program.name}
                                                            </h4>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Institutional ID: {program.id.slice(-6)}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="bg-brand-accent/10 text-[#d4a017] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-brand-accent/20">
                                                        {program.level}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{program.duration}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{program.intake || 'Flexible'} Intake</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {program.baseTuition ? (
                                                        <div className="flex flex-col">
                                                            {program.scholarshipPercentage && program.scholarshipPercentage > 0 ? (
                                                                <>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-black text-emerald-600">{currencySym}{(program.baseTuition * (1 - program.scholarshipPercentage / 100)).toLocaleString()}</span>
                                                                        <span className="text-[8px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-tighter">-{program.scholarshipPercentage}%</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-300 line-through font-bold">{currencySym}{program.baseTuition.toLocaleString()}</span>
                                                                </>
                                                            ) : (
                                                                <span className="text-sm font-black text-brand-primary">{currencySym}{program.baseTuition.toLocaleString()}</span>
                                                            )}
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Est. Annual</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Contact Admin</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                        <Link
                                                            href={`/dashboard/programs/${program.id}`}
                                                            className="h-10 px-4 text-[10px] font-black text-slate-400 hover:text-brand-primary uppercase tracking-widest transition-colors flex items-center"
                                                        >
                                                            Specs
                                                        </Link>
                                                        <Link
                                                            href={`/dashboard/apply?programId=${program.id}`}
                                                            className="h-10 px-6 bg-[#d4a017] hover:bg-[#b88e24] text-[#1a1b41] text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#d4a017]/20 flex items-center"
                                                        >
                                                            Enroll
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Integration Layout */}
                    <div className="md:hidden space-y-8">
                        {Object.entries(groupedPrograms).map(([deptName, deptPrograms]: [string, any]) => (
                            <div key={deptName} className="space-y-4">
                                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <Layers className="w-3 h-3 text-[#d4a017]" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{deptName}</span>
                                </div>
                                <div className="space-y-3">
                                    {deptPrograms.map((program: any) => (
                                        <div key={program.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4a017] opacity-0 group-active:opacity-100 transition-opacity" />
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-sm font-black text-[#1a1b41] uppercase tracking-tight mb-1">{program.name}</h4>
                                                    <span className="text-[9px] font-black text-[#d4a017] bg-[#d4a017]/10 px-2 py-0.5 rounded uppercase tracking-widest">{program.level}</span>
                                                </div>
                                                <div className="text-right">
                                                    {program.baseTuition && (
                                                        <span className="text-xs font-black text-brand-primary">{currencySym}{program.baseTuition.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                                                        <span className="text-[10px] font-bold text-slate-600">{program.duration}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Intake</span>
                                                        <span className="text-[10px] font-bold text-slate-600">{program.intake || 'Rolling'}</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={`/dashboard/apply?programId=${program.id}`}
                                                    className="h-9 px-6 bg-[#1a1b41] text-white text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center shadow-lg"
                                                >
                                                    Apply
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            ) : (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                    <div className="inline-flex p-5 bg-[#1a1b41]/5 rounded-[2rem] mb-6">
                        <AlertCircle className="w-10 h-10 text-brand-accent" />
                    </div>
                    <h3 className="text-lg font-black text-brand-primary mb-3 tracking-tight">No programs found</h3>
                    <p className="text-[10px] font-black text-slate-400 max-w-[280px] mx-auto uppercase tracking-widest mb-8">
                        We couldn't find any programs matching your filters.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); setLevelFilter('all'); }}
                        className="px-8 py-3 bg-[#1a1b41] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all shadow-xl hover:shadow-[#1a1b41]/20 hover:scale-105 active:scale-95"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
