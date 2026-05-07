'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function FinalCTABanner() {
    return (
        <section className="bg-[#0f1030] py-28 lg:py-40 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/cta/cta-banner.png"
                    alt="Educational background"
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1030] via-[#0f1030]/80 to-[#0f1030]" />
            </div>

            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#d5a22d] opacity-[0.08] blur-[140px]" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-[#d5a22d]/25 bg-[#d5a22d]/10 mb-12 backdrop-blur-md"
                >
                    <Sparkles className="w-4 h-4 text-[#d5a22d] animate-pulse" />
                    <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.4em]">
                        Yes, you read that right
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8"
                >
                    Your Future<br />
                    <span className="text-[#d5a22d]">Starts Today.</span>
                </motion.h2>

                {/* Sub */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-white/60 text-lg lg:text-xl font-medium leading-relaxed mb-12 max-w-xl mx-auto"
                >
                    Join thousands of Malawian students already on the platform.{' '}
                    <span className="text-[#d5a22d] font-black">It&apos;s completely free.</span>
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link
                        href="/register?type=student"
                        className="group relative inline-flex items-center justify-center gap-3 px-14 py-6 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-[0_20px_50px_-15px_rgba(213,162,45,0.4)] active:scale-95 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Create Free Account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Link>
                    <Link
                        href="/schools"
                        className="inline-flex items-center justify-center gap-3 px-10 py-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/10 hover:border-white/30 transition-all active:scale-95"
                    >
                        I&apos;m an Institution
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
