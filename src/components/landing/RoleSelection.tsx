'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Building2, CheckCircle, BarChart2, Users2 } from 'lucide-react';

export function RoleSelection() {
    return (
        <section id="roles" className="py-20 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">Tailored Experiences</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter uppercase leading-[0.9]">
                        Choose Your Path
                    </h2>
                    <p className="text-gray-500 font-bold text-base lg:text-lg mt-4 max-w-xl mx-auto">
                        Whether you&apos;re a secondary school leaver chasing a dream or an institution seeking to modernise admissions — Tenpaten Apply is built for you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* ── STUDENT PANEL (3/5 width, navy) ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-3 group relative rounded-[2.5rem] overflow-hidden bg-[#1a1b41] min-h-[500px] flex flex-col shadow-[0_48px_80px_-24px_rgba(26,27,65,0.25)] border border-white/5"
                    >
                        {/* Background image with overlay */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/images/landing/students-collaboration.png"
                                alt="Students collaborating"
                                fill
                                className="object-cover object-center opacity-20 transition-transform duration-1000 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 60vw"
                            />
                            {/* Left-to-right gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b41] via-[#1a1b41]/80 to-transparent" />
                            {/* Gold dot grid */}
                            <div
                                className="absolute inset-0 opacity-[0.04]"
                                style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                            />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col flex-1 p-8 lg:p-12">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d5a22d]/30 bg-[#d5a22d]/10 w-fit mb-auto">
                                <GraduationCap className="w-3 h-3 text-[#d5a22d]" />
                                <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">For Students</span>
                            </div>

                            {/* Mini dashboard preview */}
                            <div className="my-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 space-y-3">
                                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">My Journey — Active Applications</p>
                                {[
                                    { label: 'M.Tech in Computer Science', uni: 'IIT Delhi', status: 'DRAFT' },
                                    { label: 'B.Tech in Engineering', uni: 'IIT Bombay', status: 'UNDER REVIEW' },
                                ].map((app, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
                                        <div className="w-7 h-7 rounded-lg bg-[#d5a22d]/20 flex items-center justify-center shrink-0">
                                            <GraduationCap className="w-3.5 h-3.5 text-[#d5a22d]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-[10px] font-black truncate">{app.label}</p>
                                            <p className="text-white/40 text-[9px]">{app.uni}</p>
                                        </div>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                            app.status === 'DRAFT'
                                                ? 'border-[#d5a22d]/40 text-[#d5a22d]'
                                                : 'border-blue-400/40 text-blue-400'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 pt-1">
                                    <div className="h-1.5 flex-1 rounded-full bg-white/10">
                                        <div className="h-full w-[86%] rounded-full bg-[#d5a22d]" />
                                    </div>
                                    <span className="text-[#d5a22d] text-[9px] font-black">86% Profile</span>
                                </div>
                            </div>

                            {/* Main copy */}
                            <div>
                                <h3 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4">
                                    Malawi Has Talent.<br />
                                    <span className="text-[#d5a22d]">We Find It a Home.</span>
                                </h3>
                                <p className="text-white/60 font-medium mb-8 max-w-md leading-relaxed">
                                    Secondary school leavers across every district of Malawi deserve access to higher education. Apply from anywhere — no travel, no printed forms, no barriers.
                                </p>

                                {/* Checklist */}
                                <div className="grid grid-cols-2 gap-2 mb-8">
                                    {['Apply from anywhere', 'Browse & compare programmes', 'Real-time status tracking', 'No printed forms'].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-white/60 text-xs font-bold">
                                            <CheckCircle className="w-3.5 h-3.5 text-[#d5a22d] shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/register?type=student"
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-lg shadow-[#d5a22d]/20 active:scale-95 group/btn"
                                >
                                    Start Your Journey
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── RIGHT COLUMN (2/5 width) ── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* INSTITUTION PANEL */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="group relative flex-1 rounded-[2.5rem] overflow-hidden bg-[#d5a22d] p-8 lg:p-10 flex flex-col shadow-[0_32px_64px_-16px_rgba(213,162,45,0.3)] border border-[#d5a22d]/30 min-h-[250px]"
                        >
                            {/* Background texture */}
                            <div
                                className="absolute inset-0 opacity-[0.08]"
                                style={{ backgroundImage: 'radial-gradient(#1a1b41 1px, transparent 1px)', backgroundSize: '32px 32px' }}
                            />

                            <div className="relative z-10 flex flex-col flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1a1b41]/20 bg-[#1a1b41]/10 w-fit mb-6">
                                    <Building2 className="w-3 h-3 text-[#1a1b41]" />
                                    <span className="text-[#1a1b41] text-[10px] font-black tracking-[0.3em] uppercase">For Institutions</span>
                                </div>

                                {/* Mini financial card */}
                                <div className="bg-[#1a1b41] rounded-2xl p-4 mb-6 border border-white/10">
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-2">School Dashboard</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { label: 'Applications', icon: Users2, chip: '+12% GROWTH' },
                                            { label: 'Analytics', icon: BarChart2, chip: 'REAL-TIME' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                <item.icon className="w-4 h-4 text-[#d5a22d] mb-1.5" />
                                                <p className="text-white text-[10px] font-black">{item.label}</p>
                                                <span className="text-[8px] font-black text-[#d5a22d] uppercase">{item.chip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <h3 className="text-2xl lg:text-3xl font-black text-[#1a1b41] uppercase tracking-tighter leading-[0.9] mb-3">
                                    Modernise Your<br />Admissions
                                </h3>
                                <p className="text-[#1a1b41]/70 font-bold text-sm mb-6 leading-relaxed flex-1">
                                    We build and manage the digital infrastructure. You focus on delivering quality education. Reach a wider, more diverse student body across Malawi.
                                </p>
                                <Link
                                    href="/school"
                                    className="inline-flex items-center gap-2 text-[#1a1b41] font-black uppercase tracking-[0.25em] text-[10px] hover:gap-4 transition-all group/btn"
                                >
                                    Partnership Details
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        {/* PARTNERS PANEL */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="group rounded-[2.5rem] border border-gray-100 bg-white p-8 lg:p-10 flex flex-col shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.08)] hover:border-[#d5a22d]/20 transition-all duration-500"
                        >
                            {/* Gold top border on hover */}
                            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d5a22d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-[#1a1b41] transition-all duration-300">
                                    <Users2 className="w-5 h-5 text-[#d5a22d]" />
                                </div>
                                <h3 className="text-xl font-black text-[#1a1b41] uppercase tracking-tighter leading-none">Partners &amp; Agents</h3>
                            </div>
                            <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6 flex-1">
                                Join as a registered counsellor or recruitment agent. Help secondary school leavers across Malawi access higher education while growing your practice.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-[#d5a22d] font-black uppercase tracking-[0.25em] text-[10px] hover:text-[#1a1b41] transition-colors group/btn"
                            >
                                Get in Touch
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
