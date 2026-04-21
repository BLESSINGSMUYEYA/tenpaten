import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    variant?: 'color' | 'white' | 'monochrome';
}

export function TenpatenIcon({ className, variant = 'color', ...props }: LogoProps) {
    return (
        <img
            src="/tenpaten-logo.png"
            alt="Tenpaten Logo"
            className={cn("w-auto h-10 object-contain", className)}
            {...props as any}
        />
    );
}

export function TenpatenLogo({ className, variant = 'color', ...props }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <img
                src="/tenpaten-logo.png"
                alt="Tenpaten Logo"
                className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col">
                <span className={cn(
                    "text-xl font-black leading-none tracking-tight font-heading",
                    variant === 'white' ? "text-white" : "text-[#36335e]"
                )}>
                    Tenpaten Apply
                </span>
                <span className={cn(
                    "text-[9px] font-bold mt-1 uppercase tracking-[0.3em] font-sans",
                    variant === 'white' ? "text-[#d5a22d]" : "text-[#d5a22d]"
                )}>
                    Education Platform
                </span>
            </div>
        </div>
    );
}
