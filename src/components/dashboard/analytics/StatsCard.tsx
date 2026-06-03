'use client';

import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
}

export default function StatsCard({ label, value, trend, trendUp = true }: StatsCardProps) {
    return (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 group">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                    <h3 className="text-2xl sm:text-3xl font-black mt-3 text-brand-primary tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <TrendingUp className="w-5 h-5" />
                </div>
            </div>

            {trend && (
                <div className="mt-6 flex items-center gap-2">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trendUp ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>{trend}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Growth</span>
                </div>
            )}
        </div>
    );
}
