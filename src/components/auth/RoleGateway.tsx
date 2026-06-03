'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

export type RoleType = 'student' | 'school' | null;

interface RoleGatewayProps {
    mode: 'login' | 'register';
    selectedRole: RoleType;
    onSelectRole: (role: RoleType) => void;
    children?: ReactNode;
}

export function RoleGateway({ mode, selectedRole, onSelectRole, children }: RoleGatewayProps) {
    const isLogin = mode === 'login';

    return (
        <div className="min-h-screen bg-white flex flex-col selection:bg-brand-accent/20">

            {/* ── Minimal top bar ── */}
            <header className="flex items-center justify-between px-6 sm:px-12 py-6 border-b border-gray-100">
                <TenpatenLogo variant="navy" />
                <p className="text-sm text-gray-400 font-medium">
                    {isLogin ? (
                        <>
                            No account?{' '}
                            <Link href="/register?type=student" className="text-brand-accent font-bold hover:underline">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have one?{' '}
                            <Link href="/login" className="text-brand-accent font-bold hover:underline">
                                Sign in
                            </Link>
                        </>
                    )}
                </p>
            </header>

            {/* ── Centered form area ── */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-[420px]">

                    {/* Headline */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-black text-[#1a1b41] tracking-tight mb-2">
                            {isLogin ? 'Welcome back.' : 'Create your account.'}
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {isLogin
                                ? 'Sign in to access your Tenpaten dashboard.'
                                : 'Free forever. No credit card needed.'}
                        </p>
                    </div>



                    {/* The form */}
                    <div className="space-y-4">
                        {children}
                    </div>

                    {/* Divider + legal */}
                    <p className="mt-8 text-center text-xs text-gray-300 font-medium leading-relaxed">
                        By continuing, you agree to Tenpaten&apos;s{' '}
                        <Link href="/terms" className="text-gray-400 hover:text-[#1a1b41] underline">Terms</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-gray-400 hover:text-[#1a1b41] underline">Privacy Policy</Link>.
                    </p>
                </div>
            </main>
        </div>
    );
}
