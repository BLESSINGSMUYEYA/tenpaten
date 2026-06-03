'use client';

import { useActionState } from 'react';
import { requestPasswordReset } from '@/lib/actions/password-reset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(
        requestPasswordReset,
        null
    );

    return (
        <div className="min-h-screen bg-white flex flex-col selection:bg-brand-accent/20">

            {/* Minimal top bar */}
            <header className="flex items-center justify-between px-6 sm:px-12 py-6 border-b border-gray-100">
                <TenpatenLogo variant="navy" />
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-[#1a1b41] transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to sign in
                </Link>
            </header>

            {/* Centered form */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-[420px]">

                    {state?.success ? (
                        /* ── Success state ── */
                        <div className="text-center space-y-5">
                            <div className="mx-auto w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-[#1a1b41] tracking-tight">Check your inbox</h2>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{state.success}</p>
                            </div>
                            <Button asChild className="w-full h-12 rounded-xl bg-brand-accent hover:bg-[#b89531] text-white font-bold text-sm transition-all active:scale-95">
                                <Link href="/login">Return to sign in</Link>
                            </Button>
                        </div>
                    ) : (
                        /* ── Form state ── */
                        <>
                            <div className="mb-8 text-center">
                                <h1 className="text-3xl font-black text-[#1a1b41] tracking-tight mb-2">
                                    Reset your password.
                                </h1>
                                <p className="text-gray-400 text-sm font-medium">
                                    Enter your email and we&apos;ll send you a recovery link.
                                </p>
                            </div>

                            <form action={formAction} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-bold text-gray-500 tracking-wide">
                                        Email address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-300 focus:bg-white focus:border-brand-accent focus:ring-0 transition-all text-sm font-medium"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>

                                {state?.error && (
                                    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 border border-red-100 animate-in fade-in duration-300">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <p>{state.error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-12 bg-brand-accent hover:bg-[#b89531] text-white font-bold tracking-wide text-sm rounded-xl transition-all active:scale-[0.98] shadow-md shadow-brand-accent/20"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send recovery link'
                                    )}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
