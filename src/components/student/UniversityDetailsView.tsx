'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getOrCreateConversation } from '@/lib/actions/messaging';
import { Sparkles } from 'lucide-react';

import { UniversityHeroHeader } from './university/UniversityHeroHeader';
import { UniversityOverview, UniversityQuickFactsSidebar } from './university/UniversityOverview';
import { UniversityProgramsList } from './university/UniversityProgramsList';
import { UniversityGallery } from './university/UniversityGallery';
import { UniversityRequirements } from './university/UniversityRequirements';
import { HowItWorksSection, TrustSection } from './BrowseUniversitySections';

interface UniversityDetailsProps {
    university: {
        id: string;
        name: string;
        description: string | null;
        images: string[];
        logo: string | null;
        website: string | null;
        tuition: string | null;
        country: {
            name: string;
            currencySymbol?: string;
        };
        programs: any[];
        globalScholarshipActive?: boolean;
        globalScholarshipPercentage?: number | null;
        applicationRequirements?: any;
        admins?: { id: string }[];
        applicationOpenDate?: Date | string | null;
        applicationCloseDate?: Date | string | null;
    };
}

export default function UniversityDetailsView({ university }: UniversityDetailsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialTab = searchParams.get('tab') as 'overview' | 'programs' | 'gallery' | null;
    const initialLevel = searchParams.get('level');

    const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'gallery'>(initialTab || 'overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [levelFilter, setLevelFilter] = useState<string>(initialLevel || 'all');
    const [isMessagingLoading, setIsMessagingLoading] = useState(false);

    // Admission Window Logic
    const now = new Date();
    const openDate = university.applicationOpenDate ? new Date(university.applicationOpenDate) : null;
    const closeDate = university.applicationCloseDate ? new Date(university.applicationCloseDate) : null;
    
    const isWithinWindow = openDate && closeDate && now >= openDate && now <= closeDate;
    const isBeforeOpen = openDate && now < openDate;
    const isAfterClose = closeDate && now > closeDate;

    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

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

    const adminId = university.admins?.[0]?.id;

    const handleStartConversation = async () => {
        if (!adminId || isMessagingLoading) return;
        setIsMessagingLoading(true);

        try {
            const { conversationId } = await getOrCreateConversation(adminId);
            router.push(`/dashboard/messages?id=${conversationId}`);
        } catch (error) {
            console.error('Failed to start conversation:', error);
        } finally {
            setIsMessagingLoading(false);
        }
    };

    const programLevels = useMemo(() => {
        const levels = new Set<string>();
        (university.programs || []).forEach(p => {
            if (p.level) levels.add(p.level);
        });
        return Array.from(levels).sort();
    }, [university.programs]);

    const filteredPrograms = useMemo(() => {
        return (university.programs || []).map(p => ({
            ...p,
            scholarshipPercentage: (university.globalScholarshipActive && !p.excludeFromGlobalScholarship) ? university.globalScholarshipPercentage : null
        })).filter(program => {
            const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (program.department?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = levelFilter === 'all' || program.level === levelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [university.programs, searchQuery, levelFilter, university.globalScholarshipActive, university.globalScholarshipPercentage]);

    const groupedPrograms = useMemo(() => {
        return filteredPrograms.reduce((acc: any, program: any) => {
            const deptName = program.department?.name || 'Other Programs';
            if (!acc[deptName]) acc[deptName] = [];
            acc[deptName].push(program);
            return acc;
        }, {});
    }, [filteredPrograms]);

    return (
        <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1440px] mx-auto pb-24">
            <UniversityHeroHeader
                university={{
                    name: university.name,
                    images: university.images,
                    logo: university.logo,
                    website: university.website,
                    country: university.country,
                    programsCount: (university.programs || []).length,
                }}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className={`${activeTab === 'overview' ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8 sm:space-y-12`}>
                    {activeTab === 'overview' && (
                        <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="bg-white rounded-[3rem] p-6 sm:p-12 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_60px_rgba(0,0,0,0.06)] transition-shadow duration-700">
                                <UniversityOverview description={university.description} name={university.name} />
                            </div>
                            
                            <div className="bg-[#1a1b41] rounded-[3rem] p-6 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,#d5a22d08_0%,transparent_70%)]" />
                                <UniversityRequirements requirements={university.applicationRequirements} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <UniversityGallery images={university.images} />
                    )}

                    {activeTab === 'programs' && (
                        <UniversityProgramsList
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            levelFilter={levelFilter}
                            setLevelFilter={setLevelFilter}
                            programLevels={programLevels}
                            groupedPrograms={groupedPrograms}
                            currencySym={university.country.currencySymbol || '$'}
                        />
                    )}
                </div>

                {activeTab === 'overview' && (
                    <div className="lg:col-span-4 sticky top-24 space-y-8">
                        <UniversityQuickFactsSidebar
                            countryName={university.country.name}
                            programsCount={ (university.programs || []).length}
                            tuition={university.tuition}
                            onMessageClick={handleStartConversation}
                            isMessagingLoading={isMessagingLoading}
                            canMessage={!!adminId}
                        />
                        
                        {/* Call to Action Card in Sidebar */}
                        <div className="bg-linear-to-br from-brand-accent to-[#b88a24] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black leading-tight">Ready to start your journey?</h4>
                                    <p className="text-sm text-white/80 font-medium leading-relaxed">
                                        Join over 5,000 students who found their future at {university.name} this year.
                                    </p>
                                </div>
                                <button 
                                    disabled={!isWithinWindow}
                                    onClick={() => setActiveTab('programs')}
                                    className="w-full h-14 bg-[#1a1b41] text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-[#2a2b5a] hover:-translate-y-1 active:scale-95 shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    {isWithinWindow ? 'Apply for Admission' : isBeforeOpen ? 'Opening Soon' : 'Admissions Closed'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom CTA Section */}
            <div className="pt-10 border-t border-gray-100">
                <div className="bg-[#1a1b41] rounded-[4rem] p-8 sm:p-12 text-center space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#d5a22d10_0%,transparent_70%)]" />
                    </div>
                    
                    <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                        {isWithinWindow && timeLeft && (
                            <div className="flex flex-col items-center gap-4 mb-8">
                                <span className="text-brand-accent text-[9px] font-black uppercase tracking-[0.3em]">Application Deadline Countdown</span>
                                <div className="flex gap-4">
                                    {[
                                        { label: 'Days', value: timeLeft.days },
                                        { label: 'Hours', value: timeLeft.hours },
                                        { label: 'Min', value: timeLeft.minutes },
                                        { label: 'Sec', value: timeLeft.seconds },
                                    ].map((unit, i) => (
                                        <div key={i} className="flex flex-col items-center min-w-[70px]">
                                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-2">
                                                <span className="text-2xl font-black text-white">{unit.value.toString().padStart(2, '0')}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{unit.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {!isWithinWindow && !isBeforeOpen && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/20 text-brand-accent text-[9px] font-black uppercase tracking-[0.3em] border border-brand-accent/30 animate-bounce">
                                Admissions Closed
                            </span>
                        )}
                        {isBeforeOpen && (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] border border-blue-500/30">
                                Opening on {openDate?.toLocaleDateString()}
                            </span>
                        )}
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter leading-none">
                            Your future at <span className="text-brand-accent">{university.name}</span> starts here.
                        </h2>
                        <p className="text-sm sm:text-base text-white/60 font-medium">
                            {isWithinWindow 
                                ? "Don't miss the upcoming application deadline. Connect with admissions today to secure your spot."
                                : isBeforeOpen 
                                    ? "Prepare your documents. Admissions will be opening soon for the next intake."
                                    : "Admissions for the current intake are closed. Stay tuned for future openings."}
                        </p>
                    </div>

                    {isWithinWindow && (
                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button 
                                onClick={handleStartConversation}
                                className="h-14 px-10 bg-brand-accent text-[#1a1b41] font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
                            >
                                Connect with Admissions
                            </button>
                            <button 
                                onClick={() => setActiveTab('programs')}
                                className="h-14 px-10 bg-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md"
                            >
                                Explore Programs
                            </button>
                        </div>
                    )}
                    
                    {!isWithinWindow && (
                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button 
                                onClick={handleStartConversation}
                                className="h-14 px-10 bg-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md flex items-center gap-3"
                            >
                                <Sparkles className="w-4 h-4 text-brand-accent" />
                                Get Notified for Next Intake
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
