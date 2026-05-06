'use client';

import { motion } from 'framer-motion';

const testimonials = [
    {
        initials: 'CK',
        name: 'Chisomo Kamanga',
        school: 'Blantyre Secondary School',
        content:
            "I never thought applying to university could be this straightforward. I submitted to three institutions in one afternoon without leaving my house. Tenpaten changed everything for me.",
    },
    {
        initials: 'TN',
        name: 'Takondwa Nkhoma',
        school: 'Mzuzu Boys Secondary',
        content:
            "The messaging feature is what got me. I actually spoke directly with the admissions office at UNIMA — no agents, no confusion. I knew exactly where my application stood the whole time.",
    },
    {
        initials: 'AM',
        name: 'Alinafe Mwale',
        school: 'Lilongwe Girls Secondary',
        content:
            "I found a scholarship I didn't even know existed through Tenpaten. The platform surfaced it automatically based on my profile. I got funding and a place at BIU. Highly recommend.",
    },
];

export function TestimonialSection() {
    return (
        <section className="py-20 lg:py-32 bg-[#0f1030] relative overflow-hidden">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
            />
            {/* Gold gradient orb */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#d5a22d] opacity-[0.04] blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 lg:mb-20">
                    <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">From Others Around Malawi</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tighter uppercase leading-[0.9]">
                        Don&apos;t just take it from us.
                    </h2>
                    <p className="text-white/45 font-medium text-lg mt-4 max-w-xl mx-auto">
                        Real students. Real applications. Real results.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.12 }}
                            className="group relative rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm hover:border-[#d5a22d]/30 hover:bg-white/8 transition-all duration-500 overflow-hidden flex flex-col"
                        >
                            {/* Gold top border on hover */}
                            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#d5a22d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Card header */}
                            <div className="bg-[#1a1b41] border-b border-white/5 px-6 py-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#d5a22d]/20 border border-[#d5a22d]/30 flex items-center justify-center text-[#d5a22d] text-[11px] font-black shrink-0">
                                    {item.initials}
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm leading-none">{item.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#d5a22d]" />
                                        <p className="text-[#d5a22d] text-[9px] font-black uppercase tracking-[0.25em]">{item.school}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quote */}
                            <div className="p-6 lg:p-8 flex-1 flex flex-col">
                                <div className="text-[#d5a22d]/20 text-5xl font-serif leading-none mb-2 group-hover:text-[#d5a22d]/40 transition-colors duration-500">&ldquo;</div>
                                <p className="text-white/60 font-medium leading-relaxed flex-1 italic text-sm lg:text-base">
                                    {item.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
