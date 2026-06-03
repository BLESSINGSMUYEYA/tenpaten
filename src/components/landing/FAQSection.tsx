'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import Image from 'next/image';

const faqs = [
    {
        q: 'Is Tenpaten free for students?',
        a: 'Yes — completely. Creating an account, browsing universities, and submitting applications costs nothing. We believe every Malawian student deserves access to higher education opportunities regardless of their financial situation.',
    },
    {
        q: 'Which universities are on the platform?',
        a: 'We partner with accredited institutions across Malawi and globally — including the University of Malawi (UNIMA), Blantyre International University (BIU), Noida International University, and Chandigarh University. New institutions are added regularly.',
    },
    {
        q: 'How do I track my application after submitting?',
        a: 'Every application has a live status tracker right on your dashboard — Draft, Submitted, Under Review, and Decision. You receive in-platform notifications and can message the admissions office directly if you have questions.',
    },
    {
        q: 'Is my personal data safe with Tenpaten?',
        a: 'Your data is encrypted, stored securely, and never shared with third parties without your consent. We are committed to full data protection compliance. Your information is only shared with institutions you apply to.',
    },
];

export function FAQSection() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="bg-white py-24 lg:py-40 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left: Content */}
                    <div>
                        {/* Header */}
                        <div className="mb-14 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-[10px] font-black tracking-[0.3em] mb-6 uppercase"
                            >
                                <HelpCircle className="w-3.5 h-3.5" />
                                Support Center
                            </motion.div>
                            <h2 className="text-4xl lg:text-6xl font-black text-[#1a1b41] tracking-tighter uppercase leading-[0.9] mb-6">
                                Still<br />
                                <span className="text-brand-accent">Unsure?</span>
                            </h2>
                            <p className="text-gray-500 font-medium text-lg max-w-md mx-auto lg:mx-0">
                                We&apos;ve got answers. Or reach out at{' '}
                                <a href="mailto:support@tenpaten.com" className="text-brand-accent hover:underline font-bold">
                                    support@tenpaten.com
                                </a>
                            </p>
                        </div>

                        {/* Accordion */}
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${open === i
                                        ? 'border-brand-accent/40 bg-white shadow-2xl shadow-brand-accent/10'
                                        : 'border-gray-100 bg-slate-50/50 hover:border-brand-accent/25 hover:bg-white'
                                        }`}
                                >
                                    <button
                                        onClick={() => setOpen(open === i ? null : i)}
                                        className="w-full flex items-center justify-between gap-4 px-7 py-6 text-left"
                                        aria-expanded={open === i}
                                    >
                                        <span className={`text-sm font-black uppercase tracking-wide transition-colors ${open === i ? 'text-brand-accent' : 'text-[#1a1b41]'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${open === i
                                            ? 'bg-brand-accent text-[#1a1b41]'
                                            : 'bg-white border border-gray-100 text-gray-400'
                                            }`}>
                                            {open === i
                                                ? <Minus className="w-4 h-4" />
                                                : <Plus className="w-4 h-4" />
                                            }
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {open === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <div className="px-7 pb-8 border-t border-gray-50">
                                                    <p className="text-gray-500 font-medium text-base leading-relaxed pt-6">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[3/4] relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-slate-50">
                            <Image
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
                                alt="Student support"
                                fill
                                className="object-cover transition-transform duration-1000 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#1a1b41]/60 via-transparent to-transparent" />
                            
                            {/* Floating Card */}
                            <div className="absolute bottom-10 left-10 right-10 bg-brand-accent p-8 rounded-3xl shadow-2xl">
                                <p className="text-[#1a1b41] font-black text-2xl tracking-tighter leading-[1] mb-2 uppercase">
                                    Need direct help?
                                </p>
                                <p className="text-[#1a1b41]/70 text-sm font-bold leading-snug">
                                    Our support team is Malawian and available 24/7 to guide you through your applications.
                                </p>
                            </div>
                        </div>

                        {/* Decorative Shape */}
                        <div className="absolute -z-10 -bottom-12 -right-12 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
