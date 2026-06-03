'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe2, Users2, ArrowRight, BarChart2, DollarSign, ClipboardList } from 'lucide-react';

const Tabs = [
    {
        id: 'admissions',
        label: 'Admissions',
        icon: ClipboardList,
        chip: 'LIVE PIPELINE',
        chipColor: 'bg-green-500/10 text-green-500 border-green-500/20',
        dotColor: 'bg-green-500',
        headline: 'Managed Admissions Pipeline',
        sub: 'Review, filter, and decide on applications from pre-vetted international students — all from one command center.',
        bullets: ['Application queue management', 'One-click status updates', 'Bulk accept / reject actions', 'Automated student notifications'],
        preview: (
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
                <div className="bg-[#1a1b41] px-4 py-3 flex items-center justify-between">
                    <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Applications</span>
                    <span className="text-white/40 text-[9px]">REAL-TIME</span>
                </div>
                <div className="bg-white p-3 space-y-2">
                    {[
                        { name: 'Blessings Muyeya', prog: 'B.Tech Computer Science', status: 'SUCCESS', statusColor: 'text-green-500 bg-green-50 border-green-200' },
                        { name: 'Test Prospect', prog: 'M.Tech Engineering', status: 'PENDING', statusColor: 'text-brand-accent bg-brand-accent/5 border-brand-accent/20' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl border border-gray-50 bg-gray-50/50">
                            <div className="w-6 h-6 rounded-full bg-[#1a1b41] flex items-center justify-center text-[8px] text-white font-black shrink-0">
                                {row.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-[#1a1b41] truncate">{row.name}</p>
                                <p className="text-[9px] text-gray-400 truncate">{row.prog}</p>
                            </div>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${row.statusColor}`}>
                                {row.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart2,
        chip: 'REAL-TIME',
        chipColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        dotColor: 'bg-blue-500',
        headline: 'Performance Analytics',
        sub: 'Understand your yield rate, application pipeline health, and program popularity — all with live data.',
        bullets: ['Live yield rate tracking', 'Program popularity charts', 'Conversion funnel insights', 'Exportable reports'],
        preview: (
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
                <div className="bg-[#1a1b41] px-4 py-3 flex items-center justify-between">
                    <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Dashboard Overview</span>
                    <span className="text-white/40 text-[9px]">LIVE</span>
                </div>
                <div className="bg-white p-3 space-y-2">
                    {[
                        { label: 'Total Applications', chip: '+12% Growth', chipColor: 'text-green-500' },
                        { label: 'Outstanding Tasks', chip: 'Action Required', chipColor: 'text-red-500' },
                        { label: 'Yield Rate', chip: 'Market Average', chipColor: 'text-brand-accent' },
                    ].map((card, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                            <p className="text-[10px] font-black text-[#1a1b41] uppercase tracking-tight">{card.label}</p>
                            <span className={`text-[9px] font-black uppercase ${card.chipColor}`}>{card.chip}</span>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        id: 'finance',
        label: 'Finance',
        icon: DollarSign,
        chip: 'TRACKED',
        chipColor: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
        dotColor: 'bg-brand-accent',
        headline: 'Financial Ledger',
        sub: 'Track institutional revenue, application fees, platform charges, and withdrawal balances with full transparency.',
        bullets: ['Per-application fee tracking', 'Gross revenue & net receivable', 'CSV export for registry', 'Payout request management'],
        preview: (
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
                <div className="bg-[#1a1b41] px-4 py-3 flex items-center justify-between">
                    <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Financial Ledger</span>
                    <span className="text-white/40 text-[9px]">TRACKED</span>
                </div>
                <div className="bg-white p-3">
                    <div className="bg-[#1a1b41] rounded-xl p-3 mb-2">
                        <p className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-1">Available Balance</p>
                        <p className="text-white font-black text-lg">Total Receivable</p>
                        <p className="text-brand-accent text-[9px] font-black uppercase mt-1">+12.5% vs Prev Month</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                            <p className="text-[9px] font-black text-gray-400 uppercase">Gross Revenue</p>
                            <p className="text-[#1a1b41] text-xs font-black mt-0.5">Per Application</p>
                        </div>
                        <div className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                            <p className="text-[9px] font-black text-gray-400 uppercase">Service Fee</p>
                            <p className="text-brand-accent text-xs font-black mt-0.5">10% Platform</p>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
];

export function UniversitySection() {
    const [activeTab, setActiveTab] = useState('admissions');
    const active = Tabs.find((t) => t.id === activeTab)!;

    return (
        <section id="universities" className="py-20 lg:py-32 bg-slate-50/50 relative overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#1a1b41 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 text-brand-accent text-[10px] font-black tracking-[0.3em] mb-5 uppercase">
                        Partnership Opportunity
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1b41] tracking-tighter leading-[1.1] mb-4">
                        Your Digital<br />
                        <span className="text-brand-accent">Admissions Workspace</span>
                    </h2>
                    <p className="text-gray-500 font-bold text-base lg:text-lg max-w-2xl mx-auto">
                        Manage international recruitment end-to-end. Digital application management, wider student recruitment reach, reduced administrative workload — from one platform.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* LEFT: Tabs + copy */}
                    <div>
                        {/* Tab buttons */}
                        <div className="flex gap-2 p-1.5 rounded-2xl bg-gray-100 mb-10 w-fit">
                            {Tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'bg-[#1a1b41] text-white shadow-lg'
                                            : 'text-gray-400 hover:text-[#1a1b41]'
                                    }`}
                                >
                                    <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-brand-accent' : ''}`} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Status chip */}
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black tracking-[0.25em] uppercase mb-6 ${active.chipColor}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${active.dotColor}`} />
                                    {active.chip}
                                </div>

                                <h3 className="text-2xl lg:text-3xl font-black text-[#1a1b41] tracking-tighter leading-[1.1] mb-4">
                                    {active.headline}
                                </h3>
                                <p className="text-gray-500 font-bold leading-relaxed mb-8">
                                    {active.sub}
                                </p>

                                <ul className="space-y-3 mb-10">
                                    {active.bullets.map((b, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                            </div>
                                            {b}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/school"
                                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#1a1b41] text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-accent hover:text-[#1a1b41] transition-all shadow-xl shadow-[#1a1b41]/10 active:scale-95 group"
                                    >
                                        Apply for Partnership
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        href="mailto:sales@tenpaten.com"
                                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-gray-100 text-[#1a1b41] font-black uppercase tracking-[0.2em] text-xs hover:border-brand-accent/30 hover:bg-brand-accent/5 transition-all active:scale-95"
                                    >
                                        Contact Sales
                                    </Link>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: Product preview panel */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + '-preview'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            {/* Image */}
                            <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] group mb-6">
                                <Image
                                    src="/images/landing/university-hall.png"
                                    alt="University Dashboard"
                                    width={800}
                                    height={520}
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105 w-full"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#1a1b41]/60 to-transparent" />
                                {/* NOW OPEN badge */}
                                <div className="absolute bottom-6 left-6 bg-brand-accent px-6 py-4 rounded-2xl">
                                    <p className="text-[#1a1b41] font-black text-xl uppercase leading-none">Now<br />Open</p>
                                    <p className="text-[#1a1b41]/70 text-[9px] font-black uppercase tracking-[0.25em] mt-1">University Partnerships</p>
                                </div>
                            </div>

                            {/* Dashboard preview card */}
                            {active.preview}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
