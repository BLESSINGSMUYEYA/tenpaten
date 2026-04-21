'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    Bell, CheckCircle2, AlertTriangle, XCircle, Info, 
    Filter, CheckCheck, ChevronLeft, ChevronRight, Search, 
    MoreVertical, ExternalLink, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { 
    getNotificationsPaginated, 
    markAsRead, 
    markAllAsRead 
} from '@/app/actions/notificationActions';
import { format } from 'date-fns';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link: string | null;
    createdAt: Date;
};

export default function NotificationsClient() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const loadNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getNotificationsPaginated(currentPage, filter);
            setNotifications(result.notifications as any);
            setTotal(result.total);
            setPages(result.pages);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, filter]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleMarkRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        await markAsRead(id);
    };

    const handleMarkAllRead = async () => {
        setIsActionLoading(true);
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } finally {
            setIsActionLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBgColor = (read: boolean) => {
        return read ? 'bg-white' : 'bg-indigo-50/30';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#1d1b41] tracking-tight mb-2">Notifications</h1>
                    <p className="text-slate-500 font-medium text-sm">Stay updated with your activities and application status.</p>
                </div>
                <button
                    onClick={handleMarkAllRead}
                    disabled={isActionLoading || !notifications.some(n => !n.read)}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#d5a22d] hover:bg-[#b88e24] disabled:opacity-50 disabled:hover:bg-[#d5a22d] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#d5a22d]/20 transition-all active:scale-95"
                >
                    <CheckCheck className="w-4 h-4" />
                    {isActionLoading ? 'Processing...' : 'Mark all read'}
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'SUCCESS', label: 'Success' },
                    { id: 'INFO', label: 'Info' },
                    { id: 'WARNING', label: 'Warnings' },
                    { id: 'ERROR', label: 'Errors' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setFilter(item.id); setCurrentPage(1); }}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            filter === item.id 
                            ? 'bg-[#1d1b41] text-white shadow-lg shadow-[#1d1b41]/20' 
                            : 'text-slate-500 hover:bg-gray-50'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-[#1d1b41]/5 overflow-hidden">
                {isLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-[#d5a22d] rounded-full animate-spin" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-200">
                            <Bell className="w-10 h-10" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#1d1b41] tracking-tight">All caught up!</h3>
                            <p className="text-slate-400 font-medium text-sm mt-1">No notifications match your current filter.</p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((n) => (
                            <div 
                                key={n.id} 
                                className={`relative group p-6 transition-all hover:bg-gray-50/80 ${getBgColor(n.read)}`}
                            >
                                <div className="flex gap-4 sm:gap-6">
                                    <div className="mt-1 flex-shrink-0">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                                            {getIcon(n.type)}
                                        </div>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
                                            <h4 className={`text-base tracking-tight ${n.read ? 'text-slate-700 font-bold' : 'text-[#1d1b41] font-black'}`}>
                                                {n.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(n.createdAt), 'MMM dd, yyyy · HH:mm')}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
                                            {n.message}
                                        </p>
                                        
                                        <div className="flex flex-wrap items-center gap-4">
                                            {n.link && (
                                                <Link
                                                    href={n.link}
                                                    onClick={() => !n.read && handleMarkRead(n.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    View Details
                                                </Link>
                                            )}
                                            {!n.read && (
                                                <button
                                                    onClick={() => handleMarkRead(n.id)}
                                                    className="text-[10px] font-black text-[#d5a22d] hover:text-[#b88e24] uppercase tracking-widest transition-colors flex items-center gap-1.5"
                                                >
                                                    <CheckCheck className="w-3.5 h-3.5" />
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {!n.read && (
                                        <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-[#d5a22d] rounded-full shadow-lg shadow-[#d5a22d]/40 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Footer */}
                {pages > 1 && (
                    <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing page {currentPage} of {pages}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1 || isLoading}
                                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-[#1d1b41] hover:text-white disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(pages, prev + 1))}
                                disabled={currentPage === pages || isLoading}
                                className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-slate-600 hover:bg-[#1d1b41] hover:text-white disabled:opacity-50 transition-all shadow-sm"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
