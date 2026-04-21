'use client';

import { usePerformance } from '@/components/providers/PerformanceProvider';
import { Zap, ZapOff } from 'lucide-react';

export default function PerformanceToggle() {
    const { isLiteMode, toggleLiteMode } = usePerformance();

    return (
        <div className="px-3 pb-6">
            <button
                onClick={toggleLiteMode}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group ${
                    isLiteMode 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-colors ${
                        isLiteMode ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/40'
                    }`}>
                        {isLiteMode ? <ZapOff className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                            {isLiteMode ? 'Lite Mode Active' : 'Premium Mode'}
                        </p>
                        <p className="text-[9px] opacity-60 font-medium leading-none">
                            {isLiteMode ? 'Saving data & battery' : 'Full visual experience'}
                        </p>
                    </div>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${
                    isLiteMode ? 'bg-amber-500' : 'bg-white/20'
                }`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                        isLiteMode ? 'left-4.5' : 'left-0.5'
                    }`} />
                </div>
            </button>
        </div>
    );
}
