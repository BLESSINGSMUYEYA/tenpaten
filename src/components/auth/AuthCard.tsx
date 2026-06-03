'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

interface AuthCardProps {
    children: ReactNode;
    title: string;
    description: string;
    footerText: string;
    footerLinkText: string;
    footerLinkHref: string;
    decorations?: Array<{ id: number; src: string; class: string; animation: string }>;
}

const defaultAvatars = [
    { id: 1, src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200", class: "top-[15%] -left-36", animation: "animate-[bounce_4s_infinite] delay-100" }, // Woman
    { id: 2, src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=300", class: "top-[5%] -right-28", animation: "animate-[bounce_5s_infinite] delay-300" }, // Woman
    { id: 3, src: "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&q=80&w=200", class: "bottom-[25%] -left-44", animation: "animate-[pulse_6s_infinite] delay-500" }, // Woman
    { id: 4, src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", class: "bottom-[5%] -right-32", animation: "animate-[bounce_4.5s_infinite] delay-700" }, // Man
    { id: 5, src: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200", class: "top-[48%] -right-52", animation: "animate-[pulse_7s_infinite]" }, // Man
];

export function AuthCard({
    children,
    title,
    description,
    footerText,
    footerLinkText,
    footerLinkHref,
    decorations = defaultAvatars
}: AuthCardProps) {
    return (
        <div className="min-h-screen relative flex items-center justify-center bg-linear-to-br from-[#1a1b4d] to-[#12132e] p-4 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-primary/30 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Decorative Elements (Hidden on mobile) */}
                <div className="hidden lg:block absolute inset-0 pointer-events-none -mx-48">
                    {decorations.map((item) => (
                        <div
                            key={item.id}
                            className={`absolute w-24 h-24 rounded-full border-4 border-white shadow-2xl overflow-hidden transition-all duration-700 ${item.class} ${item.animation}`}
                        >
                            <img
                                src={item.src}
                                alt="Decorative avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback to a color if image fails
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${item.id}&background=random`;
                                }}
                            />
                        </div>
                    ))}
                </div>

                <Card className="relative w-full shadow-2xl border-none z-10 bg-white/95 backdrop-blur-xl rounded-2xl scale-100 ring-1 ring-black/5">
                    <CardHeader className="space-y-1 flex flex-col items-center text-center pb-2 pt-8 px-5 sm:pt-10 sm:px-8">
                        <div className="mb-5">
                            <TenpatenLogo variant="color" />
                        </div>
                        {title && <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-tight">{title}</h1>}
                        {description && <p className="text-sm text-gray-500 font-medium max-w-xs">{description}</p>}
                    </CardHeader>
                    <CardContent className="pt-6 px-5 pb-6 sm:px-8 sm:pb-8">
                        {children}
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-gray-50 py-5 sm:py-6 bg-gray-50/30 rounded-b-2xl">
                        <p className="text-sm text-gray-500 font-medium tracking-tight">
                            {footerText}{' '}
                            <Link
                                href={footerLinkHref}
                                className="font-bold text-brand-accent hover:text-[#b89531] hover:underline transition-all"
                            >
                                {footerLinkText}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
