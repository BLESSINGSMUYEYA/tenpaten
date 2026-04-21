'use client';

import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InitiateMessageProps {
    recipientId: string;
    label?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

export default function InitiateMessage({
    recipientId,
    label = 'Send Message',
    variant = 'outline',
    size = 'sm',
    className
}: InitiateMessageProps) {
    const router = useRouter();

    const handleMessage = () => {
        router.push(`/dashboard/messages?recipientId=${recipientId}`);
    };

    return (
        <Button
            onClick={handleMessage}
            variant={variant}
            size={size}
            className={className}
        >
            <MessageSquare className="w-4 h-4 mr-2" />
            {label}
        </Button>
    );
}
