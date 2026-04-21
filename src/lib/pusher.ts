import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

// Server-side Pusher (for triggering events)
export const pusherServer = (appId && key && secret && cluster)
    ? new PusherServer({
        appId,
        key,
        secret,
        cluster,
        useTLS: true,
    })
    : null;

// Client-side Pusher (for subscribing to events)
export const pusherClient = (key && cluster)
    ? new PusherClient(key, {
        cluster,
    })
    : null;
