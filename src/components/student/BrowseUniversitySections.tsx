'use client';

import { Sparkles, Globe2, GraduationCap, ArrowRight, CheckCircle, Search, Rocket, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface FeaturedUniversity {
    id: string;
    name: string;
    logo: string | null;
    country: string;
    programCount: number;
}

interface BrowseUniversitySectionsProps {
    featuredUniversities: FeaturedUniversity[];
    countries: { id: string; name: string }[];
}

export function FeaturedSection({ universities }: { universities: FeaturedUniversity[] }) {
    if (universities.length === 0) return null;

    return (
        <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black text-[#36335e] uppercase tracking-tight">Featured Institutions</h2>
                    <p className="text-slate-500 text-sm font-medium">Top-tier universities with high acceptance rates</p>
                </div>
                <div className="h-px flex-1 bg-gray-100 mx-8 hidden md:block" />
                <Link href="#all-universities" className="text-[#d5a22d] font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-2">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {universities.slice(0, 4).map((uni) => (
                    <Link 
                        key={uni.id} 
                        href={`/dashboard/schools/${uni.id}`}
                        className="group bg-white p-6 rounded-[2rem] border border-gray-100 hover:border-[#d5a22d]/30 shadow-sm hover:shadow-xl hover:shadow-[#36335e]/5 transition-all duration-500 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <GraduationCap className="w-16 h-16 text-[#36335e]" />
                        </div>
                        
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-3 mb-4 group-hover:scale-110 transition-transform">
                            {uni.logo ? (
                                <img src={uni.logo} alt={uni.name} className="w-full h-full object-contain" />
                            ) : (
                                <GraduationCap className="w-6 h-6 text-[#36335e]" />
                            )}
                        </div>
                        
                        <h3 className="font-bold text-[#36335e] line-clamp-1 mb-1 group-hover:text-[#d5a22d] transition-colors">{uni.name}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Globe2 className="w-3 h-3 text-[#d5a22d]" />
                            {uni.country}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function DestinationsSection({ countries }: { countries: { name: string }[] }) {
    // Pick some popular ones or just the first few
    const popular = countries.slice(0, 6);
    
    return (
        <div className="mb-16 py-12 px-8 bg-gradient-to-br from-[#36335e] to-[#1a1b41] rounded-[3rem] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d5a22d_1px,transparent_1px)] [background-size:20px_20px]" />
            
            <div className="relative z-10 text-center mb-10">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Popular Destinations</h2>
                <p className="text-white/60 text-sm font-medium">Explore opportunities in these top-rated academic hubs</p>
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {popular.map((country, i) => (
                    <div 
                        key={i}
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-[#d5a22d]/50 transition-all cursor-pointer group text-center"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Globe2 className="w-6 h-6 text-[#d5a22d]" />
                        </div>
                        <span className="text-white font-bold text-sm tracking-tight">{country.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function HowItWorksSection() {
    const steps = [
        { icon: Search, title: "Discover", desc: "Browse through thousands of programs worldwide." },
        { icon: CheckCircle, title: "Shortlist", desc: "Compare costs, rankings, and requirements." },
        { icon: Rocket, title: "Apply Fast", desc: "Submit multi-applications with one profile." }
    ];

    return (
        <div className="mb-16">
            <div className="text-center mb-12">
                <span className="text-[#d5a22d] font-black text-[10px] uppercase tracking-[0.3em]">Easy Process</span>
                <h2 className="text-2xl font-black text-[#36335e] uppercase tracking-tight mt-2">How it Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, i) => (
                    <div key={i} className="relative group">
                        {i < 2 && (
                            <div className="absolute top-1/2 left-full w-full h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block" />
                        )}
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative z-10 group-hover:shadow-xl transition-all">
                            <div className="w-16 h-16 bg-[#36335e]/5 text-[#36335e] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#36335e] group-hover:text-white transition-all">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-black text-[#36335e] uppercase tracking-tight mb-2">{step.title}</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TrustSection() {
    return (
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 rounded-[3rem] p-12 overflow-hidden relative">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d5a22d]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 text-[#d5a22d]">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="font-black text-xs uppercase tracking-widest">Global Trust</span>
                </div>
                <h2 className="text-2xl font-black text-[#36335e] uppercase tracking-tight leading-none">
                    Why Choose <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#36335e] to-[#d5a22d]">Tenpaten Apply</span>
                </h2>
                <div className="space-y-4">
                    {[
                        "Direct communication with university admins",
                        "Simplified document management system",
                        "Expert guidance on visa and admissions",
                        "Fastest application turn-around time"
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-[#d5a22d]/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-[#d5a22d]" />
                            </div>
                            <p className="text-[#36335e] font-bold text-sm tracking-tight">{text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative group perspective-1000 hidden lg:block">
                <div className="bg-[#36335e] p-8 rounded-[2.5rem] shadow-2xl transform transition-transform group-hover:rotate-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-white/10" />
                        <div className="h-4 w-32 bg-white/10 rounded-full" />
                    </div>
                    <div className="space-y-4 mb-8">
                        <div className="h-4 w-full bg-white/5 rounded-full" />
                        <div className="h-4 w-5/6 bg-white/5 rounded-full" />
                        <div className="h-4 w-4/6 bg-white/5 rounded-full" />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-10 w-24 bg-[#d5a22d] rounded-xl" />
                        <div className="flex -space-x-3">
                            {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#36335e]" />)}
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-[#d5a22d] px-6 py-3 rounded-2xl shadow-xl font-black text-white text-xs uppercase tracking-widest">
                        Verified by AI
                    </div>
                </div>
            </div>
        </div>
    );
}
