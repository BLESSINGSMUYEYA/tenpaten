'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe2, FileText, MessageSquare, ArrowRight } from 'lucide-react';

const features = [
    {
        id: 'match',
        eyebrow: 'THOUSANDS OF PROGRAMMES',
        headline: 'Find universities that fit. Zero guesswork.',
        body: 'Browse accredited institutions from every district in Malawi — compare programmes, entry requirements, and tuition fees in seconds. No more travelling district-to-district just to get a prospectus.',
        icon: Globe2,
        visual: (
            <div className="w-full space-y-3">
                {[
                    { name: 'University of Malawi', prog: 'B.Sc. Computer Science', match: '98%' },
                    { name: 'Mzuzu University', prog: 'B.Eng. Electrical Engineering', match: '91%' },
                    { name: 'LUANAR', prog: 'B.Sc. Agriculture', match: '85%' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.12 }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#1a1b41] flex items-center justify-center shrink-0">
                            <Globe2 className="w-5 h-5 text-[#d5a22d]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[#1a1b41] text-xs font-black uppercase tracking-wide truncate">{item.name}</p>
                            <p className="text-gray-400 text-[11px] font-medium truncate">{item.prog}</p>
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-[#d5a22d]/10 border border-[#d5a22d]/20">
                            <span className="text-[#d5a22d] text-[10px] font-black">{item.match}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        ),
        dark: false,
        flip: false,
    },
    {
        id: 'apply',
        eyebrow: 'DIGITAL APPLICATIONS',
        headline: "Applications that don't require a bus ride.",
        body: 'Apply to multiple universities from your phone or laptop. One profile. One submission. No paperwork, no travel, no printing. Your documents are stored securely and reused automatically.',
        icon: FileText,
        visual: (
            <div className="w-full space-y-3">
                {/* Progress tracker */}
                {[
                    { step: '01', label: 'Personal Profile', done: true },
                    { step: '02', label: 'Academic Records', done: true },
                    { step: '03', label: 'Programme Selection', done: true },
                    { step: '04', label: 'Submit Application', done: false },
                ].map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border ${s.done
                            ? 'bg-[#d5a22d]/5 border-[#d5a22d]/20'
                            : 'bg-white border-gray-100'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${s.done
                            ? 'bg-[#d5a22d] text-[#1a1b41]'
                            : 'bg-gray-100 text-gray-400'
                            }`}>
                            {s.done ? '✓' : s.step}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wide ${s.done ? 'text-[#1a1b41]' : 'text-gray-400'}`}>
                            {s.label}
                        </span>
                    </motion.div>
                ))}
            </div>
        ),
        dark: true,
        flip: true,
    },
    {
        id: 'message',
        eyebrow: 'SECURE CHANNEL',
        headline: 'Talk directly to admissions. No middlemen.',
        body: 'Our verified messaging system connects you directly with admissions offices across Malawi — no WhatsApp confusion, no unverified agents, no uncertainty about who you are really talking to.',
        icon: MessageSquare,
        visual: (
            <div className="w-full space-y-3">
                {/* Chat bubbles */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-3"
                >
                    <div className="w-8 h-8 rounded-xl bg-[#1a1b41] flex items-center justify-center text-[8px] text-[#d5a22d] font-black shrink-0">UM</div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-sm">
                        <p className="text-[11px] font-black text-[#1a1b41] mb-0.5">UNIMA Admissions</p>
                        <p className="text-gray-500 text-xs">Your application has been received. Results will be out by 15 June.</p>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="flex items-start gap-3 justify-end"
                >
                    <div className="bg-[#d5a22d] rounded-2xl rounded-tr-none px-4 py-3 max-w-[75%]">
                        <p className="text-[#1a1b41] text-xs font-medium">Thank you! Do I need to submit my MSCE certificate in person?</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-[#d5a22d]/20 border border-[#d5a22d]/30 flex items-center justify-center text-[8px] text-[#d5a22d] font-black shrink-0">ME</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-start gap-3"
                >
                    <div className="w-8 h-8 rounded-xl bg-[#1a1b41] flex items-center justify-center text-[8px] text-[#d5a22d] font-black shrink-0">UM</div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] shadow-sm">
                        <p className="text-gray-500 text-xs">No — upload it directly on the platform. No physical copies needed.</p>
                    </div>
                </motion.div>
            </div>
        ),
        dark: false,
        flip: false,
    },
];

export function FeatureRows() {
    return (
        <section id="features" className="bg-slate-50 py-0 overflow-hidden">
            {features.map((feat, idx) => (
                <div
                    key={feat.id}
                    className={`py-20 lg:py-32 relative overflow-hidden ${feat.dark ? 'bg-[#1a1b41]' : 'bg-slate-50'}`}
                >
                    {/* Subtle dot grid */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(${feat.dark ? '#d5a22d' : '#1a1b41'} 1px, transparent 1px)`,
                            backgroundSize: '48px 48px',
                        }}
                    />
                    {feat.dark && (
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#d5a22d] opacity-[0.04] blur-[120px] pointer-events-none" />
                    )}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center ${feat.flip ? 'lg:flex-row-reverse' : ''}`}>
                            {/* Text side */}
                            <motion.div
                                initial={{ opacity: 0, x: feat.flip ? 32 : -32 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className={feat.flip ? 'lg:order-2' : ''}
                            >
                                {/* Eyebrow */}
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${feat.dark ? 'bg-[#d5a22d]/10' : 'bg-[#1a1b41]/8'}`}>
                                        <feat.icon className={`w-3.5 h-3.5 ${feat.dark ? 'text-[#d5a22d]' : 'text-[#1a1b41]'}`} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${feat.dark ? 'text-[#d5a22d]' : 'text-[#d5a22d]'}`}>
                                        {feat.eyebrow}
                                    </span>
                                </div>

                                {/* Headline */}
                                <h2 className={`text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-6 ${feat.dark ? 'text-white' : 'text-[#1a1b41]'}`}>
                                    {feat.headline}
                                </h2>

                                {/* Body */}
                                <p className={`text-lg font-medium leading-relaxed mb-10 max-w-xl ${feat.dark ? 'text-white/55' : 'text-gray-500'}`}>
                                    {feat.body}
                                </p>

                                {/* Learn more link */}
                                <Link
                                    href="/register?type=student"
                                    className={`inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] group ${feat.dark ? 'text-[#d5a22d]' : 'text-[#1a1b41]'}`}
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>

                            {/* Visual side */}
                            <motion.div
                                initial={{ opacity: 0, x: feat.flip ? -32 : 32 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className={`${feat.flip ? 'lg:order-1' : ''} ${feat.dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'} rounded-[2.5rem] p-8 lg:p-10 shadow-2xl`}
                            >
                                {feat.visual}
                            </motion.div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
