'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowRight, CheckCircle, Globe2, FileText, MessageSquare, Award, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

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
                            className="text-[11px] uppercase tracking-[0.25em] font-black text-white/60 hover:text-[#d5a22d] transition-all relative group">
                            {l.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#d5a22d] transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:inline-flex px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-black text-white hover:text-[#d5a22d] transition-all">Sign In</Link>
                    <Link href="/register?type=student" className="hidden sm:inline-flex px-8 py-3 bg-[#d5a22d] text-[#1a1b41] rounded-xl text-[11px] uppercase tracking-[0.2em] font-black hover:bg-white transition-all active:scale-95">Get Started</Link>
                    <button onClick={() => setOpen(!open)} className="md:hidden p-2.5 rounded-xl text-white hover:bg-white/10 border border-white/10">
                        {open ? <X className="w-5 h-5 text-[#d5a22d]" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            {open && (
                <div className="md:hidden bg-[#1a1b41] border-t border-white/5 px-6 py-10 space-y-2 rounded-b-[2.5rem]">
                    {links.map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                            className="flex px-6 py-4 rounded-2xl bg-white/5 hover:bg-[#d5a22d] hover:text-[#1a1b41] text-sm font-black uppercase tracking-widest text-white/70 transition-all">
                            {l.label}
                        </Link>
                    ))}
                    <div className="pt-6 mt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                        <Link href="/login" className="flex items-center justify-center py-4 rounded-xl text-[10px] font-black text-white bg-white/5 uppercase tracking-widest">Sign In</Link>
                        <Link href="/register?type=student" className="flex items-center justify-center py-4 rounded-xl text-[10px] font-black text-[#1a1b41] bg-[#d5a22d] uppercase tracking-widest">Get Started</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

// ─── Steps data ───────────────────────────────────────────────────────────────
const steps = [
    { n: '01', title: 'Create your free account', body: 'Sign up in under 2 minutes — no payment, no paperwork. Just your name, email, and a password.' },
    { n: '02', title: 'Build your profile once', body: 'Enter your academic records and personal details once. We reuse them across every application automatically.' },
    { n: '03', title: 'Browse & apply to universities', body: 'Filter institutions by district, programme, or fee range. Apply to multiple schools with a single click.' },
    { n: '04', title: 'Track everything in real time', body: 'Watch your application move through each stage — Draft, Submitted, Under Review, Decision — all on one dashboard.' },
];

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
    {
        icon: Globe2,
        title: 'Nationwide University Browser',
        body: 'Browse and compare programmes at every accredited institution in Malawi. Filter by district, course, or intake year.',
    },
    {
        icon: FileText,
        title: 'One Profile, Many Applications',
        body: 'Fill in your details once and apply to as many universities as you want. No re-entering the same information.',
    },
    {
        icon: Award,
        title: 'Scholarship Discovery',
        body: 'We surface funding opportunities matched to your profile — bursaries, grants, and full scholarships you might never have found alone.',
    },
    {
        icon: MessageSquare,
        title: 'Verified Direct Messaging',
        body: 'Chat directly with verified admissions offices. No agents, no WhatsApp confusion — just clear, official communication.',
    },
    {
        icon: Search,
        title: 'Smart Application Guidance',
        body: 'Get step-by-step guidance on what documents to prepare, what each programme requires, and when deadlines fall.',
    },
    {
        icon: CheckCircle,
        title: 'Live Application Tracking',
        body: 'Real-time status updates on every application you submit. Know where you stand at every stage of the process.',
    },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
    { initials: 'CK', name: 'Chisomo Kamanga', school: 'Blantyre Secondary School', quote: 'I submitted to three institutions in one afternoon without leaving my house. Tenpaten changed everything for me.' },
    { initials: 'TN', name: 'Takondwa Nkhoma', school: 'Mzuzu Boys Secondary', quote: 'I actually spoke directly with the UNIMA admissions office. No agents, no confusion. I knew exactly where my application stood.' },
    { initials: 'AM', name: 'Alinafe Mwale', school: 'Lilongwe Girls Secondary', quote: 'I found a scholarship I didn\'t even know existed through Tenpaten. The platform surfaced it based on my profile. I got funding and a place at LUANAR.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ForStudentsPage() {
    return (
        <main className="min-h-screen font-sans selection:bg-[#d5a22d]/30">
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
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#d5a22d]/25 bg-[#d5a22d]/8 mb-10">
                        <span className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
                        <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">For Students</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tighter mb-6">
                        Apply to university.<br />
                        <span className="text-[#d5a22d]">From anywhere in Malawi.</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }}
                        className="text-white/60 text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                        No travel. No queues. No printing.<br />
                        <span className="text-white/85 font-bold">Just a free account and your MSCE results.</span>
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register?type=student"
                            className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-xl shadow-[#d5a22d]/20 active:scale-95">
                            Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/login"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/15 text-white font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white/8 transition-all active:scale-95">
                            Sign In
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="bg-slate-50 py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">Simple Process</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter leading-[1.1]">
                            Ready in 4 steps.
                        </h2>
                        <p className="text-gray-500 font-medium text-lg mt-4 max-w-xl mx-auto">
                            From sign-up to submitted application — faster than you think.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative bg-white border border-gray-100 rounded-[2rem] p-8 hover:border-[#d5a22d]/30 hover:shadow-xl hover:shadow-[#d5a22d]/5 transition-all duration-500">
                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d5a22d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="w-12 h-12 rounded-2xl bg-[#1a1b41] flex items-center justify-center text-[#d5a22d] font-black text-sm mb-6">
                                    {s.n}
                                </div>
                                <h3 className="text-[#1a1b41] font-black text-base uppercase tracking-tight leading-snug mb-3">{s.title}</h3>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">{s.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features Grid ── */}
            <section className="bg-[#1a1b41] py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">Everything You Need</span>
                        <h2 className="text-4xl lg:text-5xl font-black text-white mt-4 tracking-tighter leading-[1.1]">
                            And dozens of tools<br /><span className="text-[#d5a22d]">to get you where you need to be.</span>
                        </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                                className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-[#d5a22d]/30 hover:bg-white/8 transition-all duration-500 relative overflow-hidden">
                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d5a22d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="w-11 h-11 rounded-2xl bg-[#d5a22d]/10 flex items-center justify-center mb-5 group-hover:bg-[#d5a22d] transition-all duration-300">
                                    <f.icon className="w-5 h-5 text-[#d5a22d] group-hover:text-[#1a1b41] transition-colors duration-300" />
                                </div>
                                <h3 className="text-white font-black text-base uppercase tracking-tight leading-snug mb-3 group-hover:text-[#d5a22d] transition-colors duration-300">{f.title}</h3>
                                <p className="text-white/45 text-sm font-medium leading-relaxed">{f.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="bg-slate-50 py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">From Others Around Malawi</span>
                        <h2 className="text-4xl font-black text-[#1a1b41] mt-4 tracking-tighter uppercase leading-[0.9]">
                            Don&apos;t just take it from us.
                        </h2>
                        <p className="text-gray-500 font-medium text-lg mt-4">Real students. Real results.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                                className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-[#d5a22d]/30 hover:shadow-xl hover:shadow-[#d5a22d]/5 transition-all duration-500 relative">
                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d5a22d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="bg-[#1a1b41] px-6 py-4 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#d5a22d]/20 border border-[#d5a22d]/30 flex items-center justify-center text-[#d5a22d] text-[11px] font-black">{t.initials}</div>
                                    <div>
                                        <p className="text-white font-black text-sm">{t.name}</p>
                                        <p className="text-[#d5a22d] text-[9px] font-black uppercase tracking-[0.25em]">{t.school}</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="text-[#d5a22d]/20 text-5xl font-serif leading-none mb-2 group-hover:text-[#d5a22d]/40 transition-colors">&ldquo;</div>
                                    <p className="text-gray-500 font-medium text-sm leading-relaxed italic">{t.quote}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="bg-[#0f1030] py-24 lg:py-32 relative overflow-hidden text-center">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d5a22d] opacity-[0.05] blur-[120px]" />
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                </div>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#d5a22d]/25 bg-[#d5a22d]/8 mb-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d5a22d] animate-pulse" />
                            <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">Yes, you read that right</span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[1.1] mb-4">
                            It&apos;s completely free.
                        </h2>
                        <p className="text-white/55 text-lg font-medium mb-8">
                            Get the services of a professional admissions advisor — at zero cost.
                        </p>
                        <Link href="/register?type=student"
                            className="group inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-2xl shadow-[#d5a22d]/20 active:scale-95">
                            Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#0f1030] border-t border-white/5 py-10 text-center">
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
                    &copy; {new Date().getFullYear()} Tenpaten Apply. All rights reserved.
                </p>
            </footer>
        </main>
    );
}
