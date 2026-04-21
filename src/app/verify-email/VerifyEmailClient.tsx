'use client';

import React, { useState, useEffect, useRef, useActionState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmailOTP, resendVerificationOTP } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, ArrowRight, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function VerifyEmailClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { update } = useSession();
    
    const email = searchParams.get('email') || '';
    const callbackUrl = searchParams.get('callbackUrl') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isResending, setIsResending] = useState(false);
    const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [state, formAction, isPending] = useActionState(
        verifyEmailOTP,
        null,
    );

    // Orchestrate session update and redirect
    useEffect(() => {
        if (state?.success && state.targetPath) {
            const syncSessionAndRedirect = async () => {
                try {
                    // Trigger a session refresh to update the JWT cookie with emailVerified: now
                    // This will execute the 'jwt' callback on the server (the one with Prisma access)
                    await update();
                    
                    // Small delay to ensure cookie is written before middleware check
                    await new Promise(resolve => setTimeout(resolve, 800));
                    
                    // Finally navigate
                    router.push(state.targetPath as string);
                } catch (error) {
                    console.error('Session update failed:', error);
                    // Fallback redirect anyway
                    router.push(state.targetPath as string);
                }
            };
            syncSessionAndRedirect();
        }
    }, [state, update, router]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;
        
        const newOtp = [...otp];
        // Allow pasting multiple digits
        if (value.length > 1) {
            const pasted = value.slice(0, 6).split('');
            for (let i = 0; i < pasted.length; i++) {
                if (index + i < 6) newOtp[index + i] = pasted[i];
            }
            setOtp(newOtp);
            // Focus on next empty or last input
            const nextIndex = Math.min(index + pasted.length, 5);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (timeLeft > 0 || isResending) return;
        
        setIsResending(true);
        setResendStatus(null);
        try {
            const result = await resendVerificationOTP(email);
            if (result?.error) {
                setResendStatus({ type: 'error', message: result.error });
            } else {
                setResendStatus({ type: 'success', message: 'Verification code resent successfully!' });
                setTimeLeft(60);
            }
        } catch (error) {
            setResendStatus({ type: 'error', message: 'Failed to resend code.' });
        } finally {
            setIsResending(false);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');
    const combinedOtp = otp.join('');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Secure Channel Badge */}
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100/50">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Secure Verification Channel</p>
                    <p className="text-xs font-bold text-indigo-900">
                        {email ? `Code sent to ${email}` : 'Waiting for email address...'}
                    </p>
                </div>
            </div>

            <form action={formAction} className="space-y-10">
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="otp" value={combinedOtp} />
                <input type="hidden" name="callbackUrl" value={callbackUrl} />

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                        Enter 6-Digit Code
                    </label>
                    <div className="flex gap-2 sm:gap-3 justify-between">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={isPending || !email || state?.success}
                                className="w-full h-16 sm:h-20 text-center text-3xl font-black border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all bg-slate-50/50 text-[#36335e] shadow-sm placeholder:text-slate-200"
                                aria-label={`Digit ${index + 1}`}
                                placeholder="0"
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col space-y-6">
                    <Button
                        type="submit"
                        className="w-full h-16 bg-[#36335e] hover:bg-[#2a284a] text-white transition-all font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-3 group disabled:opacity-50"
                        disabled={isPending || !isOtpComplete || !email || state?.success}
                    >
                        {isPending || state?.success ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {state?.success ? 'Refreshing Session...' : 'Verifying Security Code...'}
                            </>
                        ) : (
                            <>
                                Verify & Continue
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={timeLeft > 0 || isResending || !email || state?.success}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#36335e] disabled:opacity-50 disabled:hover:text-slate-400 flex items-center justify-center transition-all group h-10"
                    >
                        {isResending ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-2" />
                        ) : (
                            <RefreshCcw className="w-3 h-3 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        )}
                        {timeLeft > 0 ? `Resend Available in ${timeLeft}s` : 'Resend Code Now'}
                    </button>
                </div>

                <div aria-live="polite" aria-atomic="true">
                    {state?.error && (
                        <div className="flex w-full items-center gap-3 rounded-2xl bg-rose-50 p-4 text-xs font-bold text-rose-600 border border-rose-100 animate-in shake-in duration-300">
                            <AlertCircle className="h-4 w-4 min-w-[16px]" />
                            <p>{state.error}</p>
                        </div>
                    )}
                    {resendStatus && (
                        <div className={`flex w-full items-center gap-3 rounded-2xl p-4 text-xs font-bold animate-in slide-in-from-top-2 ${resendStatus.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                            <AlertCircle className="h-4 w-4 min-w-[16px]" />
                            <p>{resendStatus.message}</p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
