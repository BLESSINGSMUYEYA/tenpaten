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
        <div className="min-h-screen flex bg-white sm:bg-gray-50/50">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[400px]">
                    
                    <div className="mb-8">
                        <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to login
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset your password</h2>
                        <p className="text-gray-500">
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <div className="bg-white sm:shadow-xl sm:shadow-gray-200/50 sm:border border-gray-100 sm:rounded-2xl p-6 sm:p-8">
                        {state?.success ? (
                            <div className="text-center space-y-4 py-4">
                                <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                                <p className="text-sm text-gray-500">{state.success}</p>
                                <Button asChild className="w-full mt-4 h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white">
                                    <Link href="/login">Return to login</Link>
                                </Button>
                            </div>
                        ) : (
                            <form action={formAction} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            className="pl-10 h-11"
                                            disabled={isPending}
                                        />
                                    </div>
                                </div>

                                {state?.error && (
                                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <p>{state.error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-11 bg-gradient-to-r from-[#36335e] to-[#2a284a] hover:from-[#2a284a] hover:to-[#36335e] text-white transition-all font-semibold rounded-xl shadow-lg shadow-[#36335e]/20"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending reset link...
                                        </>
                                    ) : (
                                        'Send reset link'
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
