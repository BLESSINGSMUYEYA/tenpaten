'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateApplicationStatus } from '@/lib/actions/applications';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, AlertCircle, Save } from 'lucide-react';

interface StatusUpdateFormProps {
    applicationId: string;
    currentStatus: string;
}

const STATUS_OPTIONS = [
    { value: 'UNIVERSITY_REVIEW', label: 'Under University Review', icon: AlertCircle, color: 'text-blue-600' },
    { value: 'OFFER_ISSUED', label: 'Offer Issued', icon: CheckCircle2, color: 'text-emerald-600' },
    { value: 'OFFER_ACCEPTED', label: 'Offer Accepted', icon: CheckCircle2, color: 'text-emerald-700' },
    { value: 'ENROLLED', label: 'Enrolled', icon: CheckCircle2, color: 'text-[#36335e]' },
    { value: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'text-rose-600' },
];

export default function StatusUpdateForm({ applicationId, currentStatus }: StatusUpdateFormProps) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            const result = await updateApplicationStatus(applicationId, status, note);

            if (result === 'success') {
                setSuccess(true);
                setNote('');
                toast.success('Application status updated successfully');
                router.refresh();
            } else {
                setError(result || 'Failed to update status');
                toast.error(result || 'Failed to update status');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 sm:px-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-[#36335e] text-sm uppercase tracking-widest flex items-center gap-2">
                    <Save className="w-4 h-4 text-[#d5a22d]" />
                    Process Application
                </h3>
            </div>
            <div className="p-6 sm:px-8 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">New Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="w-full h-12 sm:h-14 rounded-2xl border-slate-200 bg-slate-50 focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] font-bold text-slate-700 transition-all">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                            {STATUS_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="font-bold focus:bg-slate-50 cursor-pointer py-3 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${opt.color.replace('text-', 'bg-').replace('600', '50').replace('700', '50').replace('#36335e', 'slate-100')}`}>
                                            <opt.icon className={`w-4 h-4 ${opt.color}`} />
                                        </div>
                                        {opt.label}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="note" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Internal Notes</Label>
                    <Textarea
                        id="note"
                        placeholder="Add specific details or feedback..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] resize-none font-medium leading-relaxed transition-all p-4"
                    />
                </div>

                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 shadow-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        Status updated successfully!
                    </div>
                )}

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || status === currentStatus && !note}
                    className="w-full h-12 sm:h-14 bg-[#36335e] hover:bg-[#2a284a] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#36335e]/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            Processing...
                        </>
                    ) : (
                        'Update Status'
                    )}
                </Button>
            </div>
        </div>
    );
}
