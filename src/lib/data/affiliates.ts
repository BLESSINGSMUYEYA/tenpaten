import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getAffiliateStats() {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { user: { email: session.user.email } },
            include: { user: true, university: true, referrals: true }
        });
        return affiliate;
    } catch (error) {
        console.error('Failed to fetch affiliate stats:', error);
        return null;
    }
}

export async function getAffiliateReferrals() {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
        const affiliate = await prisma.affiliateProfile.findFirst({
            where: { user: { email: session.user.email } },
        });

        if (!affiliate) return [];

        const referrals = await prisma.application.findMany({
            where: { affiliateId: affiliate.id },
            include: {
                prospect: true,
                program: { include: { university: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return referrals;
    } catch (error) {
        console.error('Failed to fetch affiliate referrals:', error);
        return [];
    }
}

export async function getAffiliatesByCountry(page: number = 1, limit: number = 10) {
    const session = await auth();
    if (!session?.user?.email) return { affiliates: [], metadata: { total: 0, page, limit, totalPages: 0 } };

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { managedCountry: true },
        });

        if (!user?.managedCountry) return { affiliates: [], metadata: { total: 0, page, limit, totalPages: 0 } };

        const skip = (page - 1) * limit;
        const whereClause = {
            countryId: user.managedCountry.id
        };

        const [affiliates, total] = await Promise.all([
            prisma.affiliateProfile.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    user: true,
                    university: true,
                    _count: { select: { referrals: true } }
                },
                orderBy: { status: 'asc' } // Show pending first
            }),
            prisma.affiliateProfile.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            affiliates,
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
        console.error('Failed to fetch affiliates by country:', error);
        return { affiliates: [], metadata: { total: 0, page, limit, totalPages: 0 } };
    }
}

export async function getAffiliateById(id: string) {
    try {
        const affiliate = await prisma.affiliateProfile.findUnique({
            where: { id },
            include: {
                user: true,
                university: true,
                referrals: {
                    include: {
                        prospect: true,
                        program: {
                            include: { university: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        return affiliate;
    } catch (error) {
        console.error('Failed to fetch affiliate details:', error);
        return null;
    }
}

export async function getAllAffiliates(page: number = 1, limit: number = 20) {
    const session = await auth();
    if (!session?.user?.id) return { affiliates: [], metadata: { total: 0, page, limit, totalPages: 0 } };

    try {
        const skip = (page - 1) * limit;

        const [affiliates, total] = await Promise.all([
            prisma.affiliateProfile.findMany({
                skip,
                take: limit,
                include: {
                    user: true,
                    country: true,
                    _count: { select: { referrals: true } }
                },
                orderBy: { user: { createdAt: 'desc' } }
            }),
            prisma.affiliateProfile.count()
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            affiliates,
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
        console.error('Failed to fetch all affiliates:', error);
        return { affiliates: [], metadata: { total: 0, page, limit, totalPages: 0 } };
    }
}
