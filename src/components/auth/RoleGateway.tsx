'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { GraduationCap, Building2, ArrowRight, ChevronLeft } from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

export type RoleType = 'student' | 'school' | null;

interface RoleGatewayProps {
    /** Which mode: 'login' shows "Sign In" copy, 'register' shows "Sign Up" copy */
    mode: 'login' | 'register';
    /** Currently selected role — when null, the picker is shown */
    selectedRole: RoleType;
    onSelectRole: (role: RoleType) => void;
    /** The actual form to render once a role is chosen */
    children?: ReactNode;
}

const roles = [
    {
        id: 'student' as const,
        icon: GraduationCap,
        label: 'Student',
        description: 'Discover and apply to universities worldwide',
        gradient: 'from-[#36335e] to-[#4f4b8a]',
        ring: 'ring-[#36335e]',
        badge: 'bg-[#36335e]/10 text-[#36335e]',
    },
    {
        id: 'school' as const,
        icon: Building2,
        label: 'School / Institution',
        description: 'Manage student applications and scholarships',
        gradient: 'from-[#d5a22d] to-[#b88e24]',
        ring: 'ring-[#d5a22d]',
        badge: 'bg-[#d5a22d]/10 text-[#d5a22d]',
    },
];

export function RoleGateway({ mode, selectedRole, onSelectRole, children }: RoleGatewayProps) {
    const isLogin = mode === 'login';

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#1a1b4d] to-[#12132e] p-4 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#d5a22d]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#36335e]/30 rounded-full blur-[120px]" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <TenpatenLogo variant="white" />
                </div>

                {/* PICKER STATE */}
                {!selectedRole && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                                {isLogin ? 'Welcome back' : 'Join Tenpaten'}
                            </h1>
                            <p className="text-white/50 text-sm font-medium">
                                {isLogin ? 'Who are you signing in as?' : 'Who are you signing up as?'}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                // For login, school goes to /school/login; for register, school goes to /school/register
                                const schoolHref = isLogin ? '/school/login' : '/school/register';

                                return role.id === 'school' ? (
                                    <Link
                                        key={role.id}
                                        href={schoolHref}
                                        className={`group relative flex items-center gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:ring-2 ${role.ring} hover:ring-opacity-40 transition-all duration-300 cursor-pointer`}
                                    >
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white font-bold text-lg">{role.label}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${role.badge}`}>
                                                    Institution
                                                </span>
                                            </div>
                                            <p className="text-white/50 text-sm leading-relaxed">{role.description}</p>
                                        </div>
                                        <ArrowRight className="flex-shrink-0 w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ) : (
                                    <button
                                        key={role.id}
                                        onClick={() => onSelectRole(role.id)}
                                        className={`group relative flex items-center gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:ring-2 ${role.ring} hover:ring-opacity-40 transition-all duration-300 cursor-pointer text-left w-full`}
                                    >
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white font-bold text-lg">{role.label}</span>
                                            </div>
                                            <p className="text-white/50 text-sm leading-relaxed">{role.description}</p>
                                        </div>
                                        <ArrowRight className="flex-shrink-0 w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer links */}
                        <div className="mt-8 space-y-4 text-center">
                            <p className="text-white/40 text-sm font-medium">
                                {isLogin ? (
                                    <>
                                        Don&apos;t have an account?{' '}
                                        <Link href="/register" className="text-[#d5a22d] hover:text-[#f0b830] font-bold transition-colors">
                                            Sign up
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-[#d5a22d] hover:text-[#f0b830] font-bold transition-colors">
                                            Sign in
                                        </Link>
                                    </>
                                )}
                            </p>
                            
                        </div>
                    </div>
                )}
                {/* FORM STATE — student selected */}
                {selectedRole === 'student' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-400">
                        {/* Back button */}
                        <button
                            onClick={() => onSelectRole(null)}
                            className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium mb-6 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Back
                        </button>

                        {/* Role badge */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#36335e] to-[#4f4b8a] flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white/70 text-sm font-medium">
                                Student {isLogin ? 'Sign In' : 'Sign Up'}
                            </span>
                        </div>

                        {/* Actual form card */}
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                            <div className="px-6 pt-8 pb-2 sm:px-8">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                                    {isLogin ? 'Sign in to your account' : 'Create your account'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {isLogin ? 'Enter your credentials to continue' : 'Start your journey to top universities'}
                                </p>
                            </div>
                            <div className="px-6 py-6 sm:px-8">
                                {children}
                            </div>
                            {selectedRole === 'student' && (
                                <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 sm:px-8">
                                    <p className="text-sm text-gray-500 text-center font-medium">
                                        {isLogin ? (
                                            <>
                                                New student?{' '}
                                                <Link href="/register?type=student" className="font-bold text-[#d5a22d] hover:text-[#b89531] hover:underline transition-all">
                                                    Create an account
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                Already have an account?{' '}
                                                <Link href="/login" className="font-bold text-[#d5a22d] hover:text-[#b89531] hover:underline transition-all">
                                                    Sign in
                                                </Link>
                                            </>
                                        )}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
