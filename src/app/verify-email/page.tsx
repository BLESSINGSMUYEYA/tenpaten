import React, { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';
import { Metadata } from 'next';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Verify Your Email | Tenpaten Apply',
    description: 'Verify your Tenpaten account email address',
};

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col selection:bg-[#d5a22d]/20">

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

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-[#1a1b41] tracking-tight mb-2">
                            Check your email.
                        </h1>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            We&apos;ve sent a 6-digit verification code to your email address. Enter it below to continue.
                        </p>
                    </div>

                    {/* Verification form */}
                    <Suspense fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-xl" />}>
                        <VerifyEmailClient />
                    </Suspense>

                    <p className="mt-8 text-center text-xs text-gray-300 font-medium">
                        Didn&apos;t receive it? Check your spam folder or{' '}
                        <Link href="/register?type=student" className="text-gray-400 hover:text-[#1a1b41] underline">
                            try again
                        </Link>.
                    </p>
                </div>
            </main>
        </div>
    );
}
