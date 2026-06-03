'use client';

import { FileEdit, Upload, MessageCircle, Users, Zap } from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    color: string;
    count?: number;
}

interface QuickActionsProps {
    draftCount?: number;
    pendingDocuments?: number;
    unreadMessages?: number;
    showAffiliate?: boolean;
}

export default function QuickActions({
    draftCount = 0,
    pendingDocuments = 0,
    unreadMessages = 0,
    showAffiliate = false
}: QuickActionsProps) {
    const actions: QuickAction[] = [
        {
            icon: <FileEdit className="w-5 h-5" />,
            title: 'Resume Drafts',
            description: 'Continue your applications',
            href: '/dashboard/applications?filter=draft',
            color: 'indigo',
            count: draftCount,
        },
        {
            icon: <Upload className="w-5 h-5" />,
            title: 'Upload Documents',
            description: 'Add required files',
            href: '/dashboard/applications',
            color: 'purple',
            count: pendingDocuments,
        },
        {
            icon: <MessageCircle className="w-5 h-5" />,
            title: 'Messages',
            description: 'View notifications',
            href: '/dashboard/messages',
            color: 'blue',
            count: unreadMessages,
        },
        ...(showAffiliate ? [{
            icon: <Users className="w-5 h-5" />,
            title: 'Refer & Earn',
            description: 'Share with friends',
            href: '/dashboard/affiliate',
            color: 'green',
        }] : []),
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; hover: string; text: string; badge: string }> = {
            indigo: {
                bg: 'bg-indigo-50',
                hover: 'hover:bg-indigo-100',
                text: 'text-indigo-600',
                badge: 'bg-indigo-600 text-white',
            },
            purple: {
                bg: 'bg-purple-50',
                hover: 'hover:bg-purple-100',
                text: 'text-purple-600',
                badge: 'bg-purple-600 text-white',
            },
            blue: {
                bg: 'bg-blue-50',
                hover: 'hover:bg-blue-100',
                text: 'text-blue-600',
                badge: 'bg-blue-600 text-white',
            },
            green: {
                bg: 'bg-green-50',
                hover: 'hover:bg-green-100',
                text: 'text-green-600',
                badge: 'bg-green-600 text-white',
            },
        };
        return colors[color] || colors.indigo;
    };

    return (
        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    <p className="text-xs text-gray-500">Common tasks at your fingertips</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {actions.map((action, index) => {
                    const colors = getColorClasses(action.color);
                    return (
                        <Link
                            key={index}
                            href={action.href}
                            className={`group relative rounded-lg ${colors.bg} ${colors.hover} p-4 transition-all hover:shadow-md border border-transparent hover:border-gray-200`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform`}>
                                    {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900">
                                            {action.title}
                                        </h4>
                                        {action.count !== undefined && action.count > 0 && (
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colors.badge}`}>
                                                {action.count}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
