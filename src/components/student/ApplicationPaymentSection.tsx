'use client';

import { useState } from 'react';
import { CreditCard, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { initiateApplicationPayment, simulatePaymentSuccess } from '@/lib/actions/payments';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ApplicationPaymentSectionProps {
    applicationId: string;
    universityName: string;
    applicationFee: number;
    currency: string;
    isDevelopment?: boolean;
}

export default function ApplicationPaymentSection({
    applicationId,
    universityName,
    applicationFee,
    currency,
    isDevelopment = false
}: ApplicationPaymentSectionProps) {
    const [isPending, setIsPending] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setIsPending(true);
        try {
            const result = await initiateApplicationPayment(applicationId);
            
            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.noPaymentRequired) {
                toast.success('No payment required for this application.');
                router.refresh();
                return;
            }

            if (result.checkoutUrl) {
                toast.success('Redirecting to payment gateway...');
                window.location.href = result.checkoutUrl;
            } else if (!result.isGatewayConfigured) {
                toast.error('Payment gateway (PayChangu) is not configured in the environment variables.');
            } else {
                toast.error('Could not generate payment link. Please contact support.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    const handleSimulatePayment = async () => {
        setIsSimulating(true);
        try {
            // We need a transaction ID. initiateApplicationPayment creates one.
            const initResult = await initiateApplicationPayment(applicationId);
            
            if (initResult.error) {
                toast.error(initResult.error);
                return;
            }

            if (!initResult.transactionId) {
                toast.error('Could not create transaction for simulation.');
                return;
            }

            const simResult = await simulatePaymentSuccess(initResult.transactionId);
            
            if (simResult.success) {
                toast.success('Simulation successful! Application submitted.');
                router.refresh();
            } else {
                toast.error(simResult.error || 'Simulation failed.');
            }
        } catch (error) {
            console.error('Simulation error:', error);
            toast.error('Simulation failed.');
        } finally {
            setIsSimulating(false);
        }
    };

    return (
        <div className="rounded-[2rem] border-2 border-[#d5a22d] bg-white p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/5 rounded-full blur-2xl -mr-16 -mt-16" />
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#d5a22d] flex items-center justify-center shadow-lg">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#36335e] tracking-tight">Payment Required</h3>
                        <p className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.2em]">Application Fee</p>
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-500">University</span>
                        <span className="text-sm font-black text-[#36335e]">{universityName}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-sm font-bold text-gray-500">Amount Due</span>
                        <span className="text-xl font-black text-[#36335e]">{currency} {applicationFee.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 mb-8 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-xs font-medium text-amber-800 leading-relaxed">
                        Your application is currently pending payment. Once payment is confirmed, your application will be submitted to the country director for review.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handlePayment}
                        disabled={isPending || isSimulating}
                        className="flex items-center justify-center gap-3 w-full px-8 py-5 rounded-2xl bg-[#36335e] hover:bg-[#2a284a] text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay Now
                                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {isDevelopment && (
                        <button
                            onClick={handleSimulatePayment}
                            disabled={isPending || isSimulating}
                            className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-200 font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {isSimulating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Dev: Simulate Payment Success"
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
