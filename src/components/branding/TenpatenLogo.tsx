import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    variant?: 'color' | 'white' | 'monochrome' | 'navy';
}

export function TenpatenIcon({ className, variant = 'color', ...props }: LogoProps) {
    return (
        <img
            src={variant === 'navy' ? "/tenpaten-logo-navy.png" : "/tenpaten-logo.png"}
            alt="Tenpaten Logo"
            className={cn("w-auto h-10 object-contain", className)}
            {...props as any}
        />
    );
}

export function TenpatenLogo({ className, variant = 'white', ...props }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center hover:opacity-90 transition-opacity", className)}>
            <img
                src={variant === 'navy' ? "/tenpaten-logo-navy.png" : "/tenpaten-logo.png"}
                alt="Tenpaten Logo"
                className="h-10 w-auto object-contain"
            />
        </Link>
    );
}
