'use client';

import { LucideIcon } from 'lucide-react';

type AchievementBadgeProps = {
    icon: LucideIcon;
    label: string;
    color?: 'blue' | 'purple' | 'green' | 'yellow' | 'indigo' | 'pink' | 'orange';
    locked?: boolean;
    count?: number;
    className?: string;
};

const colorConfig = {
    blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-700',
        lightBg: 'bg-blue-50',
        border: 'border-blue-200',
    },
    purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-700',
        lightBg: 'bg-purple-50',
        border: 'border-purple-200',
    },
    green: {
        bg: 'bg-green-500',
        text: 'text-green-700',
        lightBg: 'bg-green-50',
        border: 'border-green-200',
    },
    yellow: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-700',
        lightBg: 'bg-yellow-50',
        border: 'border-yellow-200',
    },
    indigo: {
        bg: 'bg-indigo-500',
        text: 'text-indigo-700',
        lightBg: 'bg-indigo-50',
        border: 'border-indigo-200',
    },
    pink: {
        bg: 'bg-pink-500',
        text: 'text-pink-700',
        lightBg: 'bg-pink-50',
        border: 'border-pink-200',
    },
    orange: {
        bg: 'bg-orange-500',
        text: 'text-orange-700',
        lightBg: 'bg-orange-50',
        border: 'border-orange-200',
    },
};

export default function AchievementBadge({
    icon: Icon,
    label,
    color = 'blue',
    locked = false,
    count,
    className = '',
}: AchievementBadgeProps) {
    const colors = colorConfig[color];

    if (locked) {
        return (
            <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-400 text-xs font-medium ${className}`}
            >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
            </div>
        );
    }

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.lightBg} border ${colors.border} ${colors.text} text-xs font-medium transition-transform hover:scale-105 ${className}`}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
            {count !== undefined && count > 1 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full ${colors.bg} text-white text-[10px] font-bold`}>
                    +{count}
                </span>
            )}
        </div>
    );
}
