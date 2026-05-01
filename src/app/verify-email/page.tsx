import React, { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';
import { Metadata } from 'next';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Verify Your Email | Tenpaten Apply',
    description: 'Verify your Tenpaten account email address',
};

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc]">
            {/* Left Column: Branding & Value Prop */}
            <div className="hidden lg:flex lg:w-[40%] xl:w-[35%] bg-[#1a1b41] relative overflow-hidden flex-col justify-between p-12 xl:p-16">
                {/* Background decorative elements */}
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#d5a22d]/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#36335e]/40 rounded-full blur-[100px]" />
                
                {/* Logo Section */}
                <div className="relative z-10">
                    <TenpatenLogo variant="white" className="scale-125 origin-left" />
                </div>

                {/* Content Section */}
                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                            Secure <br />
                            <span className="text-[#d5a22d]">Global</span> <br />
                            Access.
                        </h1>
                        <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm">
                            Email verification is the first step in ensuring your international education journey remains private and secure.
                        </p>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-white/10">
                        {[
                            { title: 'Bank-Grade Security', desc: 'Your data is encrypted and protected' },
                            { title: 'Verified Institutions', desc: 'Connect safely with authentic universities' },
                            { title: 'Privacy First', desc: 'You control who sees your application' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#d5a22d]/20 transition-all">
                                    <ShieldCheck className="w-4 h-4 text-[#d5a22d]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-white/40 text-xs font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer text */}
                <div className="relative z-10">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                        &copy; {new Date().getFullYear()} Tenpaten Apply. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Column: Verification Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 relative">
                {/* Mobile Logo Only */}
                <div className="lg:hidden mb-12">
                    <TenpatenLogo variant="navy" />
                </div>

                <div className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {/* Form Header */}
                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 border border-[#d5a22d]/20 text-[#d5a22d] text-[10px] font-black tracking-widest uppercase mb-4">
                            Security Check
                        </div>
                        <h2 className="text-4xl font-black text-[#1a1b41] tracking-tighter uppercase mb-3">
                            Verify Email
                        </h2>
                        <p className="text-gray-500 font-medium">
                            We've sent a secure 6-digit code to your email address. Enter it below to verify your account.
                        </p>
                    </div>

                    {/* The Form Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(26,27,65,0.08)] border border-gray-100/50 p-8 sm:p-10">
                        <Suspense fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-lg"></div>}>
                            <VerifyEmailClient />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
