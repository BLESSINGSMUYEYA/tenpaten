'use client';

import { useState } from 'react';
import { updateApplicationStatus } from '@/lib/actions/country-director';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminStatusUpdater({ applicationId, currentStatus }: { applicationId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const statuses = [
        'SUBMITTED',
        'COUNTRY_REVIEW',
        'UNIVERSITY_REVIEW',
        'OFFER_ISSUED',
        'OFFER_ACCEPTED',
        'ENROLLED',
        'REJECTED'
    ];

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const result = await updateApplicationStatus(applicationId, status, note);
            if (result.success) {
                toast.success('Application status updated successfully');
                setNote('');
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to update status');
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <Label htmlFor="status" className="text-xs font-black text-gray-400 uppercase tracking-widest">Target Workflow Position</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#d5a22d]/20 focus:border-[#d5a22d]/30 font-bold text-[#36335e]">
                            <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                            <SelectGroup>
                                <SelectLabel className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2">Operational States</SelectLabel>
                                {statuses.map((s) => (
                                    <SelectItem key={s} value={s} className="py-3 px-4 focus:bg-[#36335e]/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full shadow-sm
                                                ${s === 'REJECTED' ? 'bg-red-500' :
                                                    s === 'ENROLLED' ? 'bg-[#36335e]' :
                                                        s === 'OFFER_ISSUED' ? 'bg-[#d5a22d]' : 'bg-blue-500'}`}
                                            />
                                            <span className="font-bold text-[#36335e]">{s.replace('_', ' ')}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-2 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 text-[#d5a22d]" />
                        Status transitions trigger automated student notifications.
                    </p>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="note" className="text-xs font-black text-gray-400 uppercase tracking-widest">Administrative Justification</Label>
                    <Textarea
                        id="note"
                        placeholder="Detail the rationale for this state transition..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[100px] bg-gray-50 border-gray-100 focus:bg-white focus:border-[#d5a22d]/30 focus:ring-[#d5a22d]/20 rounded-2xl text-sm font-medium p-4 transition-all"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-50">
                <Button
                    onClick={handleUpdate}
                    disabled={loading || (status === currentStatus && !note)}
                    className="h-14 px-10 bg-[#36335e] hover:bg-[#2a284a] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#36335e]/20 transition-all transform active:scale-95 flex gap-3"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin text-[#d5a22d]" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-5 h-5 text-[#d5a22d]" />
                            <span>Finalize Review State</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
