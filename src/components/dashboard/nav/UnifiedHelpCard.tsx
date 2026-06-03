'use client';

import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

interface UnifiedHelpCardProps {
    title?: string;
    description?: string;
    href?: string;
    buttonText?: string;
}

export default function UnifiedHelpCard({
    title = "Need Help?",
    description = "Our support team is available to assist you with any questions.",
    href = "/dashboard/resources",
    buttonText = "Support Center"
}: UnifiedHelpCardProps) {
    return (
        <div className="mt-auto px-3 py-4">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand-accent/20 to-brand-primary/40 p-4 border border-white/10 backdrop-blur-md group hover:border-brand-accent/30 transition-all duration-500 shadow-xl shadow-black/20">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-brand-accent/10 rounded-full blur-2xl group-hover:bg-brand-accent/20 transition-colors duration-500" />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-brand-primary/30 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-brand-accent/20 border border-brand-accent/30">
                            <HelpCircle className="w-4 h-4 text-brand-accent" />
                        </div>
                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Support</span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">
                        {title}
                    </h4>
                    <p className="text-[11px] text-white/60 leading-relaxed mb-3">
                        {description}
                    </p>
                    
                    <Link
                        href={href}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-300 group/btn"
                    >
                        <span>{buttonText}</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
