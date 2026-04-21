'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

export async function getNotifications(limit = 20) {
    const user = await getCurrentUser();
    return prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

export async function getNotificationsPaginated(page = 1, filter?: string) {
    const user = await getCurrentUser();
    const perPage = 20;

    const where: any = { userId: user.id };
    if (filter === 'unread') where.read = false;
    if (filter === 'SUCCESS') where.type = 'SUCCESS';
    if (filter === 'WARNING') where.type = 'WARNING';
    if (filter === 'ERROR') where.type = 'ERROR';
    if (filter === 'INFO') where.type = 'INFO';

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.notification.count({ where }),
    ]);

    return { notifications, total, pages: Math.ceil(total / perPage) };
}

export async function getUnreadCount() {
    const user = await getCurrentUser();
    return prisma.notification.count({
        where: { userId: user.id, read: false },
    });
}

export async function markAsRead(notificationId: string) {
    const user = await getCurrentUser();
    await prisma.notification.updateMany({
        where: { id: notificationId, userId: user.id },
        data: { read: true },
    });
    revalidatePath('/dashboard/notifications');
}

export async function markAllAsRead() {
    const user = await getCurrentUser();
    await prisma.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
    });
    revalidatePath('/dashboard/notifications');
    return { success: true };
}
