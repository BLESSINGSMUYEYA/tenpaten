import React from 'react';

interface PageHeaderProps {
    title: string;
    preTitle?: React.ReactNode;
    subtitle?: React.ReactNode;
    action?: React.ReactNode;
}

export function PageHeader({ title, preTitle, subtitle, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 relative z-10">
            <div className="space-y-4">
                {preTitle}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#36335e] tracking-tight leading-tight">{title}</h1>
                {subtitle && <p className="text-slate-500 font-bold text-sm sm:text-base italic">{subtitle}</p>}
            </div>
            {action && (
                <div className="flex flex-wrap items-center gap-4">
                    {action}
                </div>
            )}
        </div>
    );
}
