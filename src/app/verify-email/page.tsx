import React, { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';
import { Metadata } from 'next';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Verify Your Email | Tenpaten Apply',
    description: 'Verify your Tenpaten account email address',
};

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            {/* Left Side - Brand Pattern */}
            <div className="hidden lg:flex bg-[#36335e] flex-col justify-between p-12 relative overflow-hidden">
                {/* Abstract Patterns */}
                <div className="absolute inset-0 opacity-10" 
                    style={{ 
                        backgroundImage: `radial-gradient(#d5a22d 1px, transparent 1px)`, 
                        backgroundSize: '24px 24px' 
                    }} 
                />
                
                <div className="relative z-10">
                    <TenpatenLogo variant="white" className="mb-12" />
                    
                    <div className="relative group mb-12">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 to-transparent blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-3xl shadow-2xl shadow-black/40 border border-white/10">
                            <Image 
                                src="/images/verification-hero.png" 
                                alt="Verification illustration" 
                                fill 
                                className="object-cover transform group-hover:scale-105 transition-transform duration-[2000ms]"
                            />
                        </div>
                    </div>

                    <h2 className="text-4xl font-black tracking-tight text-white mb-6 leading-tight">
                        Securing your <br />
                        <span className="text-[#d5a22d]">Global Future.</span>
                    </h2>
                    <p className="text-indigo-100/70 text-lg max-w-md font-medium leading-relaxed">
                        Email verification is the first step in ensuring your international education journey remains private and secure.
                    </p>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#36335e] bg-indigo-200" />
                        ))}
                    </div>
                    <p className="text-xs text-indigo-200 font-medium">Joined by 10,000+ students worldwide</p>
                </div>
            </div>

            {/* Right Side - Verify Form */}
            <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-32 py-12">
                <div className="lg:hidden mb-12">
                    <TenpatenLogo />
                </div>

                <div className="w-full max-w-md mx-auto sm:mx-0">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">Check your email</h1>
                        <p className="text-gray-500 font-light leading-relaxed">
                            We&apos;ve sent a secure 6-digit code to your email address. Enter it below to verify your account.
                        </p>
                    </div>

                    <Suspense fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-lg"></div>}>
                        <VerifyEmailClient />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
