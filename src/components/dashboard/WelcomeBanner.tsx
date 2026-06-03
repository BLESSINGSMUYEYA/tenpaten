'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function WelcomeBanner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(searchParams.get('welcome') === 'true');
    }, [searchParams]);

    const handleDismiss = () => {
        setIsVisible(false);
        // Remove the query param without refreshing the page
        const params = new URLSearchParams(searchParams.toString());
        params.delete('welcome');
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    if (!isVisible) return null;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#1d1b41] via-[#2a285a] to-[#1d1b41] p-px shadow-xl shadow-[#1d1b41]/20">
                <div className="relative bg-white/5 backdrop-blur-xl rounded-[15px] p-6 sm:p-8">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/20">
                            <Sparkles className="w-8 h-8 text-brand-accent" />
                        </div>

                        <div className="grow text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                                Welcome to Tenpaten Apply!
                            </h2>
                            <p className="text-white/80 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                                Your account has been created successfully. We're excited to help you
                                navigate your global education journey. Explore your dashboard to get started!
                            </p>
                        </div>

                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                                <CheckCircle2 className="w-4 h-4 text-brand-accent" />
                                Verified Account
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                aria-label="Dismiss welcome message"
                            >
                                <X className="w-6 h-6 text-white/70 group-hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
