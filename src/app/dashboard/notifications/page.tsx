import { Metadata } from 'next';
import { Suspense } from 'react';
import NotificationsClient from './NotificationsClient';

export const metadata: Metadata = {
    title: 'Notifications | Tenpaten Apply',
    description: 'Manage your notifications and stay updated on your applications.',
};

export default function NotificationsPage() {
    return (
        <div className="min-h-full py-2">
            <Suspense fallback={
                <div className="max-w-4xl mx-auto p-20 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-[#d5a22d] rounded-full animate-spin" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Preparing Notifications...</p>
                </div>
            }>
                <NotificationsClient />
            </Suspense>
        </div>
    );
}
