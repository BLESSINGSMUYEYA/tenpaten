'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { bulkUpdateApplicationStatus } from '@/lib/actions/bulk-actions';
import { CheckCircle2, RefreshCw, Send, Archive, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface BulkActionBarProps {
    selectedIds: string[];
    onClearSelection: () => void;
}

const ACTIONS = [
    {
        label: 'Issue Offers',
        status: 'OFFER_ISSUED',
        icon: Send,
        className: 'bg-[#36335e] text-white hover:bg-[#2a284a] shadow-lg shadow-[#36335e]/20',
        requiresConfirm: true,
    },
    {
        label: 'Move to Review',
        status: 'UNIVERSITY_REVIEW',
        icon: RefreshCw,
        className: 'bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100',
        requiresConfirm: false,
    },
    {
        label: 'Mark Enrolled',
        status: 'ENROLLED',
        icon: CheckCircle2,
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100',
        requiresConfirm: true,
    },
    {
        label: 'Reject',
        status: 'REJECTED',
        icon: Archive,
        className: 'bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100',
        requiresConfirm: true,
    },
];

export default function BulkActionBar({ selectedIds, onClearSelection }: BulkActionBarProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [confirmAction, setConfirmAction] = useState<typeof ACTIONS[number] | null>(null);

    const execute = (action: typeof ACTIONS[number]) => {
        if (action.requiresConfirm) {
            setConfirmAction(action);
        } else {
            runAction(action, 'Bulk action');
        }
    };

    const runAction = (action: typeof ACTIONS[number], reason: string) => {
        startTransition(async () => {
            const result = await bulkUpdateApplicationStatus(selectedIds, action.status, reason);

            if (result.failed.length === 0) {
                // Show undo toast for 10s
                const toastId = toast.success(
                    `${result.succeeded} application${result.succeeded !== 1 ? 's' : ''} updated to "${action.label}"`,
                    {
                        duration: 10000,
                        action: {
                            label: 'Undo',
                            onClick: async () => {
                                // Revert — this is a best-effort undo
                                toast.loading('Reverting...', { id: toastId });
                                await bulkUpdateApplicationStatus(selectedIds, 'UNIVERSITY_REVIEW', 'Undo bulk action');
                                toast.success('Action reverted', { id: toastId });
                                router.refresh();
                            },
                        },
                    }
                );
            } else {
                toast.warning(
                    `${result.succeeded} updated, ${result.failed.length} failed. Refresh and retry.`
                );
            }

            setConfirmAction(null);
            onClearSelection();
            router.refresh();
        });
    };

    if (selectedIds.length === 0) return null;

    return (
        <>
            {/* Bar */}
            <div className="flex items-center gap-3 flex-wrap px-4 py-3 bg-[#1d1b41] rounded-2xl animate-in slide-in-from-top-2 duration-200">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 shrink-0">
                    {selectedIds.length} selected
                </span>

                <div className="flex items-center gap-2 flex-wrap flex-1">
                    {ACTIONS.map((action) => (
                        <button
                            key={action.status}
                            onClick={() => execute(action)}
                            disabled={isPending}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${action.className}`}
                        >
                            <action.icon className="w-3.5 h-3.5" />
                            {action.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClearSelection}
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                    title="Clear selection"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Confirmation Modal */}
            {confirmAction && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setConfirmAction(null); }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-6">
                            <div className="w-14 h-14 bg-[#1d1b41]/5 rounded-2xl flex items-center justify-center mx-auto">
                                <confirmAction.icon className="w-7 h-7 text-[#1d1b41]" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-[#1d1b41] tracking-tight">
                                    {confirmAction.label}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                    This will update{' '}
                                    <span className="font-black text-[#1d1b41]">
                                        {selectedIds.length} application{selectedIds.length !== 1 ? 's' : ''}
                                    </span>{' '}
                                    to &ldquo;{confirmAction.label}&rdquo;. You can undo this within 10 seconds after confirming.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmAction(null)}
                                    className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => runAction(confirmAction, `Bulk: ${confirmAction.label}`)}
                                    disabled={isPending}
                                    className="flex-1 h-12 bg-[#1d1b41] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#2a284a] transition-all"
                                >
                                    {isPending ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : 'Confirm'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
