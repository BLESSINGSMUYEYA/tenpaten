import React from 'react';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function DashboardCard({ children, className, ...props }: DashboardCardProps) {
    return (
        <div
            className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden ${className || ''}`}
            {...props}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/10 rounded-full blur-3xl -translate-y-12 translate-x-8 mix-blend-multiply pointer-events-none" />
            {children}
        </div>
    );
}
