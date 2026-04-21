'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, X, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DraftReminderBannerProps {
    draft: {
        id: string;
        programId: string;
        program: {
            name: string;
            university: {
                name: string;
            };
        };
        updatedAt: Date;
        expiresAt?: Date | null;
    };
}

export default function DraftReminderBanner({ draft }: DraftReminderBannerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(true); // Default to true to prevent flash

    useEffect(() => {
        const sessionDismissed = sessionStorage.getItem(`draft_banner_session_${draft.id}`);
        const permanentDismissed = localStorage.getItem(`draft_banner_perm_${draft.id}`);

        if (!sessionDismissed && !permanentDismissed) {
            setIsDismissed(false);
            // Delay appearance slightly for effect
            setTimeout(() => setIsVisible(true), 1000);
        }
    }, [draft.id]);

    const handleDismiss = (type: 'session' | 'permanent') => {
        setIsVisible(false);
        setTimeout(() => {
            if (type === 'session') {
                sessionStorage.setItem(`draft_banner_session_${draft.id}`, 'true');
            } else {
                localStorage.setItem(`draft_banner_perm_${draft.id}`, 'true');
            }
            setIsDismissed(true);
        }, 500);
    };

    if (isDismissed) return null;

    const daysUntilExpiry = draft.expiresAt 
        ? Math.ceil((new Date(draft.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="relative overflow-hidden"
                >
                    <div className="mb-8 p-1 rounded-[2.5rem] bg-gradient-to-r from-[#1d1b41] via-[#d5a22d]/30 to-[#1d1b41] shadow-2xl">
                        <div className="bg-[#1d1b41] rounded-[2.3rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#d5a22d]/10 rounded-full blur-2xl -ml-16 -mb-16" />

                            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                                <div className="w-16 h-16 rounded-2xl bg-[#d5a22d]/10 flex items-center justify-center flex-shrink-0 border border-[#d5a22d]/20">
                                    <Sparkles className="w-8 h-8 text-[#d5a22d] animate-pulse" />
                                </div>
                                <div className="space-y-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.3em]">Unfinished Application</span>
                                        {daysUntilExpiry !== null && daysUntilExpiry <= 7 && (
                                            <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-widest border border-amber-500/30 flex items-center gap-1">
                                                <Clock className="w-2 h-2" /> Expires in {daysUntilExpiry} days
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                                        Continue your application for <span className="text-[#d5a22d]">{draft.program.name}</span>
                                    </h3>
                                    <p className="text-xs text-white/50 font-medium italic">
                                        at {draft.program.university.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                                <Link
                                    href={`/dashboard/apply?programId=${draft.programId}&draftId=${draft.id}`}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#d5a22d] text-[#1d1b41] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-[#d5a22d]/20 active:scale-95 group"
                                >
                                    Resume Application
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => handleDismiss('session')}
                                        className="p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                        title="Dismiss for now"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDismiss('permanent')}
                                        className="text-[8px] font-black text-white/20 uppercase tracking-widest hover:text-[#d5a22d] transition-colors"
                                    >
                                        Don't remind again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
