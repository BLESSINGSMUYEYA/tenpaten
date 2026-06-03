'use client';

import { useActionState, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/actions/password-reset';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LockKeyhole, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [state, formAction, isPending] = useActionState(
        resetPassword,
        null
    );
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!token) {
        return (
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Link</h3>
                <p className="text-sm text-gray-500 mb-6">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Button asChild className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-xl">
                    <Link href="/forgot-password">Request new link</Link>
                </Button>
            </div>
        );
    }

    if (state?.success) {
        return (
            <div className="text-center space-y-4 py-4">
                <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Password Reset Successful</h3>
                <p className="text-sm text-gray-500">{state.success}</p>
                <Button asChild className="w-full mt-4 h-11 rounded-xl bg-linear-to-r from-brand-primary to-brand-primary-hover text-white">
                    <Link href="/login">Go to login</Link>
                </Button>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-5">
            <input type="hidden" name="token" value={token} />
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            placeholder="At least 6 characters"
                            className="pl-10 pr-10 h-11"
                            disabled={isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 h-11"
                            disabled={isPending}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
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
                className="w-full h-11 bg-linear-to-r from-brand-primary to-brand-primary-hover hover:from-brand-primary-hover hover:to-brand-primary text-white transition-all font-semibold rounded-xl shadow-lg shadow-brand-primary/20"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting password...
                    </>
                ) : (
                    'Reset password'
                )}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex bg-white sm:bg-gray-50/50">
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-[400px]">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create new password</h2>
                        <p className="text-gray-500">
                            Your new password must be different from previous used passwords.
                        </p>
                    </div>

                    <div className="bg-white sm:shadow-xl sm:shadow-gray-200/50 sm:border border-gray-100 sm:rounded-2xl p-6 sm:p-8">
                        <Suspense fallback={
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                            </div>
                        }>
                            <ResetPasswordForm />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
