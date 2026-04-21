'use client';

import React from 'react';
import { Building2, MapPin, Globe, Sparkles, GraduationCap, Users, Calendar } from 'lucide-react';
import Image from 'next/image';


interface UniversityHeroHeaderProps {
    university: {
        name: string;
        images: string[];
        logo: string | null;
        website: string | null;
        country: {
            name: string;
        };
        programsCount: number;
        applicationOpenDate?: Date | string | null;
        applicationCloseDate?: Date | string | null;
    };
    activeTab: 'overview' | 'programs' | 'gallery';
    setActiveTab: (tab: 'overview' | 'programs' | 'gallery') => void;
}

export function UniversityHeroHeader({ university, activeTab, setActiveTab }: UniversityHeroHeaderProps) {
    const [timeLeft, setTimeLeft] = React.useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

    const openDate = university.applicationOpenDate ? new Date(university.applicationOpenDate) : null;
    const closeDate = university.applicationCloseDate ? new Date(university.applicationCloseDate) : null;
    const now = new Date();

    const isWithinWindow = openDate && closeDate && now >= openDate && now <= closeDate;
    const isBeforeOpen = openDate && now < openDate;

    React.useEffect(() => {
        if (!closeDate || !isWithinWindow) return;

        const timer = setInterval(() => {
            const difference = closeDate.getTime() - new Date().getTime();
            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft(null);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [closeDate, isWithinWindow]);

    return (
        <div className="space-y-4">
            <div className="relative overflow-hidden bg-[#1a1b41] rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border-4 border-white/5">
                {/* Immersive Background */}
                <div className="absolute inset-0 z-0">
                    {university.images?.[0] ? (
                        <>
                            <Image
                                src={university.images[0]}
                                alt={university.name}
                                fill
                                className="object-cover opacity-30 mix-blend-overlay grayscale"
                                sizes="100vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1b41] via-[#1a1b41]/80 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1b41] to-[#36335e]" />
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,#d5a22d10_0%,transparent_70%)] opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#d5a22d]/10 rounded-full blur-[120px]" />

                <div className="relative z-10 px-6 sm:px-12 py-8 sm:py-12 max-w-[1440px] mx-auto">
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Countdown / Window Status */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            {isWithinWindow && timeLeft && (
                                <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-4 duration-1000">
                                    <div className="flex items-center gap-3 px-4 py-2 bg-[#d5a22d]/20 rounded-2xl border border-[#d5a22d]/30 backdrop-blur-md">
                                        <div className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
                                        <span className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.2em]">Admission Window Closes In:</span>
                                    </div>
                                    <div className="flex gap-4">
                                        {[
                                            { label: 'D', value: timeLeft.days },
                                            { label: 'H', value: timeLeft.hours },
                                            { label: 'M', value: timeLeft.minutes },
                                            { label: 'S', value: timeLeft.seconds },
                                        ].map((unit, i) => (
                                            <div key={i} className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-white">{unit.value.toString().padStart(2, '0')}</span>
                                                <span className="text-[8px] font-black text-[#d5a22d] uppercase">{unit.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {isBeforeOpen && (
                                <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-500/20 rounded-2xl border border-blue-500/30 backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-1000">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Next Admission Opening: {openDate?.toLocaleDateString()}</span>
                                </div>
                            )}
                            {!isWithinWindow && !isBeforeOpen && (
                                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-1000">
                                    <div className="w-2 h-2 rounded-full bg-white/40" />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Admissions Currently Closed</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 sm:gap-8">
                            <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                                {/* University Logo */}
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-[#d5a22d] rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-5 shadow-2xl flex-shrink-0 border-4 border-white transform transition-transform duration-700 group-hover:rotate-3">
                                        {university.logo ? (
                                            <Image
                                                src={university.logo}
                                                alt={university.name}
                                                fill
                                                className="object-contain p-3 sm:p-4 group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 640px) 96px, 144px"
                                                priority
                                            />
                                        ) : (
                                            <Building2 className="w-full h-full text-gray-200" />
                                        )}
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 w-10 h-10 sm:w-12 sm:h-12 bg-[#d5a22d] rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="space-y-4 max-w-3xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.3em]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d5a22d] animate-ping" />
                                        Verified Global Institution
                                    </div>
                                    
                                    <h1 className="text-2xl sm:text-4xl lg:text-4xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                                        {university.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs text-white/70 font-black uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                                            <MapPin className="w-4 h-4 text-[#d5a22d]" />
                                            <span>{university.country.name}</span>
                                        </div>
                                        {university.website && (
                                            <a
                                                href={university.website.startsWith('http') ? university.website : `https://${university.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-[#d5a22d] hover:text-white transition-all hover:scale-105"
                                            >
                                                <Globe className="w-4 h-4" />
                                                Official Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats Chips */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-3 w-full lg:w-auto">
                                {[
                                    { icon: Users, label: 'Global Rank', value: 'Top 5%' },
                                    { icon: Calendar, label: 'Next Intake', value: 'Sep 2026' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-2.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl hover:bg-white/10 transition-all cursor-default group/stat">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#d5a22d]/20 flex items-center justify-center text-[#d5a22d] group-hover/stat:scale-110 transition-transform">
                                            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{stat.label}</p>
                                            <p className="text-xs sm:text-sm font-black text-white tracking-tight">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className="relative z-30 -mt-8 sm:-mt-10 px-4 sm:px-12 max-w-[1440px] mx-auto">
                <div className="bg-white/95 backdrop-blur-2xl border border-gray-200 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2.5 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview', icon: Building2, count: null },
                        { id: 'programs', label: 'Programs', icon: Sparkles, count: university.programsCount },
                        { id: 'gallery', label: 'Gallery', icon: Globe, count: university.images?.length || 0 }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 sm:py-4 px-6 sm:px-10 rounded-[2rem] text-[10px] sm:text-xs font-black tracking-[0.2em] transition-all duration-500 whitespace-nowrap flex items-center justify-center gap-3 relative group/tab ${activeTab === tab.id
                                ? 'bg-[#1a1b41] text-white shadow-2xl translate-y-[-4px]'
                                : 'text-slate-400 hover:text-[#1a1b41] hover:bg-gray-100/50'
                            }`}
                        >
                            <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover/tab:scale-110 ${activeTab === tab.id ? 'text-[#d5a22d]' : ''}`} />
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#d5a22d] text-[#1a1b41]' : 'bg-gray-100 text-slate-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
