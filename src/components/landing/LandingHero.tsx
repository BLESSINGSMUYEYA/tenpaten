'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function LandingHero() {
    return (
        <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center overflow-hidden selection:bg-[#d5a22d]/30 text-center">
            {/* ── Background ── */}
            <div className="absolute inset-0 z-0">
                {/* Base Dark Color */}
                <div className="absolute inset-0 bg-[#0f1030]" />
                
                {/* Background Image - Premium African students theme */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/images/hero/hero-premium.png"
                        alt="Malawian students celebrating"
                        fill
                        priority
                        className="object-cover"
                    />
                </motion.div>

                {/* Overlays to darken the image for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1030] via-[#0f1030]/80 to-transparent z-10 hidden lg:block" />
                <div className="absolute inset-0 bg-[#0f1030]/60 mix-blend-multiply z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0f1030]/50 via-transparent to-[#0f1030] z-10" />

                {/* Dot grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.1] z-20"
                    style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
                />
                
                {/* Subtle light leak */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#d5a22d] opacity-[0.05] blur-[120px] z-20" />
            </div>

            <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-24 flex flex-col items-center lg:items-start lg:text-left">
                <div className="max-w-3xl">
                    {/* ── Trust badge ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#d5a22d]/25 bg-[#d5a22d]/10 mb-8 backdrop-blur-md"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#d5a22d] animate-pulse" />
                        <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">
                            Proudly Malawian — Applications Open
                        </span>
                    </motion.div>

                    {/* ── Headline ── */}
                    <motion.h1
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black text-white leading-[1.05] tracking-tighter mb-8"
                    >
                        Your one-stop platform<br />
                        <span className="text-[#d5a22d]">for university</span> applications.
                    </motion.h1>

                    {/* ── Sub ── */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25 }}
                        className="text-white/70 text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mb-12"
                    >
                        Get matched. Apply directly. Track your progress.<br className="hidden sm:block" />
                        <span className="text-white font-black border-b-2 border-[#d5a22d]/50 pb-0.5">All in one place.</span>
                    </motion.p>

                    {/* ── CTAs ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center gap-5"
                    >
                        <Link
                            href="/register?type=student"
                            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-[0_20px_40px_-15px_rgba(213,162,45,0.3)] active:scale-95 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Get Started — It's Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
                        >
                            Sign In
                        </Link>
                    </motion.div>

                    {/* ── Social proof micro row ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.65 }}
                        className="mt-16 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-white/40"
                    >
                        {/* Avatar stack */}
                        <div className="flex -space-x-3">
                            {['BM', 'TK', 'AM', 'SC'].map((initials, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1b41] to-[#2a2b60] border-2 border-[#0f1030] flex items-center justify-center text-[10px] font-black text-[#d5a22d] shadow-xl"
                                >
                                    {initials}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em]">
                                <span className="text-white">Trusted by students</span> across Malawi
                            </p>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className="w-1.5 h-1.5 rounded-full bg-[#d5a22d]" />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Bottom scroll indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 z-20"
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/10 flex items-start justify-center pt-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1 h-2 rounded-full bg-[#d5a22d]"
                    />
                </div>
            </motion.div>
        </section>
    );
}
