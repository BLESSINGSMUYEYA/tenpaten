'use client';

import { Info, Lightbulb, AlertTriangle, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type BannerType = 'info' | 'tip' | 'warning' | 'success';

interface InfoBannerProps {
    type?: BannerType;
    title: string;
    message: string;
    closable?: boolean;
    id?: string; // For persistence if we want to hide it forever
}

export default function InfoBanner({ 
    type = 'info', 
    title, 
    message, 
    closable = true,
    id 
}: InfoBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const styles = {
        info: {
            bg: 'bg-blue-50/50',
            border: 'border-blue-100',
            icon: Info,
            iconColor: 'text-blue-500',
            accent: 'bg-blue-500'
        },
        tip: {
            bg: 'bg-amber-50/50',
            border: 'border-amber-100',
            icon: Lightbulb,
            iconColor: 'text-amber-500',
            accent: 'bg-amber-500'
        },
        warning: {
            bg: 'bg-red-50/50',
            border: 'border-red-100',
            icon: AlertTriangle,
            iconColor: 'text-red-500',
            accent: 'bg-red-500'
        },
        success: {
            bg: 'bg-green-50/50',
            border: 'border-green-100',
            icon: Sparkles,
            iconColor: 'text-green-500',
            accent: 'bg-green-500'
        }
    };

    const config = styles[type];
    const Icon = config.icon;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative overflow-hidden rounded-[2rem] border ${config.border} ${config.bg} p-6 mb-6 backdrop-blur-sm group`}
            >
                <div className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${config.iconColor} bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className={`text-sm font-black uppercase tracking-widest ${config.iconColor}`}>
                            {title}
                        </h4>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-2xl">
                            {message}
                        </p>
                    </div>
                    {closable && (
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-xl transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {/* Decorative side accent */}
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full ${config.accent} opacity-30`} />
            </motion.div>
        </AnimatePresence>
    );
}
