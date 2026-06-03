'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { approveUniversity, rejectUniversity } from '@/lib/actions/country-director';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UniversityReviewActionsProps {
    universityId: string;
}

export default function UniversityReviewActions({ universityId }: UniversityReviewActionsProps) {
    const [isRejecting, setIsRejecting] = useState(false);
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const result = await approveUniversity(universityId);
            if (result.success) {
                toast.success('University approved successfully');
            } else {
                toast.error(result.error || 'Failed to approve');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!reason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setIsLoading(true);
        try {
            const result = await rejectUniversity(universityId, reason);
            if (result.success) {
                toast.success('University rejected with feedback');
                setIsRejecting(false);
            } else {
                toast.error(result.error || 'Failed to reject');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (isRejecting) {
        return (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl space-y-8 animate-in zoom-in-95 duration-300 border border-slate-100">
                    <div className="space-y-2 text-center">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Rejection Feedback</h3>
                        <p className="text-slate-500 font-medium">Please provide a clear reason for rejecting this institution. This will be shown to the school administrator.</p>
                    </div>

                    <Textarea
                        placeholder="e.g., The provided logo is low resolution, or documentation for the medical program is missing..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[150px] border-slate-100 bg-slate-50/50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-2xl transition-all font-medium p-6"
                    />

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsRejecting(false)}
                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReject}
                            disabled={isLoading}
                            className="flex-2 h-14 px-10 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-rose-100 transition-all transform active:scale-95"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Rejection'}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 ml-3">
            <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-brand-primary/10 transition-all transform hover:scale-105 active:scale-95 leading-none"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-brand-accent" /> : <CheckCircle2 className="w-4 h-4 mr-2 text-brand-accent" />}
                Approve Institution
            </Button>
            <Button
                variant="outline"
                onClick={() => setIsRejecting(true)}
                disabled={isLoading}
                className="h-12 px-6 text-rose-600 border-rose-100 hover:bg-rose-50 hover:border-rose-200 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
            </Button>
        </div>
    );
}
