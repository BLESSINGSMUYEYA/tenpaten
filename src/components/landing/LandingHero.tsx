'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingHero() {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden selection:bg-[#d5a22d]/30 text-center">
            {/* ── Background ── */}
            <div className="absolute inset-0 z-0">
                {/* Base Dark Color */}
                <div className="absolute inset-0 bg-[#0f1030]" />
                
                {/* Background Image - African students/graduation theme */}
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2070"
                    alt="African secondary school students in a classroom"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlays to darken the image for text readability */}
                <div className="absolute inset-0 bg-[#0f1030]/60 mix-blend-multiply z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1030]/50 via-transparent to-[#0f1030] z-10" />

                {/* Dot grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.1] z-20"
                    style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
                />
                
                {/* Subtle light leak */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#d5a22d] opacity-[0.03] blur-[120px] z-20" />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 lg:pt-44 lg:pb-32 flex flex-col items-center">

                {/* ── Trust badge ── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#d5a22d]/25 bg-[#d5a22d]/8 mb-10"
                >
                    <span className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse shrink-0" />
                    <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">
                        Proudly Malawian — Applications Open
                    </span>
                </motion.div>

                {/* ── Headline ── */}
                <motion.h1
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.1 }}
                    className="text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-[3.25rem] font-black text-white leading-[1.1] tracking-tight mb-6 max-w-3xl"
                >
                    Your one-stop platform{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-[#d5a22d]">for university</span>
                        {/* Animated underline */}
                        <svg
                            className="absolute -bottom-1.5 left-0 w-full h-2 z-0"
                            viewBox="0 0 400 12"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.2, delay: 0.9, ease: 'easeOut' }}
                                d="M0,6 Q100,0 200,6 Q300,12 400,6"
                                fill="none"
                                stroke="#d5a22d"
                                strokeWidth="3"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                        </svg>
                    </span>{' '}
                    applications.
                </motion.h1>

                {/* ── Sub ── */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                    className="text-white/60 text-lg lg:text-xl font-medium leading-relaxed max-w-xl mb-12"
                >
                    Get matched. Apply directly. Track your progress.{' '}
                    <span className="text-white/90 font-bold">All in one place.</span>
                </motion.p>

                {/* ── CTAs ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link
                        href="/register?type=student"
                        className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-xl shadow-[#d5a22d]/20 active:scale-95"
                    >
                        Get Started — It&apos;s Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-white/15 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/8 hover:border-white/30 transition-all active:scale-95"
                    >
                        Sign In
                    </Link>
                </motion.div>

                {/* ── Social proof micro row ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.65 }}
                    className="mt-14 flex items-center gap-3 text-white/30"
                >
                    {/* Avatar stack */}
                    <div className="flex -space-x-2">
                        {['BM', 'TK', 'AM', 'SC'].map((initials, i) => (
                            <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a1b41] to-[#2a2b60] border-2 border-[#0f1030] flex items-center justify-center text-[8px] font-black text-[#d5a22d]"
                            >
                                {initials}
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest">
                        <span className="text-white/60">Trusted by students</span> across Malawi
                    </p>
                </motion.div>
            </div>

            {/* ── Bottom scroll indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
            >
                <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1 h-1.5 rounded-full bg-white/40"
                    />
                </div>
            </motion.div>
        </section>
    );
}
