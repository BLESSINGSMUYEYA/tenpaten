'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Info, AlertTriangle, XCircle, CheckCircle, BellRing, Check } from 'lucide-react';
import Link from 'next/link';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/app/actions/notificationActions';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/lib/pusher-client';

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link: string | null;
    createdAt: Date;
};

type ToastNotif = {
    id: string;
    title: string;
    message: string;
    type: string;
};

export default function NotificationBell() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [bellShake, setBellShake] = useState(false);
    const [toast, setToast] = useState<ToastNotif | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial unread count + Pusher subscription
    useEffect(() => {
        if (!session?.user?.id) return;
        fetchUnreadCount();

        if (pusherClient) {
            const channel = pusherClient.subscribe(`user-${session.user.id}`);
            channel.bind('new-notification', (newNotif: Notification) => {
                setNotifications(prev => {
                    if (prev.find(n => n.id === newNotif.id)) return prev;
                    return [newNotif, ...prev];
                });
                setUnreadCount(prev => prev + 1);
                // Shake the bell
                setBellShake(true);
                setTimeout(() => setBellShake(false), 1000);
                // Show mini toast
                setToast({ id: newNotif.id, title: newNotif.title, message: newNotif.message, type: newNotif.type });
                setTimeout(() => setToast(null), 5000);
            });
            return () => { pusherClient?.unsubscribe(`user-${session.user.id}`); };
        }
    }, [session?.user?.id]);

    // Fetch full list when dropdown opens
    useEffect(() => {
        if (isOpen) fetchNotifications();
    }, [isOpen]);

    const fetchUnreadCount = async () => {
        try { setUnreadCount(await getUnreadCount()); } catch {}
    };

    const fetchNotifications = async () => {
        setIsLoading(true);
        try { setNotifications(await getNotifications(15)); } catch {}
        finally { setIsLoading(false); }
    };

    const handleMarkAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        await markAsRead(id);
    };

    const handleMarkAllRead = async () => {
        setIsMarkingAll(true);
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } finally { setIsMarkingAll(false); }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
            case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
            case 'ERROR': return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
            default: return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
        }
    };

    const getToastColor = (type: string) => {
        switch (type) {
            case 'SUCCESS': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
            case 'WARNING': return 'bg-amber-50 border-amber-200 text-amber-800';
            case 'ERROR': return 'bg-red-50 border-red-200 text-red-800';
            default: return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <>
            {/* Mini Toast for real-time notifications */}
            {toast && (
                <div className={`fixed bottom-6 left-6 z-[200] max-w-xs rounded-2xl border p-4 shadow-2xl transition-all animate-in slide-in-from-bottom-4 duration-500 ${getToastColor(toast.type)}`}>
                    <div className="flex gap-3 items-start">
                        {getIcon(toast.type)}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black truncate">{toast.title}</p>
                            <p className="text-xs font-medium mt-0.5 line-clamp-2 opacity-80">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="shrink-0 opacity-50 hover:opacity-100">
                            <XCircle className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="relative" ref={dropdownRef}>
                {/* Bell button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2 rounded-xl hover:bg-[#1d1b41]/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
                    aria-label="Notifications"
                >
                    {bellShake ? (
                        <BellRing className="w-5 h-5 text-[#1d1b41] animate-bounce" />
                    ) : (
                        <Bell className="w-5 h-5 text-[#1d1b41] dark:text-gray-300" />
                    )}
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-brand-accent rounded-full border-2 border-white animate-in zoom-in duration-300">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-auto sm:right-0 sm:mt-2 w-auto sm:w-96 bg-white rounded-2xl shadow-2xl shadow-[#1d1b41]/10 border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-[#1d1b41] text-sm tracking-tight">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent text-[10px] font-black rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={isMarkingAll}
                                    className="flex items-center gap-1.5 text-[10px] font-black text-[#1d1b41]/60 hover:text-brand-accent transition-colors uppercase tracking-widest"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    {isMarkingAll ? 'Marking...' : 'Mark all read'}
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {isLoading && notifications.length === 0 ? (
                                <div className="p-8 text-center text-sm text-gray-400">Loading notifications...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                    <p className="text-sm font-medium text-gray-400">No notifications yet</p>
                                    <p className="text-xs text-gray-300 mt-1">We'll notify you when something important happens</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notification) => (
                                        <div key={notification.id} className={`group relative p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-brand-accent/5' : ''}`}>
                                            <div className="flex gap-3">
                                                <div className="mt-0.5">{getIcon(notification.type)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-xs leading-tight ${!notification.read ? 'font-black text-[#1d1b41]' : 'font-bold text-gray-700'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-[9px] font-bold text-gray-400 whitespace-nowrap shrink-0">
                                                            {timeAgo(notification.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="mt-1.5 flex items-center gap-1 text-[9px] font-black text-brand-accent hover:text-[#b89531] uppercase tracking-widest transition-colors"
                                                        >
                                                            <Check className="w-2.5 h-2.5" />
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 rounded-full bg-brand-accent shrink-0 mt-1 animate-pulse" />
                                                )}
                                            </div>
                                            {notification.link && (
                                                <Link
                                                    href={notification.link}
                                                    onClick={() => { handleMarkAsRead(notification.id); setIsOpen(false); }}
                                                    className="absolute inset-0"
                                                >
                                                    <span className="sr-only">View details</span>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                            <Link
                                href="/dashboard/notifications"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center w-full py-2 text-[10px] font-black text-[#1d1b41] hover:text-brand-accent uppercase tracking-widest transition-colors"
                            >
                                View all notifications
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
