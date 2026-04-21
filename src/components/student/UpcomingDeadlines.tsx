'use client';

import { Clock, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Deadline {
    id: string;
    title: string;
    date: Date;
    type: 'application' | 'document' | 'interview' | 'decision';
    applicationId?: string;
    daysUntil: number;
}

interface UpcomingDeadlinesProps {
    deadlines: Deadline[];
}

export default function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
    if (deadlines.length === 0) {
        return (
            <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                </div>
                <p className="text-sm text-gray-500 text-center py-8">
                    No upcoming deadlines. You're all caught up! 🎉
                </p>
            </div>
        );
    }

    const getUrgencyColor = (daysUntil: number) => {
        if (daysUntil <= 3) return 'red';
        if (daysUntil <= 7) return 'yellow';
        return 'green';
    };

    const getUrgencyStyles = (color: string) => {
        switch (color) {
            case 'red':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-700',
                    badge: 'bg-red-100 text-red-700',
                    icon: 'text-red-600',
                };
            case 'yellow':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    text: 'text-yellow-700',
                    badge: 'bg-yellow-100 text-yellow-700',
                    icon: 'text-yellow-600',
                };
            default:
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-700',
                    badge: 'bg-green-100 text-green-700',
                    icon: 'text-green-600',
                };
        }
    };

    const formatDate = (date: Date | string) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(date));
    };

    return (
        <div className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                    <p className="text-xs text-gray-500">{deadlines.length} deadline{deadlines.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="space-y-3">
                {deadlines.slice(0, 5).map((deadline) => {
                    const urgencyColor = getUrgencyColor(deadline.daysUntil);
                    const styles = getUrgencyStyles(urgencyColor);

                    return (
                        <div
                            key={deadline.id}
                            className={`rounded-lg border ${styles.border} ${styles.bg} p-4 transition-all hover:shadow-md`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center`}>
                                    {deadline.daysUntil <= 3 ? (
                                        <AlertCircle className={`w-4 h-4 ${styles.icon}`} />
                                    ) : (
                                        <Clock className={`w-4 h-4 ${styles.icon}`} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                                            {deadline.title}
                                        </h4>
                                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${styles.badge}`}>
                                            {deadline.daysUntil === 0
                                                ? 'Today'
                                                : deadline.daysUntil === 1
                                                    ? 'Tomorrow'
                                                    : `${deadline.daysUntil} days`}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">
                                        {formatDate(deadline.date)}
                                    </p>
                                    {deadline.applicationId && (
                                        <Link
                                            href={`/dashboard/applications/${deadline.applicationId}`}
                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                                        >
                                            View Application →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {deadlines.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                        href="/dashboard/applications"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        View all {deadlines.length} deadlines →
                    </Link>
                </div>
            )}
        </div>
    );
}
