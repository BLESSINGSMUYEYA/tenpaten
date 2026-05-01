'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { saveOverride, getOverrideImpactPreview } from '@/lib/actions/bulk-actions';
import { OVERRIDE_REASONS, OverrideReason } from '@/lib/constants/admissions';
import { ApplicationStatus } from '@prisma/client';
import { AlertTriangle, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
    { value: 'UNIVERSITY_REVIEW',  label: 'Under University Review' },
    { value: 'OFFER_ISSUED',       label: 'Issue Offer' },
    { value: 'OFFER_ACCEPTED',     label: 'Mark Offer Accepted' },
    { value: 'ENROLLED',           label: 'Mark as Enrolled' },
    { value: 'REJECTED',           label: 'Reject Application' },
];

interface OverrideModalProps {
    applicationId: string;
    applicantName: string;
    currentStatus: ApplicationStatus;
    currentRank: number | null;
    onClose: () => void;
    onSuccess: () => void;
}

interface ImpactPreview {
    currentRank: number | null;
    displaced: { id: string; name: string; currentRank: number; newRank: number }[];
}

export default function OverrideModal({
    applicationId,
    applicantName,
    currentStatus,
    currentRank,
    onClose,
    onSuccess,
}: OverrideModalProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [newStatus, setNewStatus] = useState<ApplicationStatus>(currentStatus);
    const [reason, setReason] = useState<OverrideReason | ''>('');
    const [newRank, setNewRank] = useState<string>(currentRank?.toString() ?? '');
    const [preview, setPreview] = useState<ImpactPreview | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const handleRankBlur = async () => {
        const parsed = parseInt(newRank);
        if (!isNaN(parsed) && parsed > 0 && parsed !== currentRank) {
            setLoadingPreview(true);
            try {
                const result = await getOverrideImpactPreview(applicationId, parsed);
                setPreview(result);
            } catch {
                toast.error('Could not load impact preview');
            } finally {
                setLoadingPreview(false);
            }
        } else {
            setPreview(null);
        }
    };

    const handleConfirm = () => {
        if (!reason) return;

        startTransition(async () => {
            const parsedRank = parseInt(newRank);
            const rankArg = !isNaN(parsedRank) && parsedRank > 0 ? parsedRank : undefined;
            const result = await saveOverride(applicationId, newStatus, reason as OverrideReason, rankArg);

            if (result === 'success') {
                toast.success(`Override saved for ${applicantName}`);
                router.refresh();
                onSuccess();
            } else {
                toast.error(result || 'Failed to save override');
            }
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-[#1d1b41] text-white p-8 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-[#d5a22d]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d5a22d]">
                                Manual Override
                            </span>
                        </div>
                        <h3 className="text-xl font-black tracking-tight">{applicantName}</h3>
                        <p className="text-white/50 text-xs font-medium mt-1">
                            All overrides are logged and attributed to your account
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Status Change */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            New Status
                        </label>
                        <div className="relative">
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                                className="w-full appearance-none px-4 py-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] transition-all cursor-pointer"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Rank Override (only if applicant has a rank) */}
                    {currentRank !== null && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Override Rank{' '}
                                <span className="text-slate-300 normal-case tracking-normal font-medium">
                                    (current: #{currentRank})
                                </span>
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={newRank}
                                onChange={(e) => { setNewRank(e.target.value); setPreview(null); }}
                                onBlur={handleRankBlur}
                                placeholder="Enter new rank..."
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] transition-all"
                            />
                        </div>
                    )}

                    {/* Impact Preview */}
                    {loadingPreview && (
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium px-1">
                            <div className="w-3 h-3 border-2 border-slate-300 border-t-[#36335e] rounded-full animate-spin" />
                            Calculating impact...
                        </div>
                    )}
                    {preview && preview.displaced.length > 0 && (
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                                Impact Preview
                            </p>
                            <div className="space-y-1.5">
                                {preview.displaced.map(d => (
                                    <div key={d.id} className="flex items-center gap-2 text-xs font-bold text-amber-800">
                                        <span className="truncate flex-1">{d.name}</span>
                                        <span className="flex items-center gap-1 shrink-0 text-amber-600">
                                            #{d.currentRank}
                                            <ArrowRight className="w-3 h-3" />
                                            #{d.newRank}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reason Dropdown — required */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Reason for Override <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value as OverrideReason)}
                                className="w-full appearance-none px-4 py-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] transition-all cursor-pointer"
                            >
                                <option value="">Select a reason...</option>
                                {OVERRIDE_REASONS.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        {!reason && (
                            <p className="text-[10px] text-slate-400 font-medium px-1">
                                A reason is required. This will appear in the audit trail.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!reason || isPending}
                            className="flex-1 h-12 bg-[#1d1b41] hover:bg-[#2a284a] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#1d1b41]/20 disabled:opacity-40 transition-all"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </span>
                            ) : 'Confirm Override'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
