'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function FinalCTABanner() {
    return (
        <section className="bg-[#0f1030] py-24 lg:py-32 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d5a22d] opacity-[0.05] blur-[120px]" />
                <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1a1b41] opacity-80 blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#2a1a60] opacity-60 blur-[100px]" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#d5a22d]/25 bg-[#d5a22d]/8 mb-10"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d5a22d] animate-pulse" />
                    <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">
                        Yes, you read that right
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6"
                >
                    Ready to apply?
                </motion.h2>

                {/* Sub */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-white/55 text-xl font-medium leading-relaxed mb-12 max-w-xl mx-auto"
                >
                    Join thousands of Malawian students already on the platform.{' '}
                    <span className="text-white/80 font-bold">It&apos;s completely free.</span>
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/register?type=student"
                        className="group inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-2xl shadow-[#d5a22d]/20 active:scale-95"
                    >
                        Create Free Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/schools"
                        className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl border border-white/15 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/8 hover:border-white/30 transition-all active:scale-95"
                    >
                        I&apos;m an Institution
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
