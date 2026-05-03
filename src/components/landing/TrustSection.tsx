'use client';

import { ShieldCheck, Lock, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustPillars = [
    {
        icon: ShieldCheck,
        title: 'Verified Institutions',
        desc: 'Every university on Tenpaten is independently verified and accredited before being listed on the platform.',
        chip: 'INSTITUTION VERIFIED',
    },
    {
        icon: Lock,
        title: 'Encrypted Documents',
        desc: 'Your personal information and academic documents are protected with enterprise-grade encryption at all times.',
        chip: 'SECURE CHANNEL',
    },
    {
        icon: MessageSquare,
        title: 'Direct Communication',
        desc: 'Message admissions offices directly through our secure, monitored channel — no intermediaries, no miscommunication.',
        chip: 'DIRECT ADMISSIONS',
    },
];

export function TrustSection() {
    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden border-t border-gray-100">
            {/* Subtle dot grid */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#1a1b41 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-20">
                    {/* Secure channel badge — exact UI from the chat screenshot */}
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#1a1b41]/10 bg-[#1a1b41]/5 mb-6">
                        <div className="w-5 h-5 rounded-full bg-[#1a1b41] flex items-center justify-center">
                            <Lock className="w-2.5 h-2.5 text-[#d5a22d]" />
                        </div>
                        <span className="text-[#1a1b41] text-[10px] font-black tracking-[0.3em] uppercase">
                            Secure Channel
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1b41] tracking-tighter uppercase leading-[0.9] mb-4">
                        You&apos;re In Safe Hands
                    </h2>
                    <p className="text-gray-500 font-bold text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                        You are communicating directly with verified university admissions units. For your safety, 
                        your documents and information are always protected.
                    </p>
                </div>

                {/* Trust pillars */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {TrustPillars.map((pillar, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative p-8 lg:p-10 rounded-[2rem] border border-gray-100 bg-white hover:border-[#d5a22d]/30 hover:shadow-[0_32px_64px_-16px_rgba(213,162,45,0.08)] transition-all duration-500 overflow-hidden"
                        >
                            {/* Gold top border accent */}
                            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d5a22d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Status chip */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1b41]/5 border border-[#1a1b41]/10 text-[9px] font-black tracking-[0.25em] uppercase text-[#1a1b41]/60 mb-6">
                                <span className="w-1 h-1 rounded-full bg-green-500" />
                                {pillar.chip}
                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-[#d5a22d]/10 flex items-center justify-center mb-6 group-hover:bg-[#d5a22d] transition-all duration-300">
                                <pillar.icon className="w-5 h-5 text-[#d5a22d] group-hover:text-white transition-colors duration-300" />
                            </div>

                            <h3 className="text-xl font-black text-[#1a1b41] uppercase tracking-tighter mb-3 leading-none group-hover:text-[#d5a22d] transition-colors duration-300">
                                {pillar.title}
                            </h3>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                {pillar.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom assurance bar */}
                <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12 py-8 px-8 rounded-2xl bg-gray-50 border border-gray-100">
                    {[
                        'No password sharing required',
                        'No payment credentials in chat',
                        'Direct university contact only',
                        'Monitored for your protection',
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            <CheckCircle2 className="w-4 h-4 text-[#d5a22d] shrink-0" />
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
