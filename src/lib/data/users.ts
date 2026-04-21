import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getUser() {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
    }
}

export async function getAllUsers(page: number = 1, limit: number = 10) {
    const session = await auth();
    if (!session?.user?.email) return { users: [], metadata: { total: 0, page, limit, totalPages: 0 } };

    try {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    managedUniversity: true,
                    managedCountry: true,
                    affiliateProfile: true
                }
            }),
            prisma.user.count()
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            users,
            metadata: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return { users: [], metadata: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function getUserById(id: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                managedCountry: true,
                managedUniversity: true,
                _count: {
                    select: {
                        applications: true,
                        notifications: true
                    }
                }
            }
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user by id:', error);
        return null;
    }
}
