'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, GraduationCap, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

// Mini product preview card — mirrors "YOUR FUTURE STARTS HERE" dashboard banner
function DashboardPreviewCard() {
    return (
        <div className="relative w-full max-w-md select-none">
            {/* Main card — mirrors student dashboard */}
            <div className="rounded-[2rem] overflow-hidden shadow-[0_48px_80px_-24px_rgba(0,0,0,0.4)] border border-white/10">
                {/* Top bar */}
                <div className="bg-[#1a1b41] px-5 py-3 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Search className="w-3 h-3 text-white/40" />
                        <span className="text-white/40 text-[10px] font-medium">Search programs or colleges...</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#d5a22d]/20 border border-[#d5a22d]/30 flex items-center justify-center">
                        <span className="text-[#d5a22d] text-[9px] font-black">TP</span>
                    </div>
                </div>

                {/* Hero banner — "YOUR FUTURE STARTS HERE" */}
                <div className="relative h-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1a1b41] via-[#2a2b5f] to-[#1a1b41]" />
                    <div className="absolute inset-0 bg-[url('/images/hero/hero1.png')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 flex items-center px-6">
                        <div>
                            <p className="text-[#d5a22d] text-[9px] font-black tracking-[0.3em] uppercase mb-1">Good Morning</p>
                            <p className="text-white font-black text-xl uppercase leading-none tracking-tight">Your Future</p>
                            <p className="text-white font-black text-xl uppercase leading-none tracking-tight">Starts Here</p>
                        </div>
                        <div className="ml-auto px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-white text-[8px] font-black uppercase tracking-widest">Portal Ready</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application cards row */}
                <div className="bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[#1a1b41] text-[10px] font-black uppercase tracking-[0.2em]">Active Applications</p>
                        <span className="text-[#d5a22d] text-[9px] font-black uppercase tracking-widest">View All →</span>
                    </div>
                    {[
                        { program: 'M.Tech in Computer Science', uni: 'IIT Delhi', status: 'DRAFT' },
                        { program: 'B.Tech in Engineering', uni: 'IIT Bombay', status: 'DRAFT' },
                    ].map((app, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                            <div className="w-8 h-8 rounded-lg bg-[#1a1b41] flex items-center justify-center shrink-0">
                                <GraduationCap className="w-4 h-4 text-[#d5a22d]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[#1a1b41] text-[10px] font-black truncate">{app.program}</p>
                                <p className="text-gray-400 text-[9px] font-medium">{app.uni}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full border border-[#d5a22d]/30 text-[#d5a22d] text-[8px] font-black uppercase">
                                {app.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating benefit chips */}
            <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-10 top-1/3 bg-white rounded-2xl px-4 py-3 shadow-2xl border border-gray-100 flex items-center gap-3"
            >
                <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div>
                    <p className="text-[#1a1b41] text-[10px] font-black uppercase tracking-wide">Application Sent</p>
                    <p className="text-gray-400 text-[9px]">IIT Delhi • Just now</p>
                </div>
            </motion.div>

            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-6 bottom-1/4 bg-[#1a1b41] rounded-2xl px-4 py-3 shadow-2xl border border-white/10 flex items-center gap-3"
            >
                <div className="w-8 h-8 rounded-xl bg-[#d5a22d]/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-[#d5a22d]" />
                </div>
                <div>
                    <p className="text-white text-[10px] font-black uppercase tracking-wide">Under Review</p>
                    <p className="text-white/40 text-[9px]">IIT Bombay</p>
                </div>
            </motion.div>

            <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-4 top-8 bg-[#d5a22d] rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-2"
            >
                <BookOpen className="w-4 h-4 text-[#1a1b41]" />
                <p className="text-[#1a1b41] text-[10px] font-black uppercase tracking-wide">Profile 86% Complete</p>
            </motion.div>
        </div>
    );
}

export function LandingHero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const encodedQuery = encodeURIComponent(searchQuery);
            const callbackUrl = encodeURIComponent(`/dashboard/colleges?q=${encodedQuery}`);
            router.push(`/register?type=student&callbackUrl=${callbackUrl}`);
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden selection:bg-[#d5a22d]/30">
            {/* Gradient mesh background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#0f1030]" />
                {/* Animated gradient orbs */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1a1b41] opacity-80 blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#2a1a60] opacity-60 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#d5a22d] opacity-[0.04] blur-[80px]" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-40 lg:pb-32">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* ── LEFT: Text Content ── */}
                    <div className="flex flex-col">
                        {/* Live status badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#d5a22d]/30 bg-[#d5a22d]/10 w-fit mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
                            <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">
                                Proudly Malawian — Applications Open
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl sm:text-6xl lg:text-[5rem] font-black text-white leading-[0.9] tracking-tighter uppercase mb-6"
                        >
                            Your Future<br />
                            <span className="relative">
                                <span className="relative z-10 text-[#d5a22d]">Starts</span>
                                {' '}
                                <span className="relative z-10">Here.</span>
                                {/* SVG underline */}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full h-3 z-0"
                                    viewBox="0 0 300 12"
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                >
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                                        d="M0,6 Q75,0 150,6 Q225,12 300,6"
                                        fill="none"
                                        stroke="#d5a22d"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        opacity="0.5"
                                    />
                                </svg>
                            </span>
                        </motion.h1>

                        {/* Subheading */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.25 }}
                            className="text-white/70 text-lg lg:text-xl font-medium leading-relaxed max-w-lg mb-10"
                        >
                            Simplifying university admissions for every student in Malawi.
                        </motion.p>

                        {/* Search bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mb-8"
                        >
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 focus-within:border-[#d5a22d]/60 focus-within:bg-white/15 transition-all">
                                    <Search className="w-5 h-5 text-white/40 ml-4 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search universities or programmes in Malawi..."
                                        className="w-full bg-transparent text-white placeholder:text-white/40 px-3 py-4 outline-none text-sm font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#d5a22d] text-[#1a1b41] px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-lg shadow-[#d5a22d]/20 active:scale-95 shrink-0"
                                >
                                    Search <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>

                        {/* Tag chips */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.55 }}
                            className="flex flex-wrap gap-2"
                        >
                            {['Lilongwe', 'Blantyre', 'Engineering', 'Medicine', 'Scholarships'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    type="button"
                                    className="px-4 py-2 rounded-full border border-white/15 text-white/70 text-xs font-bold hover:border-[#d5a22d]/50 hover:text-[#d5a22d] hover:bg-[#d5a22d]/10 transition-all"
                                >
                                    {tag}
                                </button>
                            ))}
                        </motion.div>

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.65 }}
                            className="flex flex-col sm:flex-row gap-4 mt-10"
                        >
                            <Link
                                href="/register?type=student"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-lg shadow-[#d5a22d]/20 active:scale-95"
                            >
                                Start Your Journey <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/15 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
                            >
                                Sign In
                            </Link>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: Product Preview ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="hidden lg:flex items-center justify-center pl-8"
                    >
                        <DashboardPreviewCard />
                    </motion.div>
                </div>
            </div>

            {/* Bottom marquee strip */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-black/20 backdrop-blur-sm border-t border-white/10 py-5 z-20">
                <div
                    className="flex w-max whitespace-nowrap items-center text-white/40 text-[10px] font-black uppercase tracking-[0.3em] gap-20"
                    style={{ animation: 'marquee 25s linear infinite' }}
                >
                    {Array(4).fill(['Scholarships Available', 'Fast-Track Admissions', 'Global Reach', 'Verified Programs', 'Secure Process', 'Direct Admissions']).flat().map((t, i) => (
                        <span key={i}>{t}</span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
