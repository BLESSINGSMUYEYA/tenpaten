'use client';

import { useSession } from 'next-auth/react';
import PusherListener from './PusherListener';

export default function PusherWrapper() {
    const { data: session } = useSession();
    
    // We only initialize the listener if the user is logged in
    if (!session?.user?.id) return null;

    return <PusherListener userId={session.user.id} />;
}
