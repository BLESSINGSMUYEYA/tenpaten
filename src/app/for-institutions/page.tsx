'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowRight, BarChart2, MessageSquare, Users, ShieldCheck, Zap, Globe2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';
import Image from 'next/image';
import InstallPwaButton from '@/components/providers/InstallPwaButton';

// ─── Shared Nav ───────────────────────────────────────────────────────────────
function Nav() {
    const [open, setOpen] = useState(false);
    const links = [
        { href: '/for-students', label: 'For Students' },
        { href: '/for-institutions', label: 'For Institutions' },
        { href: '/scholarships', label: 'Scholarships' },
    ];
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 shadow-2xl">
            <div className="absolute inset-0 -z-10 bg-[#1a1b41]/95 backdrop-blur-xl" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 lg:h-24 flex items-center justify-between">
                <TenpatenLogo variant="white" />
                <div className="hidden md:flex items-center gap-10">
                    {links.map(l => (
                        <Link key={l.href} href={l.href}
                            className="text-[11px] uppercase tracking-[0.25em] font-black text-white/60 hover:text-brand-accent transition-all relative group">
                            {l.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:inline-flex px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-black text-white hover:text-brand-accent transition-all">Sign In</Link>
                    <Link href="mailto:partnerships@tenpaten.com" className="hidden sm:inline-flex px-8 py-3 bg-brand-accent text-[#1a1b41] rounded-xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-white transition-all active:scale-95">Partner With Us</Link>
                    <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 border border-white/10">
                        {open ? <X className="w-5 h-5 text-brand-accent" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            {open && (
                <div className="md:hidden bg-[#1a1b41] border-t border-white/5 px-6 py-10 space-y-2 rounded-b-[2.5rem]">
                    {links.map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                            className="flex px-6 py-4 rounded-2xl bg-white/5 hover:bg-brand-accent hover:text-[#1a1b41] text-sm font-black uppercase tracking-widest text-white/70 transition-all">
                            {l.label}
                        </Link>
                    ))}
                    <div className="pt-6 mt-4 border-t border-white/5">
                        <Link href="mailto:partnerships@tenpaten.com" className="flex items-center justify-center py-4 rounded-xl text-[10px] font-black text-[#1a1b41] bg-brand-accent uppercase tracking-widest">Partner With Us</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
    {
        icon: BarChart2,
        chip: 'REAL-TIME',
        title: 'Live Application Pipeline',
        body: 'Track every applicant from submission to decision in one dashboard. Filter by programme, status, or entry date. No spreadsheets.',
    },
    {
        icon: Users,
        chip: 'STUDENT REACH',
        title: 'Wider Recruitment Reach',
        body: 'Get discovered by qualified students from every district in Malawi — including rural communities you would otherwise never reach.',
    },
    {
        icon: MessageSquare,
        chip: 'SECURE CHANNEL',
        title: 'Direct Messaging',
        body: 'Communicate with applicants through a verified, monitored channel. No more unofficial WhatsApp groups or lost email threads.',
    },
    {
        icon: ShieldCheck,
        chip: 'VERIFIED',
        title: 'Document Verification',
        body: 'Applicants upload all required documents digitally. Your team reviews everything in one place — no physical submissions needed.',
    },
    {
        icon: Zap,
        chip: 'AI POWERED',
        title: 'Smart Applicant Insights',
        body: 'Surface top candidates automatically. Our platform highlights merit, compliance, and programme fit to speed up decision-making.',
    },
    {
        icon: Globe2,
        chip: 'ANALYTICS',
        title: 'Recruitment Analytics',
        body: 'Understand where your applicants come from, which programmes are in demand, and how your intake compares to previous years.',
    },
];

// ─── How it works ─────────────────────────────────────────────────────────────
const steps = [
    { n: '01', title: 'Contact our partnerships team', body: 'Reach out via email or the contact form below. We will schedule an onboarding call within 48 hours.' },
    { n: '02', title: 'We set up your institution', body: 'Our team configures your institution profile, uploads your programmes, and trains your admissions staff.' },
    { n: '03', title: 'Go live & start receiving applications', body: 'Your institution is published on the platform and students across Malawi can begin discovering and applying.' },
    { n: '04', title: 'Manage everything in one place', body: 'Review applications, communicate with candidates, and make decisions — all from your institutional dashboard.' },
];

// ─── Team ─────────────────────────────────────────────────────────────────────
const team = [
    {
        image: '/images/testimonials/blessings_user.jpg',
        name: 'Blessings Muyeya',
        role: 'Co-Founder & CEO',
        bio: 'Blessings built Tenpaten to democratise higher education access across Malawi — starting with removing the biggest barrier: geography.',
    },
    {
        image: '/images/testimonials/jairos_user.jpg',
        name: 'Jairos Phiri',
        role: 'Co-Founder & International Partnerships Director',
        bio: 'Jairos leads our institutional relationships and international strategy, ensuring every partner university gets a seamless, transparent experience.',
    },
    {
        image: '/images/testimonials/davie_user.jpg',
        name: 'Davie Chilembo',
        role: 'National Director',
        bio: 'Davie oversees national operations and institutional onboarding — connecting universities and students across all regions of Malawi.',
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ForInstitutionsPage() {
    return (
        <main className="min-h-screen font-sans selection:bg-brand-accent/30">
            <Nav />

            {/* ── Hero ── */}
            <section className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden bg-[#0f1030]">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-[#1a1b41] opacity-70 blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#2a1a60] opacity-50 blur-[130px]" />
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-brand-accent/25 bg-brand-accent/8 mb-10">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.35em]">For Institutions</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tighter mb-6">
                        Reach more students.<br />
                        <span className="text-brand-accent">Manage less paperwork.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }}
                        className="text-white/60 text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                        Tenpaten gives your institution a digital admissions pipeline — connecting you to qualified students across every district in Malawi.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="mailto:partnerships@tenpaten.com"
                            className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-brand-accent text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-xl shadow-brand-accent/20 active:scale-95">
                            Get in Touch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/school"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/15 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/8 transition-all active:scale-95">
                            Institutional Login
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Features Grid ── */}
            <section className="bg-slate-50 py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a1b41 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-brand-accent text-[10px] font-black tracking-[0.3em] uppercase">What We Provide</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter leading-[1.1]">
                            A full admissions suite.<br />
                            <span className="text-brand-accent">Built for Malawian institutions.</span>
                        </h2>
                        <p className="text-gray-500 font-medium text-lg mt-4 max-w-2xl mx-auto">
                            Everything your admissions team needs — from discovery to decision — in one managed platform.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="group bg-white border border-gray-100 rounded-[2rem] p-8 hover:border-brand-accent/30 hover:shadow-xl hover:shadow-brand-accent/5 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-accent/20 bg-brand-accent/8 text-[9px] font-black uppercase tracking-[0.25em] text-brand-accent mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                    {f.chip}
                                </div>
                                <div className="w-11 h-11 rounded-2xl bg-[#1a1b41]/5 flex items-center justify-center mb-4 group-hover:bg-[#1a1b41] transition-all duration-300">
                                    <f.icon className="w-5 h-5 text-[#1a1b41] group-hover:text-brand-accent transition-colors duration-300" />
                                </div>
                                <h3 className="text-[#1a1b41] font-black text-base uppercase tracking-tight leading-snug mb-3 group-hover:text-brand-accent transition-colors duration-300">{f.title}</h3>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">{f.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-[#1a1b41] py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-accent opacity-[0.04] blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-brand-accent text-[10px] font-black tracking-[0.3em] uppercase">Managed Onboarding</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 tracking-tighter leading-[1.1]">
                            Up and running in days.<br /><span className="text-brand-accent">Not months.</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-brand-accent/30 hover:bg-white/8 transition-all duration-500">
                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent font-black text-sm mb-6">
                                    {s.n}
                                </div>
                                <h3 className="text-white font-black text-base uppercase tracking-tight leading-snug mb-3">{s.title}</h3>
                                <p className="text-white/45 text-sm font-medium leading-relaxed">{s.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Our Team ── */}
            <section className="bg-slate-50 py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-accent text-[10px] font-black tracking-[0.3em] uppercase">The People Behind It</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter leading-[1.1]">
                            Our Team
                        </h2>
                        <p className="text-gray-500 font-medium text-lg mt-4 max-w-xl mx-auto">
                            Built by Malawians, for Malawians — with a commitment to education access at every level.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {team.map((member, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                                className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-brand-accent/30 hover:shadow-xl hover:shadow-brand-accent/5 transition-all duration-500 relative">
                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-linear-to-r from-transparent via-brand-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {/* Avatar header */}
                                <div className="bg-[#1a1b41] px-8 py-10 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-[1.25rem] overflow-hidden bg-brand-accent/15 border-2 border-brand-accent/30 flex items-center justify-center text-brand-accent text-2xl font-black mb-4 group-hover:border-brand-accent/60 transition-all duration-300 relative">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <p className="text-white font-black text-lg uppercase tracking-tight leading-none">{member.name}</p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                        <p className="text-brand-accent text-[9px] font-black uppercase tracking-[0.25em] leading-snug text-center">{member.role}</p>
                                    </div>
                                </div>
                                {/* Bio */}
                                <div className="p-8">
                                    <div className="text-brand-accent/20 text-4xl font-serif leading-none mb-3 group-hover:text-brand-accent/40 transition-colors">&ldquo;</div>
                                    <p className="text-gray-500 font-medium text-sm leading-relaxed">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact CTA ── */}
            <section className="bg-[#0f1030] py-24 lg:py-32 relative overflow-hidden text-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-accent opacity-[0.05] blur-[120px]" />
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                </div>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-brand-accent/25 bg-brand-accent/8 mb-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                            <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.35em]">Partner With Us</span>
                        </div>
                        <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6">
                            Ready to modernise<br />your admissions?
                        </h2>
                        <p className="text-white/55 text-xl font-medium mb-12">
                            Our partnerships team will have your institution live on the platform within days.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="mailto:partnerships@tenpaten.com"
                                className="group inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-brand-accent text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-2xl shadow-brand-accent/20 active:scale-95">
                                <Mail className="w-4 h-4" /> Contact Our Team
                            </Link>
                            <Link href="/school"
                                className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl border border-white/15 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/8 transition-all active:scale-95">
                                Institutional Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#0f1030] border-t border-white/5 py-12 flex flex-col items-center gap-4 text-center">
                <InstallPwaButton />
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                    &copy; {new Date().getFullYear()} Tenpaten Apply. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
