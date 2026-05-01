'use client';

import Link from 'next/link';
import { ChevronRight, Sparkles, Send, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TaskQueueProps {
    pendingScoring:      number;
    pendingOffers:       number;
    pendingRedirections: number;
}

const TASK_CONFIG = [
    {
        key: 'pendingOffers' as const,
        icon: Send,
        color: 'text-[#d5a22d] bg-[#d5a22d]/10',
        dotColor: 'bg-[#d5a22d]',
        label: (n: number) => `${n} application${n !== 1 ? 's' : ''} ready for offer`,
        href: '/dashboard/school/applications?status=UNIVERSITY_REVIEW&sortBy=rank',
    },
    {
        key: 'pendingScoring' as const,
        icon: Sparkles,
        color: 'text-purple-600 bg-purple-50',
        dotColor: 'bg-purple-500',
        label: (n: number) => `${n} application${n !== 1 ? 's' : ''} awaiting scoring`,
        href: '/dashboard/school/applications?status=SUBMITTED',
    },
    {
        key: 'pendingRedirections' as const,
        icon: RefreshCw,
        color: 'text-blue-600 bg-blue-50',
        dotColor: 'bg-blue-500',
        label: (n: number) => `${n} redirection${n !== 1 ? 's' : ''} awaiting student response`,
        href: '/dashboard/school/applications?status=UNIVERSITY_REVIEW',
    },
];

export default function TaskQueue({ pendingScoring, pendingOffers, pendingRedirections }: TaskQueueProps) {
    const counts = { pendingScoring, pendingOffers, pendingRedirections };
    const activeTasks = TASK_CONFIG.filter(t => counts[t.key] > 0);
    const totalTasks = pendingScoring + pendingOffers + pendingRedirections;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-[#1d1b41] tracking-tight">Today&rsquo;s Tasks</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                        {totalTasks > 0 ? `${totalTasks} action${totalTasks !== 1 ? 's' : ''} pending` : 'Nothing pending'}
                    </p>
                </div>
                {totalTasks > 0 && (
                    <span className="w-8 h-8 rounded-xl bg-[#d5a22d] text-white text-sm font-black flex items-center justify-center shadow-md shadow-[#d5a22d]/30">
                        {totalTasks}
                    </span>
                )}
            </div>

            <div className="divide-y divide-slate-50">
                {activeTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-slate-600">All caught up</p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">No pending tasks right now.</p>
                        </div>
                    </div>
                ) : (
                    activeTasks.map((task) => {
                        const count = counts[task.key];
                        return (
                            <Link
                                key={task.key}
                                href={task.href}
                                className="flex items-center gap-5 px-8 py-5 hover:bg-slate-50/60 transition-colors group"
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.color}`}>
                                    <task.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-[#1d1b41] group-hover:text-[#d5a22d] transition-colors">
                                        {task.label(count)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${task.dotColor}`} />
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#d5a22d] group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
