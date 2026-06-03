'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
    Building2, MapPin, GraduationCap, Calendar, 
    Wallet, Clock, CheckCircle2, ArrowRight, 
    Mail, Sparkles, BookOpen, ShieldCheck, AlertCircle, Zap
} from 'lucide-react';
import { usePerformance } from '@/components/providers/PerformanceProvider';
import { cn } from '@/lib/utils';
import { getOrCreateConversation } from '@/lib/actions/messaging';

interface ProgramDetailsProps {
    program: {
        id: string;
        name: string;
        description: string | null;
        requirements: string | null;
        baseTuition: number;
        scholarshipPercentage: number | null;
        duration: string | null;
        level: string;
        intake: string | null;
        majors: string[];
        university: {
            id: string;
            name: string;
            logo: string | null;
            images: string[];
            country: {
                name: string;
                currencySymbol?: string;
            };
            admins?: { id: string }[];
        };
    };
}

export default function ProgramDetailsView({ program }: ProgramDetailsProps) {
    const { isLiteMode } = usePerformance();
    const router = useRouter();
    const [isMessagingLoading, setIsMessagingLoading] = useState(false);

    const adminId = program.university.admins?.[0]?.id;
    const currencySym = program.university.country.currencySymbol || '$';
    
    // Effective scholarship from program details
    const effectiveScholarship = program.scholarshipPercentage || 0;

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

    return (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1440px] mx-auto pb-24">
            
            {/* --- HERO HEADER SECTION --- */}
            <div className="relative overflow-hidden bg-[#1a1b41] rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl border-4 border-white/5">
                {/* Cinematic Background */}
                <div className="absolute inset-0 z-0">
                    {program.university.images?.[0] ? (
                        <>
                            <Image
                                src={program.university.images[0]}
                                alt={program.university.name}
                                fill
                                className="object-cover opacity-30 mix-blend-overlay grayscale"
                                sizes="100vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-tr from-[#1a1b41] via-[#1a1b41]/80 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-[#1a1b41] to-brand-primary" />
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,#d5a22d10_0%,transparent_70%)] opacity-30" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-accent/10 rounded-full blur-[120px]" />

                <div className="relative z-10 px-6 sm:px-12 py-10 sm:py-16">
                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12">
                        <div className="space-y-8 max-w-3xl text-center lg:text-left">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <Link 
                                    href={`/dashboard/schools/${program.university.id}`}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all"
                                >
                                    <Building2 className="w-3.5 h-3.5 text-brand-accent" />
                                    {program.university.name}
                                </Link>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent/20 text-brand-accent text-[9px] font-black uppercase tracking-[0.2em] border border-brand-accent/20">
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    Premium Program
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-xl sm:text-3xl lg:text-3xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl">
                                    {program.name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-brand-accent" />
                                        {program.university.country.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-brand-accent" />
                                        {program.level}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-brand-accent" />
                                        {program.duration || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4">
                                <Link
                                    href={`/dashboard/apply?programId=${program.id}`}
                                    className="inline-flex items-center justify-center gap-3 h-14 px-10 rounded-2xl bg-white text-[#1a1b41] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-brand-accent hover:text-[#1a1b41] transition-all hover:-translate-y-1 active:scale-95 group"
                                >
                                    Apply Now
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={handleStartConversation}
                                    className="inline-flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-white/10 text-white font-black uppercase tracking-widest text-[11px] backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all hover:-translate-y-1"
                                >
                                    <Mail className="w-4 h-4 text-brand-accent" />
                                    Inquiry
                                </button>
                            </div>
                        </div>

                        {/* Side Stats */}
                        <div className="hidden lg:flex flex-col gap-4">
                            {[
                                { icon: Sparkles, label: 'Success Rate', value: '98%' },
                                { icon: Calendar, label: 'Intake', value: program.intake || 'July 2026' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-4 rounded-3xl cursor-default group/stat">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent group-hover/stat:scale-110 transition-transform">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">{stat.label}</p>
                                        <p className="text-sm font-black text-white tracking-tight">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Main Content (Left) */}
                <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                    
                    {/* About Section */}
                    <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_60px_rgba(0,0,0,0.06)] transition-shadow duration-700">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#1a1b41] flex items-center justify-center shadow-lg shadow-[#1a1b41]/20">
                                    <BookOpen className="w-6 h-6 text-brand-accent" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#1a1b41] tracking-tighter">
                                        About <span className="text-brand-accent">Program</span>
                                    </h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Course Curriculum & Vision</p>
                                </div>
                            </div>
                            
                            <div className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium space-y-6 max-w-4xl">
                                {program.description ? (
                                    program.description.split('\n').filter(p => p.trim()).map((para, i) => (
                                        <p key={i} className="first-letter:text-4xl first-letter:font-black first-letter:text-[#1a1b41] first-letter:mr-2 first-letter:float-left">
                                            {para}
                                        </p>
                                    ))
                                ) : (
                                    <div className="py-12 px-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 text-center">
                                        <p className="italic text-slate-400 font-medium">Detailed program description is currently being reviewed for academic accuracy. Please check back soon or inquire with our team.</p>
                                    </div>
                                )}
                            </div>

                            {program.majors?.length > 0 && (
                                <div className="space-y-4 pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-brand-accent" />
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Core Majors & Pathways</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {program.majors.map((major, i) => (
                                            <div key={i} className="px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[#1a1b41] text-[11px] font-black uppercase tracking-wider hover:bg-[#1a1b41] hover:text-white transition-all cursor-default flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                                {major}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Requirements Section (Dark) */}
                    <div className="bg-[#1a1b41] rounded-[3rem] p-8 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,#d5a22d08_0%,transparent_70%)]" />
                        
                        <div className="space-y-8 relative z-10">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-10 bg-brand-accent rounded-full" />
                                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admission <span className="text-brand-accent">Criteria</span></h2>
                                </div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-5 mb-0">Academic & Entry Requirements</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-brand-accent" />
                                    </div>
                                    <h3 className="text-sm font-black text-white/90 tracking-widest uppercase">Academic Requirements</h3>
                                </div>
                                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5">
                                    <p className="text-white/70 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
                                        {program.requirements || "Standard academic eligibility applies for this level of study. Please contact admissions for detailed prerequisite evaluation."}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-brand-accent/10 border border-brand-accent/20 p-8 rounded-[2rem] flex items-start gap-5">
                                <AlertCircle className="w-6 h-6 text-brand-accent shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Counselor's Tip</p>
                                    <p className="text-white/60 text-xs font-medium leading-relaxed">
                                        Admission criteria can vary based on your home country's education system. We highly recommend a preliminary document review by our global team.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="lg:col-span-4 sticky top-24 space-y-6">
                    {/* Quick Facts Sidebar */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Sparkles className="w-24 h-24 text-[#1a1b41]" />
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Zap className="w-3 h-3" />
                            <span>Quick Specs</span>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-5 group/item transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1a1b41]/5 transition-all shadow-sm">
                                    <Wallet className="w-6 h-6 text-gray-400 group-hover/item:text-brand-accent transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Annual Tuition</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-base font-black text-[#1a1b41]">{currencySym}{program.baseTuition.toLocaleString()}</span>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">/ yr</span>
                                    </div>
                                    {effectiveScholarship > 0 && (
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Reflects {effectiveScholarship}% Scholarship</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-5 group/item transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1a1b41]/5 transition-all shadow-sm">
                                    <Clock className="w-6 h-6 text-gray-400 group-hover/item:text-brand-accent transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Program Duration</p>
                                    <p className="text-sm font-black text-brand-primary tracking-tight">{program.duration || 'Flexible'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 group/item transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1a1b41]/5 transition-all shadow-sm">
                                    <Calendar className="w-6 h-6 text-gray-400 group-hover/item:text-brand-accent transition-colors" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Next Intake</p>
                                    <p className="text-sm font-black text-brand-primary tracking-tight">{program.intake || 'Ongoing'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <button
                                onClick={handleStartConversation}
                                disabled={isMessagingLoading}
                                className="w-full h-14 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#1a1b41] text-white font-black text-[11px] uppercase tracking-widest shadow-xl hover:shadow-[#1a1b41]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 group/btn"
                            >
                                <Mail className="w-4 h-4 text-brand-accent group-hover/btn:scale-110 transition-transform" />
                                {isMessagingLoading ? 'Processing...' : 'Ask a Question'}
                            </button>
                        </div>
                    </div>

                    {/* CTA Sidebar Card */}
                    <div className="bg-linear-to-br from-brand-accent to-[#b88a24] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black leading-tight">Ready to enroll?</h4>
                                <p className="text-xs text-white/80 font-medium leading-relaxed">
                                    Limited seats available for the {program.intake || 'upcoming'} intake. Start your application today.
                                </p>
                            </div>
                            <Link 
                                href={`/dashboard/apply?programId=${program.id}`}
                                className="w-full h-14 bg-[#1a1b41] text-white flex items-center justify-center font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-[#2a2b5a] hover:-translate-y-1 active:scale-95 shadow-xl"
                            >
                                Start Application
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Global CTA */}
            <div className="pt-10 border-t border-gray-100">
                <div className="bg-[#1a1b41] rounded-[4rem] p-10 sm:p-16 text-center space-y-10 relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#d5a22d10_0%,transparent_70%)]" />
                    </div>
                    
                    <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-black uppercase tracking-[0.3em] border border-brand-accent/30 animate-pulse">
                                Admissions Priority Open
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tighter leading-none">
                            Your future at <span className="text-brand-accent">{program.university.name}</span> starts here.
                        </h2>
                        <p className="text-sm sm:text-base text-white/60 font-medium">
                            Join our global community of scholars in the {program.name} program. Secure your place for the {program.intake || 'upcoming'} intake.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            href={`/dashboard/apply?programId=${program.id}`}
                            className="h-14 px-10 bg-brand-accent text-[#1a1b41] flex items-center justify-center font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            Apply Now
                        </Link>
                        <button 
                            onClick={handleStartConversation}
                            className="h-14 px-10 bg-white/10 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md"
                        >
                            Speak to a Counselor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
