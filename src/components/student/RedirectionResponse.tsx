'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { respondToSwitchSuggestion } from '@/lib/actions/allocation';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RedirectionResponseProps {
    applicationId: string;
    alternativeProgram: {
        id: string;
        name: string;
    };
}

export default function RedirectionResponse({ applicationId, alternativeProgram }: RedirectionResponseProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleResponse = (response: 'ACCEPTED' | 'REJECTED') => {
        startTransition(async () => {
            try {
                const result = await respondToSwitchSuggestion(applicationId, response);
                if (result.success) {
                    toast.success(response === 'ACCEPTED' ? 'Program switch successful!' : 'Suggestion declined.');
                    router.refresh();
                }
            } catch (error: any) {
                toast.error(error.message || 'Failed to process response');
            }
        });
    };

    return (
        <div className="bg-brand-accent/5 border border-brand-accent/20 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden animate-in zoom-in duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl -mr-24 -mt-24" />
            
            <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-lg shadow-brand-accent/20">
                        <RefreshCw className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-brand-primary tracking-tight leading-none mb-1">Programme Realignment</h3>
                        <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Action Required: Alternative Placement</p>
                    </div>
                </div>

                <div className="p-6 bg-white/50 backdrop-blur-sm border border-brand-accent/10 rounded-2xl">
                    <p className="text-sm text-brand-primary font-medium leading-relaxed">
                        The admissions committee has suggested switching your application to <span className="font-black text-brand-accent">{alternativeProgram.name}</span>. 
                        This recommendation is based on your merit profile and current enrollment quotas.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button
                        onClick={() => handleResponse('ACCEPTED')}
                        disabled={isPending}
                        className="w-full sm:flex-1 h-12 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-primary/20 transition-all active:scale-95"
                    >
                        {isPending ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                Accept Switch <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => handleResponse('REJECTED')}
                        disabled={isPending}
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-8 border-brand-primary/10 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                        Decline
                    </Button>
                </div>

                <p className="text-[9px] text-slate-400 font-bold italic text-center">
                    Accepting this switch will update your primary program and preserve your current review rank.
                </p>
            </div>
        </div>
    );
}
