import prisma from './prisma';
import { pusherServer } from './pusher';

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

/**
 * Creates a notification for a user.
 */
export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'INFO',
    link?: string
) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
            },
        });

        // Trigger Real-time Notification (fire-and-forget, never block the caller)
        if (pusherServer) {
            Promise.race([
                pusherServer.trigger(`user-${userId}`, 'new-notification', notification),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Pusher timeout')), 2000))
            ]).catch(err => console.warn('Pusher notification skipped:', err.message));
        }

        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
        // We don't want to throw here and block the main action if notification fails
        return null;
    }
}

/**
 * Marks a notification as read.
 */
export async function markNotificationAsRead(notificationId: string) {
    try {
        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return true;
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        return false;
    }
}

/**
 * Gets unread notifications count for a user.
 */
export async function getUnreadNotificationsCount(userId: string) {
    try {
        const count = await prisma.notification.count({
            where: {
                userId,
                read: false,
            },
        });
        return count;
    } catch (error) {
        console.error('Failed to get unread notifications count:', error);
        return 0;
    }
}
