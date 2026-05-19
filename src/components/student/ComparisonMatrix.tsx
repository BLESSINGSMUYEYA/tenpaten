'use client';

import { X, Building2, MapPin, Star, ShieldCheck, Award, GraduationCap, CheckCircle, Percent } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Program {
    id: string;
    name: string;
    level: string;
    baseTuition: number | null;
    scholarshipPercentage: number | null;
    duration?: string | null;
    intake?: string | null;
    departmentName?: string | null;
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
}

interface ComparisonMatrixProps {
    universities: University[];
    onClose: () => void;
}

export default function ComparisonMatrix({ universities, onClose }: ComparisonMatrixProps) {
    if (universities.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#1d1b41]/40 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative"
            >
                {/* Header */}
                <div className="p-6 sm:p-8 bg-[#1d1b41] text-white flex items-center justify-between border-b border-white/10 shrink-0">
                    <div className="space-y-1 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/20 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.25em]">
                            <GraduationCap className="w-3.5 h-3.5" />
                            Curriculum Comparator
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">University Comparison</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Matrix Content */}
                <div className="flex-grow overflow-y-auto p-6 sm:p-8 custom-scrollbar space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        {universities.map((uni) => (
                            <div 
                                key={uni.id}
                                className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-6 flex flex-col gap-6 relative group hover:border-[#d5a22d]/20 hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                                {/* Gold Header Decor */}
                                <div className="absolute top-0 left-6 right-6 h-[2px] bg-[#d5a22d] opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* University Identity */}
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3 relative shrink-0">
                                        {uni.logo ? (
                                            <Image 
                                                src={uni.logo} 
                                                alt={uni.name} 
                                                fill 
                                                className="object-contain p-2" 
                                            />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-[#36335e]/40" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-[#36335e] text-base leading-tight line-clamp-1">{uni.name}</h3>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                            <MapPin className="w-3 h-3 text-[#d5a22d]" />
                                            {uni.country}
                                        </div>
                                    </div>
                                </div>

                                {/* Comparison Details */}
                                <div className="space-y-6 text-left flex-1">
                                    {/* Verification Status */}
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Security & Trust</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d5a22d]/10 text-[#d5a22d] border border-[#d5a22d]/20 text-[9px] font-black uppercase tracking-[0.15em]">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                Accredited
                                            </div>
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#36335e]/5 text-[#36335e]/60 border border-gray-100 text-[9px] font-black uppercase tracking-[0.15em]">
                                                <Award className="w-3.5 h-3.5" />
                                                Choice Tier
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scholarships */}
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Financial Benefits</h4>
                                        {uni.hasScholarship ? (
                                            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 space-y-1">
                                                <div className="flex items-center gap-2 text-emerald-600">
                                                    <Percent className="w-4 h-4" />
                                                    <span className="text-xs font-black uppercase tracking-wider">Scholarships Active</span>
                                                </div>
                                                <p className="text-[10px] text-emerald-600/70 font-semibold leading-relaxed">Active fee waivers and global discounts are available for this institution.</p>
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-slate-400 text-xs font-medium">
                                                Standard Tuition Fees Apply
                                            </div>
                                        )}
                                    </div>

                                    {/* Academics Coverage */}
                                    <div className="space-y-2.5">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Academic Programs</h4>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs font-bold text-[#36335e]">
                                                <span>Total Active Courses:</span>
                                                <span className="font-black text-sm text-[#d5a22d]">{uni.programCount}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs font-bold text-[#36335e]">
                                                <span>Departments/Faculties:</span>
                                                <span className="font-black text-sm">{uni.departments.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Program Preview */}
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Curriculum Highlights</h4>
                                        <div className="space-y-1.5">
                                            {uni.programs.slice(0, 3).map((p) => (
                                                <div 
                                                    key={p.id} 
                                                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-100 flex items-center justify-between text-xs font-bold text-[#36335e]"
                                                >
                                                    <span className="truncate max-w-[130px]">{p.name}</span>
                                                    <span className="text-[10px] text-[#d5a22d] font-black uppercase shrink-0">{p.level}</span>
                                                </div>
                                            ))}
                                            {uni.programs.length > 3 && (
                                                <p className="text-[10px] text-[#d5a22d] font-black uppercase tracking-wider text-center pt-1">+ {uni.programs.length - 3} More Programs</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl bg-[#36335e] text-white hover:bg-[#2a284a] text-xs font-black uppercase tracking-widest transition-all"
                    >
                        Back to Search
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
