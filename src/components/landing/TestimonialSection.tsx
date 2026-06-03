'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
    {
        image: '/images/testimonials/blessings_user.jpg',
        name: 'Blessings Muyeya',
        school: 'Polytechnic (UNIMA)',
        content:
            "Tenpaten made my university transition seamless. I applied, tracked my status, and got my admission letter without a single trip to the registry. It's a game-changer for Malawian students.",
    },
    {
        image: '/images/testimonials/jairos_user.jpg',
        name: 'Jairos Banda',
        school: 'Lilongwe University (LUANAR)',
        content:
            "I discovered scholarship opportunities I never knew existed. Tenpaten matched my profile and guided me through the entire process. I'm now studying my dream course thanks to this platform.",
    },
    {
        image: '/images/testimonials/davie_user.jpg',
        name: 'Davie Phiri',
        school: 'Mzuzu University',
        content:
            "The direct line to admissions is what sets this platform apart. I had questions about my documents and got answers in minutes. No agents, no stress. Just direct results.",
    },
];

export function TestimonialSection() {
    return (
        <section className="py-24 lg:py-40 bg-[#0f1030] relative overflow-hidden">
            {/* Dot grid */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
            />
            {/* Gold gradient orb */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-accent opacity-[0.03] blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 lg:mb-24">
                    <span className="text-brand-accent text-[10px] font-black tracking-[0.4em] uppercase">Student Success Stories</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-6 tracking-tighter uppercase leading-[0.9]">
                        Trusted by the<br /><span className="text-brand-accent">Next Generation.</span>
                    </h2>
                    <p className="text-white/40 font-medium text-lg mt-6 max-w-xl mx-auto">
                        Real students from Malawi's top institutions sharing their Tenpaten experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="group relative flex flex-col h-full"
                        >
                            {/* Image Container with premium frame */}
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-[#0f1030] via-transparent to-transparent opacity-60" />
                                
                                {/* School Badge */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent text-[#1a1b41] text-[9px] font-black uppercase tracking-widest">
                                        <span className="w-1 h-1 rounded-full bg-[#1a1b41] animate-pulse" />
                                        {item.school}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-[1px] w-8 bg-brand-accent/30" />
                                    <h4 className="text-white font-black text-xl tracking-tight">{item.name}</h4>
                                </div>
                                <p className="text-white/50 font-medium leading-relaxed italic text-base lg:text-lg">
                                    &ldquo;{item.content}&rdquo;
                                </p>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-accent opacity-[0.02] blur-2xl group-hover:opacity-[0.05] transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
