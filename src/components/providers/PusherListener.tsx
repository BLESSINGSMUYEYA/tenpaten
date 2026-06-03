'use client';

import { useEffect } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import { toast } from 'sonner';
import { BellRing, CheckCircle2, GraduationCap } from 'lucide-react';

interface PusherListenerProps {
    userId: string | undefined;
}

export default function PusherListener({ userId }: PusherListenerProps) {
    useEffect(() => {
        if (!userId) return;

        // 1. Listen for personal notifications (Status updates)
        const userChannel = pusherClient.subscribe(`user-${userId}`);
        
        userChannel.bind('status-update', (data: { 
            message: string, 
            newStatus: string,
            programName: string 
        }) => {
            const isPositive = ['OFFER_ISSUED', 'OFFER_ACCEPTED', 'ENROLLED'].includes(data.newStatus);
            
            toast(data.message, {
                icon: isPositive ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <BellRing className="w-5 h-5 text-brand-accent" />,
                duration: 6000,
                description: `Program: ${data.programName}`,
                style: {
                    background: '#1a1b41',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            });
            
            // Optional: play a subtle sound
            // new Audio('/notification.mp3').play().catch(() => {});
        });

        return () => {
            pusherClient.unsubscribe(`user-${userId}`);
        };
    }, [userId]);

    return null; // This component doesn't render anything UI-wise
}
