import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
    return (
        <div className={`p-12 text-center animate-in fade-in duration-500 ${className}`}>
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 border border-slate-100 shadow-sm transition-all hover:scale-110">
                <Icon className="w-10 h-10 text-brand-primary/40" />
            </div>
            <h3 className="text-xl font-black text-brand-primary tracking-tight">{title}</h3>
            <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto text-sm leading-relaxed">
                {description}
            </p>
            {action && (
                <div className="mt-8 flex justify-center">
                    {action}
                </div>
            )}
        </div>
    );
}
