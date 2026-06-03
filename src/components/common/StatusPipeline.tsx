'use client';

import React from 'react';
import { 
    Check, Circle, AlertCircle, Clock, Send, Globe, 
    School, PartyPopper, GraduationCap, XCircle, AlertTriangle 
} from 'lucide-react';

export type ApplicationStatus = 
  | 'DRAFT' 
  | 'PAYMENT_PENDING' 
  | 'SUBMITTED' 
  | 'COUNTRY_REVIEW' 
  | 'UNIVERSITY_REVIEW' 
  | 'OFFER_ISSUED' 
  | 'OFFER_ACCEPTED' 
  | 'ENROLLED' 
  | 'REJECTED';

interface StatusStep {
    id: ApplicationStatus;
    label: string;
    icon: React.ElementType;
}

// Helper to avoid import issues
const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
);

const STEPS: StatusStep[] = [
    { id: 'DRAFT', label: 'Draft', icon: Clock },
    { id: 'PAYMENT_PENDING', label: 'Payment', icon: Clock },
    { id: 'SUBMITTED', label: 'Submitted', icon: Send },
    { id: 'COUNTRY_REVIEW', label: 'Regional Review', icon: Globe },
    { id: 'UNIVERSITY_REVIEW', label: 'University Review', icon: School },
    { id: 'OFFER_ISSUED', label: 'Offer Issued', icon: PartyPopper },
    { id: 'OFFER_ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
    { id: 'ENROLLED', label: 'Enrolled', icon: GraduationCap },
];

interface StatusPipelineProps {
    currentStatus: ApplicationStatus;
    compact?: boolean;
    isOverride?: boolean;
}

export default function StatusPipeline({ currentStatus, compact = false, isOverride = false }: StatusPipelineProps) {
    const currentIndex = STEPS.findIndex(s => s.id === currentStatus);
    const isRejected = currentStatus === 'REJECTED';

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                    {STEPS.map((step, idx) => {
                        const isCompleted = idx < currentIndex;
                        const isCurrent = idx === currentIndex;
                        return (
                            <div 
                                key={step.id} 
                                className={`w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-gray-100 ${
                                    isCompleted ? 'bg-brand-accent' : 
                                    isCurrent ? (isRejected ? 'bg-red-500' : (isOverride ? 'bg-brand-accent' : 'bg-[#1d1b41] animate-pulse')) : 
                                    'bg-gray-200'
                                }`}
                                title={step.label}
                            />
                        );
                    })}
                </div>
                {isRejected ? (
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                        <XCircle className="w-2.5 h-2.5" />
                        Rejected
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#1d1b41] uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                            {STEPS[currentIndex]?.label || 'Unknown'}
                        </span>
                        {isOverride && (
                            <span className="text-[8px] font-black text-white uppercase tracking-widest bg-brand-accent px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                <AlertTriangle className="w-2 h-2" />
                                Override
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-brand-accent -translate-y-1/2 z-0 transition-all duration-1000" 
                    style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isCurrent = idx === currentIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                isCompleted ? 'bg-brand-accent border-brand-accent text-white' : 
                                isCurrent ? (isRejected ? 'bg-red-500 border-red-500 text-white' : (isOverride ? 'bg-brand-accent border-brand-accent text-white' : 'bg-[#1d1b41] border-[#1d1b41] text-white shadow-lg shadow-[#1d1b41]/20')) : 
                                'bg-white border-gray-200 text-gray-400'
                            }`}>
                                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                            </div>
                            <div className="mt-3 text-center">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${
                                    isCurrent ? (isRejected ? 'text-red-500' : (isOverride ? 'text-brand-accent' : 'text-[#1d1b41]')) : 
                                    isCompleted ? 'text-brand-accent' : 'text-gray-400'
                                }`}>
                                    {isCurrent && isRejected ? 'Rejected' : step.label}
                                </p>
                            </div>
                            {isCurrent && !isRejected && (
                                <div className="absolute top-[-12px] animate-bounce flex flex-col items-center gap-1">
                                    <div className={`p-1 rounded-md text-white text-[8px] font-black uppercase tracking-tighter ${isOverride ? 'bg-brand-accent' : 'bg-[#1d1b41]'}`}>
                                        {isOverride ? 'Manual Override' : 'Active'}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {isRejected && (
                <div className="mt-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-red-900 leading-none mb-1">Application Rejected</p>
                        <p className="text-xs text-red-700 font-medium leading-relaxed">
                            This application has been declined. You can message the university for feedback or explore other programs.
                        </p>
                    </div>
                </div>
            )}
            
            {isOverride && (
                <div className="mt-8 p-4 rounded-2xl bg-brand-accent/5 border border-brand-accent/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-brand-accent leading-none mb-1">Decision Override Active</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            This application is currently being handled via administrative override. Standard scoring and ranking logic have been bypassed.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}


