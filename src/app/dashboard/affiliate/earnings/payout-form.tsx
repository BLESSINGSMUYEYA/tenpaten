'use client';

import { useState } from 'react';
import { requestAffiliatePayout } from '@/lib/actions/finance';
import { toast } from 'sonner';
import { Loader2, DollarSign, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PayoutRequestForm({ availableBalance, currency }: { availableBalance: number, currency: string }) {
    const [amount, setAmount] = useState<number>(availableBalance);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (amount <= 0 || amount > availableBalance) {
            toast.error('Invalid payout amount');
            return;
        }

        setIsSubmitting(true);
        try {
            await requestAffiliatePayout(amount);
            toast.success('Payout request submitted successfully!');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit payout request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-lg font-black text-[#36335e] mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#d5a22d]" />
                Request Payout
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Amount ({currency})</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            max={availableBalance}
                            min={1}
                            className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-black text-[#36335e] focus:ring-2 focus:ring-[#d5a22d]/20 transition-all placeholder:text-slate-300"
                            placeholder="0.00"
                            required
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-white rounded-lg shadow-sm border border-slate-100 text-[10px] font-black text-[#d5a22d]">
                            MAX: {availableBalance}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/30">
                    <p className="text-[10px] items-center text-indigo-600/70 font-bold leading-relaxed">
                        Payouts are processed within 3-5 business days. Ensure your bank details in your profile are correct.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || availableBalance <= 0}
                    className="w-full h-14 bg-[#36335e] hover:bg-[#2a284a] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:grayscale transform active:scale-95"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Submit Request
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
