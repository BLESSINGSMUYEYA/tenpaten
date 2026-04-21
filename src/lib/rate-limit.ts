import { headers } from 'next/headers';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Basic in-memory rate limiter.
 * @param identifier Unique identifier for the client (e.g. IP + ActionName)
 * @param limit Max number of requests allowed within the window
 * @param windowMs Time window in milliseconds
 * @returns boolean where true means allowed, false means rate limited
 */
export function rateLimit(
    identifier: string,
    limit: number = 5,
    windowMs: number = 60000
): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record) {
        rateLimitMap.set(identifier, { count: 1, lastReset: now });
        return true;
    }

    if (now - record.lastReset > windowMs) {
        // Reset window
        record.count = 1;
        record.lastReset = now;
        return true;
    }

    if (record.count >= limit) {
        return false; // Rate limit exceeded
    }

    record.count += 1;
    return true;
}

/**
 * Helper to get the client IP from Next.js headers within a Server Action or App Route.
 */
export async function getClientIp(): Promise<string> {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    const realIp = headersList.get('x-real-ip');
    if (realIp) {
        return realIp;
    }
    return 'unknown-ip';
}
