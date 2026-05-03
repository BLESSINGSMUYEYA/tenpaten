'use client';

import { GraduationCap, Award, ShieldCheck, Zap, Globe2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Pillars = [
    {
        icon: Globe2,
        label: 'Global Reach',
        sub: 'Universities across every continent',
    },
    {
        icon: GraduationCap,
        label: 'Direct Admissions',
        sub: 'Apply straight to accredited institutions',
    },
    {
        icon: Award,
        label: 'Scholarship Access',
        sub: 'Funding opportunities at every level',
    },
    {
        icon: ShieldCheck,
        label: 'Verified Programs',
        sub: 'Every partner institution is pre-vetted',
    },
    {
        icon: Zap,
        label: 'Fast-Track Process',
        sub: 'Streamlined from application to acceptance',
    },
    {
        icon: Clock,
        label: '24/7 Support',
        sub: 'Smart Help available at every step',
    },
];

export function StatsBar() {
    return (
        <section className="bg-[#1a1b41] py-16 relative overflow-hidden border-y border-white/5">
            {/* Dot grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d5a22d]/30 bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d5a22d] animate-pulse" />
                        Premium Platform Benefits
                    </span>
                    <h2 className="mt-4 text-white font-black text-3xl sm:text-4xl tracking-tighter uppercase leading-[0.9]">
                        Everything You Need,{' '}
                        <span className="text-[#d5a22d]">In One Place</span>
                    </h2>
                </div>

                {/* Pillars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
                    {Pillars.map((pillar, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="group flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-[#d5a22d]/30 transition-all duration-500 cursor-default"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#d5a22d]/10 flex items-center justify-center mb-4 group-hover:bg-[#d5a22d] transition-all duration-300">
                                <pillar.icon className="w-5 h-5 text-[#d5a22d] group-hover:text-[#1a1b41] transition-colors duration-300" />
                            </div>
                            <p className="text-white font-black text-xs uppercase tracking-[0.15em] leading-tight mb-1">
                                {pillar.label}
                            </p>
                            <p className="text-white/40 text-[10px] font-medium leading-snug">
                                {pillar.sub}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
