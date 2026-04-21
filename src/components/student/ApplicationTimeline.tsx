'use client';

import { Check, Circle, Clock } from 'lucide-react';

type ApplicationTimelineProps = {
    currentStatus: string;
    statusHistory?: Array<{
        status: string;
        createdAt: Date;
        note?: string | null;
    }>;
};

const stages = [
    { key: 'PAYMENT_PENDING', label: 'Payment Pending', description: 'Application fee required', estimate: 'Immediate' },
    { key: 'SUBMITTED', label: 'Submitted', description: 'Application received', estimate: '1-2 days' },
    { key: 'COUNTRY_REVIEW', label: 'Country Review', description: 'Under country director review', estimate: '3-5 days' },
    { key: 'UNIVERSITY_REVIEW', label: 'University Review', description: 'Under university review', estimate: '1-2 weeks' },
    { key: 'OFFER_ISSUED', label: 'Offer Issued', description: 'Offer letter available', estimate: 'Immediate' },
    { key: 'OFFER_ACCEPTED', label: 'Accepted', description: 'Offer accepted', estimate: 'Immediate' },
];

export default function ApplicationTimeline({ currentStatus, statusHistory }: ApplicationTimelineProps) {
    const currentStageIndex = stages.findIndex(s => s.key === currentStatus);
    const isRejected = currentStatus === 'REJECTED';

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d5a22d]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Tracking</span>
            </div>
            <h3 className="text-base font-black text-[#36335e] tracking-tight">
                Application Progress
            </h3>

            {/* Timeline - responsive */}
            <div className="relative">
                {stages.map((stage, index) => {
                    const isCompleted = index < currentStageIndex || currentStatus === 'ENROLLED';
                    const isCurrent = index === currentStageIndex && !isRejected;
                    const isPending = index > currentStageIndex && !isRejected;

                    return (
                        <div key={stage.key} className="relative pb-6 sm:pb-8 last:pb-0">
                            {/* Connecting line */}
                            {index < stages.length - 1 && (
                                <div
                                    className={`absolute left-4 sm:left-5 top-10 sm:top-11 w-0.5 h-full -ml-px ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                        }`}
                                />
                            )}

                            {/* Stage content */}
                            <div className="relative flex items-start gap-3 sm:gap-4">
                                {/* Icon */}
                                <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${isCompleted
                                    ? 'bg-emerald-500 border-emerald-500 shadow-emerald-200'
                                    : isCurrent
                                        ? 'bg-[#d5a22d] border-[#d5a22d] shadow-[#d5a22d]/30 animate-pulse'
                                        : 'bg-white border-gray-100'
                                    }`}>
                                    {isCompleted ? (
                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    ) : isCurrent ? (
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    ) : (
                                        <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300 fill-slate-300" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                                    <div className={`text-sm font-black tracking-tight ${isCompleted || isCurrent ? 'text-[#36335e]' : 'text-slate-300'
                                        }`}>
                                        {stage.label}
                                    </div>
                                    <div className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isCompleted || isCurrent ? 'text-slate-500' : 'text-slate-300'
                                        }`}>
                                        {stage.description}
                                    </div>

                                    {/* Estimated Time */}
                                    {(isCurrent || isPending) && (
                                        <div className="flex items-center gap-1.5 mt-2.5 text-[9px] font-black text-[#d5a22d] bg-[#d5a22d]/5 w-fit px-2 py-1 rounded-md uppercase tracking-[0.1em] border border-[#d5a22d]/10">
                                            <Clock className="w-3 h-3" />
                                            Est: {stage.estimate}
                                        </div>
                                    )}

                                    {/* Show date if completed */}
                                    {statusHistory && isCompleted && (
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {statusHistory.find(h => h.status === stage.key) &&
                                                new Date(statusHistory.find(h => h.status === stage.key)!.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })
                                            }
                                        </div>
                                    )}
                                </div>

                                {/* Status badge */}
                                {isCurrent && (
                                    <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[9px] font-black uppercase tracking-[0.2em] border border-[#d5a22d]/20">
                                        Active
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Rejected state */}
                {isRejected && (
                    <div className="relative flex items-start gap-3 sm:gap-4 pt-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-red-500 border-red-500">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="text-sm font-black text-[#36335e]">
                                Application Rejected
                            </div>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-red-400 mt-0.5">
                                Unfortunately, your application was not successful
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
