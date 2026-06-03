'use client';

import { FileText, Send, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

type StudentStatsProps = {
    stats: {
        total: number;
        submitted: number;
    };
};

export default function StudentStats({ stats }: StudentStatsProps) {
    const statCards = [
        {
            label: 'Total Applications',
            value: stats.total,
            icon: FileText,
            color: 'from-brand-primary to-purple-600',
            bgColor: 'bg-brand-primary/5',
            iconBg: 'bg-brand-primary/10',
            iconColor: 'text-brand-primary',
            borderColor: 'border-brand-primary/20',
        },
        {
            label: 'Submitted',
            value: stats.submitted,
            icon: Send,
            color: 'from-brand-accent to-[#b89531]',
            bgColor: 'bg-brand-accent/10',
            iconBg: 'bg-brand-accent/20',
            iconColor: 'text-brand-accent',
            borderColor: 'border-brand-accent/40',
            badge: stats.submitted > 0 ? { icon: Flame, label: 'Active', color: 'text-orange-600' } : null,
        },
    ];

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl"
        >
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                const BadgeIcon = stat.badge?.icon;

                return (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            show: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={`group relative overflow-hidden rounded-3xl bg-white border border-gray-100 hover:border-brand-accent/30 shadow-sm hover:shadow-md p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1`}
                    >
                        {/* Gradient overlay on hover */}
                        <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`} />

                        <div className="relative">
                            {/* Icon with badge */}
                            <div className="flex items-start justify-between mb-3">
                                <div className={`${stat.iconBg} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                                </div>
                                {stat.badge && BadgeIcon && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm">
                                        <BadgeIcon className={`w-3 h-3 ${stat.badge.color}`} />
                                    </div>
                                )}
                            </div>

                            {/* Value */}
                            <div className="text-2xl font-black text-brand-primary mb-0.5">
                                {stat.value}
                            </div>

                            {/* Label */}
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">
                                {stat.label}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
