'use client';

import { useState } from 'react';
import { X, ShieldCheck, CreditCard, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { simulatePaymentSuccess, forceVerifyTransaction } from '@/lib/actions/payments';
import { toast } from 'sonner';

interface PaymentCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionData: {
        transactionId: string;
        referenceId: string;
        totalAmount: number;
        currency: string;
        checkoutUrl?: string | null;
        breakdown?: {
            platformFee: number;
            schoolAmount: number;
            affiliateAmount: number;
        };
    };
    onSuccess: () => void;
}

export default function PaymentCheckoutModal({ isOpen, onClose, transactionData, onSuccess }: PaymentCheckoutModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handlePayNow = async () => {
        if (transactionData.checkoutUrl) {
            // Real Payment: Redirect to PayChangu
            setIsProcessing(true);
            window.location.href = transactionData.checkoutUrl;
            return;
        }

        // Mock Payment: Simulation
        setIsProcessing(true);
        try {
            const result = await simulatePaymentSuccess(transactionData.transactionId);
            if (result.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 2000);
            } else {
                toast.error(result.error || 'Payment failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            const result = await forceVerifyTransaction(transactionData.transactionId);
            if (result.success) {
                toast.success('Payment verified successfully!');
                setIsSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 2000);
            } else {
                toast.error(result.error || 'Payment not verified yet');
            }
        } catch (error) {
            toast.error('Verification failed. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a1b41]/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/40 overflow-hidden relative">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl translate-y-12 -translate-x-12" />

                <div className="p-8 relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#36335e] flex items-center justify-center text-white shadow-lg">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-[#36335e] tracking-tight">Secure Checkout</h2>
                        </div>
                        {!isProcessing && !isSuccess && (
                            <button 
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {!isSuccess ? (
                        <>
                            {/* Order Summary */}
                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Application Fee Summary</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                        <span>Institution Fee</span>
                                        <span>{transactionData.breakdown?.schoolAmount || transactionData.totalAmount} {transactionData.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            Platform Processing 
                                            <ShieldCheck className="w-3 h-3 text-indigo-400" />
                                        </span>
                                        <span>{transactionData.breakdown?.platformFee || 0} {transactionData.currency}</span>
                                    </div>
                                    {transactionData.breakdown && transactionData.breakdown.affiliateAmount > 0 && (
                                        <div className="flex justify-between items-center text-sm font-bold text-emerald-600/80">
                                            <span>Partner Discount Applied</span>
                                            <span>-{transactionData.breakdown.affiliateAmount} {transactionData.currency}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-slate-200 my-4" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-black text-[#36335e]">Total Payable</span>
                                        <span className="text-2xl font-black text-[#36335e]">{transactionData.totalAmount} {transactionData.currency}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Reference */}
                            <div className="flex items-center justify-between px-4 py-3 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl mb-8">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Reference ID</span>
                                <span className="text-xs font-black text-indigo-600 font-mono">{transactionData.referenceId}</span>
                            </div>

                            {/* Payment Notice */}
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 mb-8">
                                <div className="mt-1">
                                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-indigo-900 uppercase">
                                        {transactionData.checkoutUrl ? 'Live Checkout' : 'Simulated Payment'}
                                    </h4>
                                    <p className="text-[11px] text-indigo-700/70 font-medium leading-relaxed">
                                        {transactionData.checkoutUrl 
                                            ? 'You will be redirected to PayChangu to securely complete your payment.' 
                                            : 'You are currently in **Test Mode**. Clicking "Complete Payment" will simulate a successful transaction.'}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <button
                                    onClick={handlePayNow}
                                    disabled={isProcessing || isVerifying}
                                    className="w-full py-5 bg-[#36335e] hover:bg-[#2a284a] text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 group transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Redirecting...
                                        </>
                                    ) : (
                                        <>
                                            Pay & Submit Application
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {transactionData.checkoutUrl && (
                                    <button
                                        onClick={handleVerify}
                                        disabled={isProcessing || isVerifying}
                                        className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs rounded-2xl border border-slate-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                                Verifying Payment...
                                            </>
                                        ) : (
                                            <>
                                                Already Paid? Verify Status
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            
                            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
                                <Lock className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Encrypted SSL Connection</span>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-[#36335e] mb-2 tracking-tight">Payment Successful!</h3>
                            <p className="text-sm text-slate-500 font-medium">Your application is being submitted...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
