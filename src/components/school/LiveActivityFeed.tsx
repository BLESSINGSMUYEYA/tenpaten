'use client';

import { useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import { 
    Zap, 
    UserPlus, 
    FileCheck, 
    MessageSquare, 
    Clock,
    AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
    id: string;
    type: 'NEW_APPLICATION' | 'STATUS_CHANGE' | 'NEW_MESSAGE' | 'SYSTEM';
    message: string;
    timestamp: Date;
}

interface LiveActivityFeedProps {
    universityId: string;
}

export default function LiveActivityFeed({ universityId }: LiveActivityFeedProps) {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        if (!universityId) return;

        const channel = pusherClient.subscribe(`university-${universityId}`);

        channel.bind('new-activity', (data: any) => {
            const newActivity: Activity = {
                id: Math.random().toString(36).substr(2, 9),
                type: data.type,
                message: data.message,
                timestamp: new Date(data.timestamp),
            };

            setActivities(prev => [newActivity, ...prev].slice(0, 5)); // Keep only top 5
        });

        return () => {
            pusherClient.unsubscribe(`university-${universityId}`);
        };
    }, [universityId]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'NEW_APPLICATION': return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
            case 'STATUS_CHANGE': return <FileCheck className="w-3.5 h-3.5 text-blue-400" />;
            case 'NEW_MESSAGE': return <MessageSquare className="w-3.5 h-3.5 text-brand-accent" />;
            default: return <Zap className="w-3.5 h-3.5 text-gray-400" />;
        }
    };

    return (
        <div className="rounded-[2.5rem] bg-[#1a1b41] border border-white/8 p-6 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl group-hover:bg-brand-accent/20 transition-all duration-700" />
            
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Live Activity</h3>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-accent/60 bg-brand-accent/10 px-2.5 py-1 rounded-lg">Pulse Active</span>
                </div>

                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 opacity-40">
                            <Clock className="w-8 h-8 text-white/20" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Awaiting activity...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activities.map((activity) => (
                                <div 
                                    key={activity.id} 
                                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all animate-in slide-in-from-right-4 fade-in duration-500"
                                >
                                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                        {getIcon(activity.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[11px] font-bold text-white/90 leading-tight">
                                            {activity.message}
                                        </p>
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter mt-1 block">
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-brand-accent transition-colors border-t border-white/5 pt-4">
                    View Full Audit Log
                </button>
            </div>
        </div>
    );
}
