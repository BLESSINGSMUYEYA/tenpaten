'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import Image from 'next/image';
import { Building2, MapPin, GraduationCap, Wallet, BookOpen, ShieldCheck, Award, Zap, CheckCircle } from 'lucide-react';
import { usePerformance } from '@/components/providers/PerformanceProvider';

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

interface UniversityCardProps {
    university: {
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
    };
    matchingProgram?: Program | null;
    featureMode?: boolean;
    layout?: 'vertical' | 'horizontal';
    onToggleCompare?: (id: string) => void;
    isComparing?: boolean;
}

export default function UniversityCard({ university, matchingProgram, featureMode, layout = 'vertical', onToggleCompare, isComparing }: UniversityCardProps) {
    const { isLiteMode } = usePerformance();

    if (featureMode) {
        return (
            <Link href={`/dashboard/schools/${university.id}`} className="group relative overflow-hidden rounded-[2.5rem] bg-[#36335e] border border-white/5 hover:border-[#d5a22d]/50 p-5 flex flex-col items-center text-center gap-4 transition-all duration-500 hover:shadow-2xl hover:shadow-[#36335e]/20 h-full">
                <div className="relative w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center p-3 border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                    {university.logo ? (
                        <Image 
                            src={university.logo} 
                            alt={university.name} 
                            fill 
                            className="object-contain p-2" 
                        />
                    ) : (
                        <Building2 className="w-6 h-6 text-white/20" />
                    )}
                </div>
                <div className="space-y-2 flex-1 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-[#d5a22d] text-[#36335e] text-[8px] font-black uppercase tracking-widest mb-1">
                        Partner
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tighter line-clamp-2 leading-tight min-h-[2.5rem]">{university.name}</h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/40 uppercase tracking-widest mt-auto">
                        <MapPin className="w-3 h-3 text-[#d5a22d]" />
                        {university.country}
                    </div>
                </div>
            </Link>
        );
    }

    if (layout === 'horizontal') {
        return (
            <>
                {/* Mobile View: Forced Initial Vertical Layout (< md) */}
                <div className="md:hidden">
                    <UniversityCard 
                        university={university} 
                        matchingProgram={matchingProgram} 
                        layout="vertical" 
                        onToggleCompare={onToggleCompare} 
                        isComparing={isComparing} 
                    />
                </div>

                {/* Desktop View: Horizontal List Layout (>= md) */}
                <div className="hidden md:flex group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 hover:border-[#d5a22d]/30 shadow-sm hover:shadow-xl hover:shadow-[#36335e]/5 transition-all duration-500 flex-row items-stretch p-6 gap-8">
                    {/* Logo Section */}
                    <div className="w-32 h-32 relative rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-5 shrink-0 group-hover:scale-105 transition-transform duration-500 self-center">
                        {university.logo ? (
                            <Image 
                                src={university.logo} 
                                alt={university.name} 
                                fill 
                                className="object-contain p-4" 
                            />
                        ) : (
                            <Building2 className="w-12 h-12 text-[#36335e]/40" />
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-black text-[#36335e] group-hover:text-[#d5a22d] transition-colors font-heading capitalize tracking-tight leading-tight">
                                    <Link href={`/dashboard/schools/${university.id}`}>
                                        {university.name}
                                    </Link>
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                    <div className="flex items-center gap-1.5 text-[#36335e]/60">
                                        <MapPin className="w-3.5 h-3.5 text-[#d5a22d]" />
                                        {university.country}
                                    </div>
                                    <span className="text-gray-200">•</span>
                                    <span className="text-[#36335e]/80">{university.programCount} programs available</span>
                                </div>
                            </div>

                        {/* Compare Toggle */}
                            <div className="flex items-center gap-3 shrink-0">
                                {onToggleCompare && (
                                    <button
                                        onClick={() => onToggleCompare(university.id)}
                                        className={`p-2.5 rounded-xl border transition-all active:scale-90 ${
                                            isComparing 
                                                ? 'bg-[#d5a22d] border-[#d5a22d] text-white shadow-lg shadow-[#d5a22d]/20' 
                                                : 'bg-white border-gray-200 text-gray-400 hover:text-[#d5a22d] hover:border-[#d5a22d]'
                                        }`}
                                        title="Compare University"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Integrated Details: Match or Description */}
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                            {matchingProgram ? (
                                <Link
                                    href={`/dashboard/programs/${matchingProgram.id}`}
                                    className={`flex-1 w-full rounded-2xl p-4 flex items-center justify-between gap-4 transition-all group/match_h ${
                                        isLiteMode 
                                            ? 'bg-slate-50 border border-slate-200' 
                                            : 'bg-[#36335e]/5 border border-[#36335e]/10 hover:bg-[#36335e] hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="w-5 h-5 text-[#d5a22d]" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 group-hover/match_h:text-white/40 uppercase tracking-[0.3em]">Matching Program</p>
                                            <p className="text-sm font-black truncate max-w-[200px]">{matchingProgram.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        {matchingProgram.baseTuition ? (
                                            matchingProgram.scholarshipPercentage && matchingProgram.scholarshipPercentage > 0 ? (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-black text-[#d5a22d]">{(matchingProgram.baseTuition * (1 - matchingProgram.scholarshipPercentage / 100)).toLocaleString()}</span>
                                                    <span className="text-[8px] font-black text-white/40 line-through">{matchingProgram.baseTuition.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                <p className="text-[11px] font-black text-[#d5a22d] group-hover/match_h:text-white uppercase tracking-tighter">{matchingProgram.baseTuition.toLocaleString()}</p>
                                            )
                                        ) : (
                                            <p className="text-[11px] font-black text-[#d5a22d] group-hover/match_h:text-white uppercase tracking-tighter">N/A</p>
                                        )}
                                    </div>
                                </Link>
                            ) : (
                                university.description && (
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 py-1 flex-1">
                                        "{university.description.slice(0, 150)}..."
                                    </p>
                                )
                            )}

                            <div className="flex flex-wrap gap-2 shrink-0">
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#d5a22d]/10 text-[#d5a22d] border border-[#d5a22d]/20 text-[9px] font-black uppercase tracking-[0.2em]">
                                    <ShieldCheck className="w-3 h-3" />
                                    Verified
                                </div>
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#36335e]/5 text-[#36335e]/60 border border-gray-100 text-[9px] font-black uppercase tracking-[0.2em]">
                                    <Award className="w-3 h-3" />
                                    Top Choice
                                </div>
                                {university.hasScholarship && (
                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-[0.2em]">
                                        <Award className="w-3 h-3" />
                                        Scholarships Available
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Row: Actions & Level Badges */}
                        <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                {/* Level details removed as requested */}
                            </div>
                            
                            <Link
                                href={`/dashboard/schools/${university.id}`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#36335e] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#d5a22d] hover:text-[#36335e] transition-all shadow-lg shadow-[#36335e]/10 group-hover:translate-x-1"
                            >
                                Quick View
                                <Zap className="w-3.5 h-3.5 fill-current" />
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }


    return (
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 hover:border-[#d5a22d]/30 shadow-sm hover:shadow-2xl hover:shadow-[#36335e]/5 transition-all duration-500 flex flex-col">
            <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5 relative">
                {/* Background Decor */}
                {!isLiteMode && (
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
                        <Building2 className="w-32 h-32 text-[#36335e]" />
                    </div>
                )}

                <div className="flex flex-col gap-6 relative z-10">
                    {/* Header: Logo & Rank */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center p-3 shrink-0 group-hover:scale-105 transition-transform duration-500">
                            {university.logo ? (
                                <Image 
                                    src={university.logo} 
                                    alt={university.name} 
                                    fill 
                                    className="object-contain p-2" 
                                />
                            ) : (
                                <Building2 className="w-8 h-8 text-[#36335e]/40" />
                            )}
                        </div>
                        
                        {/* Compare Toggle */}
                        <div className="flex items-center gap-2 shrink-0">
                            {onToggleCompare && (
                                <button
                                    onClick={() => onToggleCompare(university.id)}
                                    className={`p-2 rounded-xl border transition-all active:scale-90 ${
                                        isComparing 
                                            ? 'bg-[#d5a22d] border-[#d5a22d] text-white shadow-lg shadow-[#d5a22d]/20' 
                                            : 'bg-white border-gray-200 text-gray-400 hover:text-[#d5a22d] hover:border-[#d5a22d]'
                                    }`}
                                    title="Compare University"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* University Info Stack */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-black text-[#36335e] group-hover:text-[#d5a22d] transition-colors font-heading capitalize tracking-tight leading-tight">
                            <Link href={`/dashboard/schools/${university.id}`}>
                                {university.name}
                            </Link>
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            <div className="flex items-center gap-1.5 text-[#36335e]/60">
                                <MapPin className="w-3.5 h-3.5 text-[#d5a22d]" />
                                {university.country}
                            </div>
                            <span className="text-gray-200">•</span>
                            <span>{university.programCount} programs available</span>
                        </div>

                        {/* Status Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#d5a22d]/10 text-[#d5a22d] border border-[#d5a22d]/20 text-[9px] font-black uppercase tracking-[0.2em]">
                                <ShieldCheck className="w-3 h-3" />
                                Verified
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#36335e]/5 text-[#36335e]/60 border border-gray-100 text-[9px] font-black uppercase tracking-[0.2em]">
                                <Award className="w-3 h-3" />
                                Top Choice
                            </div>
                            {university.hasScholarship && (
                                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-[0.2em]">
                                    <Award className="w-3 h-3" />
                                    Scholarships
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Matching Program Highlight or Description */}
                {matchingProgram ? (
                    <Link
                        href={`/dashboard/programs/${matchingProgram.id}`}
                        className="bg-gradient-to-br from-[#36335e] to-[#2a284a] rounded-[2rem] p-5 border border-white/10 flex flex-col items-start justify-between gap-4 animate-in fade-in slide-in-from-right-4 duration-700 hover:shadow-2xl hover:shadow-[#36335e]/20 transition-all group/match relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(#d5a22d_1px,transparent_1px)] [background-size:10px_10px] opacity-10" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md text-[#d5a22d] rounded-2xl flex items-center justify-center shadow-inner border border-white/20 group-hover/match:rotate-6 transition-transform">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.3em] mb-0.5">Matching Program</p>
                                <p className="text-sm font-black text-white leading-tight group-hover/match:text-[#d5a22d] transition-colors">{matchingProgram.name}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-1 shrink-0 text-left relative z-10">
                            {matchingProgram.baseTuition && (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Tuition:</span>
                                    <span className="text-base font-black text-[#d5a22d] tracking-tight">
                                        {matchingProgram.scholarshipPercentage && matchingProgram.scholarshipPercentage > 0 
                                            ? (matchingProgram.baseTuition * (1 - matchingProgram.scholarshipPercentage / 100)).toLocaleString()
                                            : matchingProgram.baseTuition.toLocaleString()
                                        }
                                    </span>
                                    {matchingProgram.scholarshipPercentage && matchingProgram.scholarshipPercentage > 0 && (
                                        <span className="text-[8px] font-black text-white/30 line-through">{matchingProgram.baseTuition.toLocaleString()}</span>
                                    )}
                                </div>
                            )}
                            <div className="flex gap-3 text-[9px] text-white/60 font-black uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">
                                {matchingProgram.duration && <span>{matchingProgram.duration}</span>}
                                {matchingProgram.duration && matchingProgram.intake && <span className="text-[#d5a22d]">•</span>}
                                {matchingProgram.intake && <span>{matchingProgram.intake}</span>}
                            </div>
                        </div>
                    </Link>
                ) : (
                    university.description && (
                        <div className="relative">
                                <p className="text-sm text-slate-500 font-medium leading-relaxed pl-4 border-l-2 border-gray-100 italic">
                                    "{university.description}"
                                </p>
                        </div>
                    )
                )}

                {/* Level details removed as requested */}
            </div>
        </div>
    );
}
