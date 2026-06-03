'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Trophy, GraduationCap, Coins, Globe2, 
    CheckCircle2, ArrowRight, Sparkles, BookOpen,
    ShieldCheck, Zap
} from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

export default function ScholarshipsPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-brand-accent/30 font-sans">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1b41]/95 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <TenpatenLogo variant="white" />
                    <Link
                        href="/register?type=student"
                        className="px-6 py-2.5 bg-brand-accent text-[#1a1b41] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-brand-accent/20"
                    >
                        Apply Now
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#1a1b41] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1523050853064-85049f3f9620?auto=format&fit=crop&q=80&w=2000" 
                        alt="Graduation"
                        className="w-full h-full object-cover opacity-10"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-[#1a1b41] via-transparent to-[#1a1b41]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-accent text-xs font-black uppercase tracking-[0.3em] mb-8"
                    >
                        <Trophy className="w-4 h-4" />
                        Scholarships & Funding
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8"
                    >
                        Global Talent <br />
                        <span className="text-brand-accent">Deserves Support.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-white/60 text-lg font-medium leading-relaxed mb-12"
                    >
                        We partner with world-class universities to offer exclusive scholarships, 
                        merit-based awards, and financial aid to help you reach your academic goals without the burden.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/register?type=student"
                            className="w-full sm:w-auto px-10 py-5 bg-brand-accent text-[#1a1b41] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-2xl shadow-brand-accent/20"
                        >
                            Find Your Scholarship
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                        >
                            Browse Programs
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Scholarship Types */}
            <section className="py-24 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-5xl font-black text-[#1a1b41] tracking-tighter uppercase leading-none mb-6">Funding Categories</h2>
                        <p className="text-gray-500 font-medium max-w-xl mx-auto">Different paths to support your education, tailored to your achievements and background.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Sparkles,
                                title: "Merit-Based",
                                desc: "Awards for students with exceptional academic records, leadership potential, or artistic excellence.",
                                color: "bg-amber-50 text-amber-600"
                            },
                            {
                                icon: Coins,
                                title: "Financial Aid",
                                desc: "Need-based assistance to ensure that talented students from all backgrounds can access global education.",
                                color: "bg-emerald-50 text-emerald-600"
                            },
                            {
                                icon: BookOpen,
                                title: "Subject-Specific",
                                desc: "Exclusive funding for specific fields such as STEM, Creative Arts, Medicine, and Sustainable Energy.",
                                color: "bg-indigo-50 text-indigo-600"
                            }
                        ].map((type, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-brand-accent/30 transition-all duration-500 group">
                                <div className={`w-14 h-14 rounded-2xl ${type.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                                    <type.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-[#1a1b41] uppercase tracking-tight mb-4">{type.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed text-sm">{type.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 lg:py-32 bg-[#f8fafc] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
                    <Coins className="w-full h-full text-brand-accent" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-widest mb-6">
                                The Process
                            </div>
                            <h2 className="text-3xl lg:text-5xl font-black text-[#1a1b41] tracking-tighter uppercase leading-[0.9] mb-8">
                                How to Secure <br /> Your Funding
                            </h2>
                            <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
                                We've simplified the scholarship application process. One platform, multiple opportunities.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { step: "01", title: "Complete Your Profile", desc: "Our system uses your academic dossier to automatically match you with eligible funding." },
                                    { step: "02", title: "Filter by Scholarship", desc: "Browse programs specifically offering partial or full scholarships in your field of study." },
                                    { step: "03", title: "Single-Click Application", desc: "Submit your program application; our partner universities automatically review you for aid." },
                                    { step: "04", title: "Receive Your Offer", desc: "Get notified in real-time when a scholarship is awarded alongside your admission offer." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6">
                                        <div className="text-2xl font-black text-brand-accent/20 tracking-tighter">{item.step}</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-[#1a1b41] uppercase tracking-tight mb-1">{item.title}</h4>
                                            <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-[3rem] bg-[#1a1b41] p-12 relative overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-accent rounded-full blur-[100px]" />
                                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[100px]" />
                                </div>
                                <div className="relative z-10 flex flex-col justify-center h-full space-y-8">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Scholarship Match</span>
                                            <Zap className="w-4 h-4 text-brand-accent" />
                                        </div>
                                        <div className="text-xl font-black text-white uppercase tracking-tighter">100% Tuition Waiver</div>
                                        <div className="text-sm text-brand-accent font-bold">Engineering Excellence Award</div>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm transform translate-x-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Financial Aid</span>
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div className="text-xl font-black text-white uppercase tracking-tighter">$5,000 / Year</div>
                                        <div className="text-sm text-white/60 font-bold">Diversity & Inclusion Grant</div>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Merit Reward</span>
                                            <Trophy className="w-4 h-4 text-brand-accent" />
                                        </div>
                                        <div className="text-xl font-black text-white uppercase tracking-tighter">50% Coverage</div>
                                        <div className="text-sm text-brand-accent font-bold">Global Leader Scholarship</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-[#1a1b41] relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-8">
                        Your Future Shouldn't <br /> Be Limited by Funding.
                    </h2>
                    <Link
                        href="/register?type=student"
                        className="inline-flex items-center gap-4 px-12 py-6 bg-brand-accent text-[#1a1b41] rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-2xl shadow-brand-accent/20"
                    >
                        Start Your Application
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Simplified Footer */}
            <footer className="py-12 bg-[#151636] border-t border-white/5 text-center">
                <TenpatenLogo variant="white" className="mb-6 opacity-50" />
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                    &copy; {new Date().getFullYear()} Tenpaten Apply. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
