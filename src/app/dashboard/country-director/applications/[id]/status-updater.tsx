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
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function StatusUpdater({ applicationId, currentStatus }: { applicationId: string, currentStatus: string }) {
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
                alert('Status updated successfully');
                setNote('');
                router.refresh();
            } else {
                alert(result.error || 'Failed to update status');
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-semibold">Application Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status" className="w-full bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Workflow States</SelectLabel>
                                {statuses.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full 
                                                ${s === 'REJECTED' ? 'bg-rose-500' :
                                                    s === 'ENROLLED' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                                            {s.replace('_', ' ')}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        Changing status will notify the student and university admin.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="note" className="text-sm font-semibold">Decision Note (Optional)</Label>
                    <Textarea
                        id="note"
                        placeholder="Explain the reason for this status change..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[80px] bg-slate-50 border-slate-200 text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button
                    onClick={handleUpdate}
                    disabled={loading || (status === currentStatus && !note)}
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                    {loading ? 'Processing...' : (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm Review Change
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

