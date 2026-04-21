'use client';

import { useState } from 'react';
import { 
    X, 
    DollarSign, 
    ArrowRight, 
    CheckCircle2, 
    AlertCircle,
    Info,
    Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requestPayout } from '@/lib/actions/finance';
import { toast } from 'sonner';

interface PayoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableBalance: number;
    currency: string;
    onSuccess: () => void;
}

export default function PayoutModal({ isOpen, onClose, availableBalance, currency, onSuccess }: PayoutModalProps) {
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (numAmount > availableBalance) {
            toast.error('Requested amount exceeds available balance');
            return;
        }

        setIsSubmitting(true);
        try {
            await requestPayout(numAmount);
            setIsSuccess(true);
            toast.success('Payout request submitted successfully!');
            setTimeout(() => {
                onSuccess();
                onClose();
                setIsSuccess(false);
                setAmount('');
            }, 2000);
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit payout request');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-[#36335e]/40 backdrop-blur-md transition-opacity duration-500 animate-in fade-in"
                onClick={onClose}
            />
            
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-100">
                {/* Header Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                
                <div className="p-8 relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#36335e]">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!isSuccess ? (
                        <>
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-[#36335e] tracking-tight">Request Payout</h3>
                                <p className="text-slate-500 font-medium text-sm mt-1 italic">Transfer your earnings to your registered bank account.</p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex items-center justify-between border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Available for Withdrawal</p>
                                    <p className="text-xl font-black text-[#36335e]">{availableBalance.toLocaleString()} {currency}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                                    <Info className="w-5 h-5" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payout Amount</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <Input 
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="pl-16 h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white text-lg font-black text-[#36335e] transition-all"
                                            required
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">
                                            {currency}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 ml-1">
                                        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Funds will be processed within 3-5 business days.</p>
                                    </div>
                                </div>

                                <Button 
                                    type="submit"
                                    disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                                    className="w-full h-16 rounded-[1.25rem] bg-[#36335e] hover:bg-[#2a284a] text-white font-black text-lg gap-3 shadow-xl shadow-indigo-900/10 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing Request...' : 'Submit Request'}
                                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 scale-110 shadow-lg shadow-emerald-500/10">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-[#36335e] tracking-tight mb-2">Request Successful!</h3>
                            <p className="text-slate-500 font-medium italic mb-2">We've received your payout request.</p>
                            <div className="inline-block px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                                <p className="text-[10px] font-black text-[#36335e] uppercase tracking-[0.2em]">{amount} {currency} • PENDING APPROVAL</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
