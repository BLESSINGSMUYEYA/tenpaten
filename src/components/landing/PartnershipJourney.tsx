'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ShieldCheck, LayoutDashboard, Globe2, ArrowRight } from 'lucide-react';

const Steps = [
    {
        number: '01',
        icon: MessageSquare,
        title: 'Consultation',
        desc: 'Connect with our sales team to discuss your recruitment targets and institutional requirements.',
        chip: 'SALES LED',
        chipColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
        number: '02',
        icon: ShieldCheck,
        title: 'Verification',
        desc: 'Our compliance team verifies your credentials to ensure the highest standard of global partnership.',
        chip: 'COMPLIANCE',
        chipColor: 'bg-green-500/10 text-green-400 border-green-500/20',
    },
    {
        number: '03',
        icon: LayoutDashboard,
        title: 'Managed Setup',
        desc: 'Our team configures your branding, programs, and admission criteria for you — zero tech overhead.',
        chip: 'WHITE GLOVE',
        chipColor: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
    },
    {
        number: '04',
        icon: Globe2,
        title: 'Global Launch',
        desc: 'Go live on the Tenpaten ecosystem and start receiving pre-vetted international leads.',
        chip: 'LIVE',
        chipColor: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
    },
];

interface PartnershipJourneyProps {
    /** Set to true to show on a white background (for main landing page),
     *  false/undefined for the navy school page background. */
    light?: boolean;
}

export function PartnershipJourney({ light = false }: PartnershipJourneyProps) {
    return (
        <section
            id="partnership-journey"
            className={`py-20 lg:py-32 relative overflow-hidden ${
                light ? 'bg-white' : 'bg-[#1a1b41]'
            }`}
        >
            {/* Dot grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: light
                        ? 'radial-gradient(#1a1b41 1px, transparent 1px)'
                        : 'radial-gradient(#d5a22d 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    opacity: light ? 0.025 : 0.04,
                }}
            />
            {/* Gold orb */}
            <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-brand-accent opacity-[0.04] blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-20">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black tracking-[0.3em] uppercase mb-5 ${
                        light
                            ? 'border-brand-accent/30 bg-brand-accent/10 text-brand-accent'
                            : 'border-brand-accent/30 bg-brand-accent/10 text-brand-accent'
                    }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        The Roadmap
                    </div>
                    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-4 ${
                        light ? 'text-[#1a1b41]' : 'text-white'
                    }`}>
                        Connect With Our<br />
                        <span className="text-brand-accent">Partnerships Team</span>
                    </h2>
                    <p className={`font-bold text-base lg:text-lg max-w-2xl mx-auto leading-relaxed ${
                        light ? 'text-gray-500' : 'text-white/50'
                    }`}>
                        Our institutional engagement follows a structured, relationship-first approach — from your first conversation to going live on the Tenpaten network.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-[1px] bg-linear-to-r from-transparent via-brand-accent/30 to-transparent z-0" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {Steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative z-10 group"
                            >
                                <div className={`rounded-[2rem] border p-8 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 ${
                                    light
                                        ? 'bg-white border-gray-100 hover:border-brand-accent/30 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_48px_80px_-24px_rgba(213,162,45,0.1)]'
                                        : 'bg-white/5 border-white/10 hover:border-brand-accent/30 hover:bg-white/8'
                                }`}>
                                    {/* Gold top border accent on hover */}
                                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                                    {/* Step number circle */}
                                    <div className="relative w-14 h-14 mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:bg-brand-accent group-hover:border-brand-accent ${
                                            light
                                                ? 'bg-gray-50 border-gray-100'
                                                : 'bg-white/5 border-white/10'
                                        }`}>
                                            <step.icon className={`w-6 h-6 transition-colors duration-300 group-hover:text-[#1a1b41] ${
                                                light ? 'text-brand-accent' : 'text-brand-accent'
                                            }`} />
                                        </div>
                                        {/* Step number badge */}
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-accent flex items-center justify-center">
                                            <span className="text-[9px] font-black text-[#1a1b41]">{step.number}</span>
                                        </div>
                                    </div>

                                    {/* Status chip */}
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-black tracking-[0.2em] uppercase mb-4 w-fit ${step.chipColor}`}>
                                        <span className="w-1 h-1 rounded-full bg-current" />
                                        {step.chip}
                                    </div>

                                    <h3 className={`text-lg font-black uppercase tracking-tighter leading-none mb-3 transition-colors duration-300 group-hover:text-brand-accent ${
                                        light ? 'text-[#1a1b41]' : 'text-white'
                                    }`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-sm font-medium leading-relaxed flex-1 ${
                                        light ? 'text-gray-500' : 'text-white/50'
                                    }`}>
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 lg:mt-20 text-center">
                    <Link
                        href="mailto:sales@tenpaten.com"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-brand-accent text-[#1a1b41] font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl shadow-brand-accent/20 active:scale-95 group"
                    >
                        Inquire for Partnership
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.25em] ${
                        light ? 'text-gray-400' : 'text-white/30'
                    }`}>
                        Be part of Malawi&apos;s digital admissions future
                    </p>
                </div>
            </div>
        </section>
    );
}
