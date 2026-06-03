'use client';

import { motion } from 'framer-motion';
import {
    Globe2, ShieldCheck, MessageSquare, BarChart2, BookOpen, Zap
} from 'lucide-react';

// Each card mirrors a real product screen from the dashboards
const BentoCards = [
    {
        id: 'pipeline',
        col: 'lg:col-span-2',
        chip: 'REAL-TIME',
        chipColor: 'bg-green-500/10 text-green-500 border-green-500/20',
        dotColor: 'bg-green-500',
        icon: BarChart2,
        title: 'Application Pipeline',
        sub: 'Track every applicant from submission to decision in a live dashboard. Reduce administrative workload with real-time applicant tracking.',
        preview: (
            <div className="mt-4 space-y-2">
                {[
                    { label: 'Draft', w: 'w-3/4', color: 'bg-brand-accent' },
                    { label: 'Under Review', w: 'w-1/2', color: 'bg-blue-400' },
                    { label: 'Accepted', w: 'w-1/4', color: 'bg-green-400' },
                ].map((bar, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40 w-20 shrink-0">{bar.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.2 }}
                                className={`h-full rounded-full ${bar.color} ${bar.w}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        ),
        dark: true,
    },
    {
        id: 'smarthelp',
        col: 'lg:col-span-1',
        chip: 'AI POWERED',
        chipColor: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
        dotColor: 'bg-brand-accent',
        icon: Zap,
        title: 'Smart Help',
        sub: 'Get instant answers about applications, programme requirements, and institutions across Malawi — with context-aware AI assistance.',
        preview: (
            <div className="mt-4 space-y-2">
                {['How do I start an application?', 'What documents are required?', 'Are there scholarships?'].map((q, i) => (
                    <div key={i} className="px-3 py-2 rounded-xl border border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-500">
                        {q}
                    </div>
                ))}
            </div>
        ),
        dark: false,
    },
    {
        id: 'browse',
        col: 'lg:col-span-1',
        chip: 'LIVE',
        chipColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        dotColor: 'bg-blue-500',
        icon: Globe2,
        title: 'Browse Universities',
        sub: 'Explore and compare programmes at accredited institutions across Malawi. Search by district, course, or institution type.',
        preview: (
            <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50">
                <Globe2 className="w-4 h-4 text-brand-accent" />
                <span className="text-gray-400 text-[10px] font-medium">Search programs or colleges...</span>
            </div>
        ),
        dark: false,
    },
    {
        id: 'messaging',
        col: 'lg:col-span-1',
        chip: 'SECURE CHANNEL',
        chipColor: 'bg-[#1a1b41]/5 text-[#1a1b41] border-[#1a1b41]/10',
        dotColor: 'bg-green-500',
        icon: MessageSquare,
        title: 'Direct Messaging',
        sub: 'Communicate safely with verified university admissions offices through our monitored secure channel — no WhatsApp, no uncertainty.',
        preview: (
            <div className="mt-4 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1a1b41] flex items-center justify-center text-[8px] text-white font-black shrink-0 mt-0.5">ID</div>
                <div>
                    <p className="text-[10px] font-black text-[#1a1b41]">IIT Delhi Admin</p>
                    <p className="text-[9px] text-gray-400">● Available Now</p>
                </div>
            </div>
        ),
        dark: false,
    },
    {
        id: 'documents',
        col: 'lg:col-span-2',
        chip: 'VERIFIED',
        chipColor: 'bg-green-500/10 text-green-500 border-green-500/20',
        dotColor: 'bg-green-500',
        icon: ShieldCheck,
        title: 'Unified Profile & Documents',
        sub: 'Apply from anywhere. Build one digital dossier — apply to multiple institutions without re-entering information or printing a single form.',
        preview: (
            <div className="mt-4 grid grid-cols-2 gap-2">
                {['Full Name', 'Email', 'Personal Information', 'Family Information'].map((field, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50">
                        <ShieldCheck className="w-3 h-3 text-green-500 shrink-0" />
                        <span className="text-[10px] font-bold text-gray-500">{field}</span>
                    </div>
                ))}
            </div>
        ),
        dark: false,
    },
];

export function FeaturesGrid() {
    return (
        <section id="features" className="py-20 lg:py-32 relative overflow-hidden bg-slate-50/50">
            <div
                className="absolute inset-0 opacity-[0.04] select-none pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '50px 50px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-brand-accent text-[10px] font-black tracking-[0.3em] uppercase">What We Do</span>
                    <h2 className="text-3xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter uppercase leading-[0.9]">
                        A Centralised Platform<br />
                        <span className="text-brand-accent">For Institutions & Students</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-base lg:text-lg mt-4 max-w-2xl mx-auto">
                        Tenpaten Apply provides a centralised platform serving both institutions and students — digital application management, wider recruitment reach, and real-time tracking.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 auto-rows-auto">
                    {BentoCards.map((card, i) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className={`${card.col} group relative rounded-[2rem] border overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${
                                card.dark
                                    ? 'bg-[#1a1b41] border-white/10 hover:border-brand-accent/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]'
                                    : 'bg-white border-gray-100 hover:border-brand-accent/30 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-24px_rgba(213,162,45,0.08)]'
                            }`}
                        >
                            {/* Gold top border on hover */}
                            <div className="absolute top-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="p-8 lg:p-10">
                                {/* Chip */}
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black tracking-[0.25em] uppercase mb-6 ${card.chipColor}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${card.dotColor}`} />
                                    {card.chip}
                                </div>

                                {/* Icon */}
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                                    card.dark ? 'bg-brand-accent/10' : 'bg-[#1a1b41]/5'
                                }`}>
                                    <card.icon className={`w-5 h-5 ${card.dark ? 'text-brand-accent' : 'text-[#1a1b41]'}`} />
                                </div>

                                {/* Title */}
                                <h3 className={`text-xl font-black uppercase tracking-tighter leading-none mb-2 ${
                                    card.dark ? 'text-white group-hover:text-brand-accent' : 'text-[#1a1b41] group-hover:text-brand-accent'
                                } transition-colors duration-300`}>
                                    {card.title}
                                </h3>

                                {/* Sub */}
                                <p className={`text-sm font-medium leading-relaxed ${card.dark ? 'text-white/50' : 'text-gray-400'}`}>
                                    {card.sub}
                                </p>

                                {/* Product preview snippet */}
                                {card.preview}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
