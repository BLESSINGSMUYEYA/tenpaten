'use client';

import React from 'react';
import { MapPin, BookOpen, DollarSign, Mail, Building2, Sparkles } from 'lucide-react';

export function UniversityOverview({ description, name }: { description: string | null, name: string }) {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1b41] flex items-center justify-center shadow-lg shadow-[#1a1b41]/20">
                        <Building2 className="w-6 h-6 text-[#d5a22d]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#1a1b41] tracking-tighter">
                            About <span className="text-[#d5a22d]">Institution</span>
                        </h2>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Institutional DNA & Legacy</p>
                    </div>
                </div>
            </div>
            
            <div className="text-base text-slate-600 leading-relaxed font-medium space-y-6 max-w-4xl">
                {description ? (
                    description.split('\n').filter(p => p.trim()).map((para, i) => (
                        <p key={i} className="first-letter:text-4xl first-letter:font-black first-letter:text-[#1a1b41] first-letter:mr-2 first-letter:float-left">
                            {para}
                        </p>
                    ))
                ) : (
                    <div className="py-12 px-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                        <p className="italic text-slate-400">Institutional narrative is currently being finalized. Please check back soon for the full profile.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function UniversityQuickFactsSidebar({
    countryName,
    programsCount,
    tuition,
    onMessageClick,
    isMessagingLoading,
    canMessage
}: {
    countryName: string;
    programsCount: number;
    tuition: string | null;
    onMessageClick: () => void;
    isMessagingLoading: boolean;
    canMessage: boolean;
}) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Sparkles className="w-24 h-24 text-[#1a1b41]" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                    <Sparkles className="w-3 h-3" />
                    <span>Quick Facts</span>
                </div>

                <div className="space-y-8">
                    <div className="flex items-center gap-5 group/item border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1a1b41]/5 transition-all duration-500 shadow-sm">
                            <MapPin className="w-6 h-6 text-gray-400 group-hover/item:text-[#d5a22d] transition-colors" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Location</p>
                            <p className="text-sm font-black text-[#36335e] tracking-tight">{countryName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 group/item border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1a1b41]/5 transition-all duration-500 shadow-sm">
                            <BookOpen className="w-6 h-6 text-gray-400 group-hover/item:text-[#d5a22d] transition-colors" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Programs</p>
                            <p className="text-sm font-black text-[#36335e] tracking-tight">{programsCount}+ Courses</p>
                        </div>
                    </div>

                    {tuition && (
                        <div className="flex items-center gap-5 group/item border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1a1b41]/5 transition-all duration-500 shadow-sm">
                                <DollarSign className="w-6 h-6 text-slate-400 group-hover/item:text-[#d5a22d] transition-colors" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] mb-1">Estimated Tuition</p>
                                <p className="text-sm font-black text-[#1a1b41] tracking-tight">{tuition}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100">
                    <button
                        onClick={onMessageClick}
                        disabled={!canMessage || isMessagingLoading}
                        className="w-full h-14 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#1a1b41] text-white font-black text-[11px] uppercase tracking-widest shadow-xl hover:shadow-[#1a1b41]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 group/btn"
                    >
                        <Mail className="w-4 h-4 text-[#d5a22d] group-hover/btn:scale-110 transition-transform" />
                        {isMessagingLoading ? 'Processing...' : 'Direct Message'}
                    </button>
                    <p className="text-center mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Typical response: 24-48 hours</p>
                </div>
            </div>
        </div>
    );
}
