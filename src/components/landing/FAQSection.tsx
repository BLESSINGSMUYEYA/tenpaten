'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        q: 'Is Tenpaten free for students?',
        a: 'Yes — completely. Creating an account, browsing universities, and submitting applications costs nothing. We believe every Malawian student deserves access to higher education opportunities regardless of their financial situation.',
    },
    {
        q: 'Which universities are on the platform?',
        a: 'We partner with accredited institutions across Malawi — including the University of Malawi (UNIMA), Mzuzu University, LUANAR, and many more. New institutions are added regularly. You can browse the full list after signing up.',
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
        <section className="bg-slate-50 py-20 lg:py-32">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">Frequently Asked</span>
                    <h2 className="text-4xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter uppercase leading-[0.9]">
                        Still Unsure?
                    </h2>
                    <p className="text-gray-500 font-medium text-lg mt-4">
                        We&apos;ve got answers. Or reach out at{' '}
                        <a href="mailto:support@tenpaten.com" className="text-[#d5a22d] hover:underline font-bold">
                            support@tenpaten.com
                        </a>
                    </p>
                </div>

                {/* Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${open === i
                                ? 'border-[#d5a22d]/40 bg-white shadow-lg shadow-[#d5a22d]/5'
                                : 'border-gray-200 bg-white hover:border-[#d5a22d]/25'
                                }`}
                        >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between gap-4 px-7 py-5 text-left"
                                aria-expanded={open === i}
                            >
                                <span className={`text-sm font-black uppercase tracking-wide transition-colors ${open === i ? 'text-[#d5a22d]' : 'text-[#1a1b41]'}`}>
                                    {faq.q}
                                </span>
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${open === i
                                    ? 'bg-[#d5a22d] text-[#1a1b41]'
                                    : 'bg-gray-100 text-gray-400'
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
                                        <div className="px-7 pb-6 border-t border-gray-100">
                                            <p className="text-gray-500 font-medium text-sm leading-relaxed pt-5">
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
        </section>
    );
}
