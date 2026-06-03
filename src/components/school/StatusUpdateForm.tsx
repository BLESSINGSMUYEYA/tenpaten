'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateApplicationStatus } from '@/lib/actions/applications';
import { saveOverride } from '@/lib/actions/bulk-actions';
import { OVERRIDE_REASONS, OverrideReason } from '@/lib/constants/admissions';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, AlertCircle, Save, AlertTriangle, Info } from 'lucide-react';
import { Switch } from '@/components/ui/Switch';

interface StatusUpdateFormProps {
    applicationId: string;
    currentStatus: string;
}

const STATUS_OPTIONS = [
    { value: 'UNIVERSITY_REVIEW', label: 'Under University Review', icon: AlertCircle, color: 'text-blue-600' },
    { value: 'OFFER_ISSUED', label: 'Offer Issued', icon: CheckCircle2, color: 'text-emerald-600' },
    { value: 'OFFER_ACCEPTED', label: 'Offer Accepted', icon: CheckCircle2, color: 'text-emerald-700' },
    { value: 'ENROLLED', label: 'Enrolled', icon: CheckCircle2, color: 'text-brand-primary' },
    { value: 'REJECTED', label: 'Rejected', icon: XCircle, color: 'text-rose-600' },
];

export default function StatusUpdateForm({ applicationId, currentStatus }: StatusUpdateFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    const [status, setStatus] = useState(currentStatus);
    const [note, setNote] = useState('');
    const [isOverride, setIsOverride] = useState(false);
    const [overrideReason, setOverrideReason] = useState<OverrideReason | ''>('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setSuccess(false);

        if (isOverride && !overrideReason) {
            setError('A reason is required for manual overrides');
            return;
        }

        startTransition(async () => {
            try {
                let result;
                if (isOverride) {
                    result = await saveOverride(applicationId, status, overrideReason as OverrideReason);
                } else {
                    result = await updateApplicationStatus(applicationId, status, note);
                }

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
            }
        });
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 sm:px-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-black text-brand-primary text-sm uppercase tracking-widest flex items-center gap-2">
                    <Save className="w-4 h-4 text-brand-accent" />
                    Process Application
                </h3>
                
                <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isOverride ? 'text-brand-accent' : 'text-slate-400'}`}>
                        Official Override
                    </span>
                    <Switch 
                        checked={isOverride} 
                        onCheckedChange={setIsOverride} 
                        className="data-[state=checked]:bg-brand-accent"
                    />
                </div>
            </div>
            
            <div className="p-6 sm:px-8 space-y-6">
                {isOverride && (
                    <div className="p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                        <AlertTriangle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-wide leading-relaxed">
                            Manual overrides are flagged in the enrollment audit trail and require a standardized reason for institutional compliance.
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="status" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Target Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="w-full h-12 sm:h-14 rounded-2xl border-slate-200 bg-slate-50 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary font-bold text-slate-700 transition-all">
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

                {!isOverride ? (
                    <div className="space-y-2 animate-in fade-in duration-300">
                        <Label htmlFor="note" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Internal Notes</Label>
                        <Textarea
                            id="note"
                            placeholder="Add specific details or feedback..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[120px] rounded-2xl border-slate-200 bg-slate-50 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary resize-none font-medium leading-relaxed transition-all p-4"
                        />
                    </div>
                ) : (
                    <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                        <Label htmlFor="overrideReason" className="text-xs font-black uppercase tracking-widest text-brand-accent ml-1">Override Reason</Label>
                        <Select value={overrideReason} onValueChange={(val) => setOverrideReason(val as OverrideReason)}>
                            <SelectTrigger id="overrideReason" className="w-full h-12 sm:h-14 rounded-2xl border-brand-accent/30 bg-brand-accent/5 focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent font-bold text-slate-700 transition-all">
                                <SelectValue placeholder="Select standardized reason..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-slate-200 shadow-xl">
                                {OVERRIDE_REASONS.map((r) => (
                                    <SelectItem key={r} value={r} className="font-bold focus:bg-slate-50 cursor-pointer py-3 rounded-xl">
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2 shadow-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleSubmit}
                    disabled={isPending || (status === currentStatus && !note && !isOverride)}
                    className={`w-full h-12 sm:h-14 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 mt-2 ${
                        isOverride ? 'bg-brand-accent hover:bg-[#b08523] shadow-brand-accent/20' : 'bg-brand-primary hover:bg-brand-primary-hover shadow-brand-primary/20'
                    }`}
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            Processing...
                        </>
                    ) : (
                        isOverride ? 'Execute Manual Override' : 'Update Status'
                    )}
                </Button>
            </div>
        </div>
    );
}
