import prisma from '@/lib/prisma';

export async function logAction(userId: string, action: string, details?: any) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                details: details ? details : undefined,
            },
        });
    } catch (error) {
        // We generally don't want to fail the main action if logging fails, 
        // but we should log the error to the console.
        console.error('Failed to write audit log:', error);
    }
}
