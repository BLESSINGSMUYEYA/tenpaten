'use client';

import { useActionState, useState } from 'react';
import { requestPasswordReset } from '@/lib/actions/password-reset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(
        requestPasswordReset,
        null
    );

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#1a1b4d] to-[#12132e] p-4 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#d5a22d]/20 rounded-full blur-[150px] animate-pulse duration-[10s]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#36335e]/40 rounded-full blur-[150px] animate-pulse duration-[8s] delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(54,51,94,0.1)_0%,transparent_70%)]" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                    <Link href="/login" className="inline-flex items-center text-sm text-white/50 hover:text-white transition-all mb-6 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to login
                    </Link>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Reset password</h2>
                    <p className="text-white/50 text-sm font-medium">
                        Enter your email and we&apos;ll send you a recovery link.
                    </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl ring-1 ring-black/5 p-8 sm:p-10">
                    {state?.success ? (
                        <div className="text-center space-y-6 py-4">
                            <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">Check your inbox</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{state.success}</p>
                            </div>
                            <Button asChild className="w-full h-14 rounded-2xl bg-[#36335e] hover:bg-[#2a284a] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#36335e]/20 transition-all active:scale-95">
                                <Link href="/login">Return to sign in</Link>
                            </Button>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#36335e] transition-colors" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#36335e]/10 focus:border-[#36335e] transition-all font-medium"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            {state?.error && (
                                <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 animate-in fade-in zoom-in duration-300">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <p>{state.error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-14 bg-[#36335e] hover:bg-[#2a284a] text-white transition-all font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-[#36335e]/20 active:scale-[0.98]"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Send recovery link'
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
