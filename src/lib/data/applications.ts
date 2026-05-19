import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getStudentApplications() {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
        const applications = await prisma.application.findMany({
            where: { prospect: { email: session.user.email } },
            include: { program: { include: { university: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return applications;
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        return [];
    }
}

export async function getLatestDraftApplication() {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        const draft = await prisma.application.findFirst({
            where: {
                prospect: { email: session.user.email },
                status: 'DRAFT'
            },
            include: { program: { include: { university: true } } },
            orderBy: { updatedAt: 'desc' }
        });
        return draft;
    } catch (error) {
        console.error('Failed to fetch latest draft:', error);
        return null;
    }
}

export async function getApplicationsByCountry(
    page: number = 1, 
    limit: number = 10,
    query?: string,
    status?: string,
    sort?: string
) {
    const session = await auth();
    if (!session?.user?.email) return { applications: [], metadata: { total: 0, page, limit, totalPages: 0 } };

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { managedCountry: true },
        });

        if (!user?.managedCountry) return { applications: [], metadata: { total: 0, page, limit, totalPages: 0 } };

        const skip = (page - 1) * limit;
        const whereClause: any = {
            program: {
                university: {
                    countryId: user.managedCountry.id
                }
            }
        };

        if (status) {
            whereClause.status = status;
        }

        if (query) {
            whereClause.OR = [
                { prospect: { fullName: { contains: query, mode: 'insensitive' } } },
                { prospect: { email: { contains: query, mode: 'insensitive' } } },
                { program: { name: { contains: query, mode: 'insensitive' } } },
                { program: { university: { name: { contains: query, mode: 'insensitive' } } } }
            ];
        }

        const orderByClause: any = {};
        if (sort === 'oldest') {
            orderByClause.createdAt = 'asc';
        } else {
            orderByClause.createdAt = 'desc';
        }

        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    prospect: true,
                    program: {
                        include: {
                            university: true
                        }
                    }
                },
                orderBy: orderByClause
            }),
            prisma.application.count({ where: whereClause })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            applications,
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
        console.error('Failed to fetch applications by country:', error);
        return { applications: [], metadata: { total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    }
}

export async function getApplicationDetails(id: string) {
    try {
        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                prospect: true,
                program: {
                    include: {
                        university: {
                            include: {
                                country: true,
                                admins: {
                                    select: { id: true },
                                    take: 1
                                }
                            }
                        }
                    }
                },
                affiliate: {
                    include: {
                        user: true
                    }
                },
                statusHistory: {
                    orderBy: { createdAt: 'desc' }
                },
                alternativeProgram: true
            }
        });
        return application;
    } catch (error) {
        console.error('Failed to fetch application details:', error);
        return null;
    }
}

export async function getAllApplications(page: number = 1, limit: number = 10) {
    const session = await auth();
    if (!session?.user?.email) return { applications: [], metadata: { total: 0, page, limit, totalPages: 0 } };

    try {
        const skip = (page - 1) * limit;

        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                skip,
                take: limit,
                include: {
                    prospect: true,
                    program: {
                        include: {
                            university: true,
                        }
                    },
                    affiliate: {
                        include: {
                            user: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.application.count()
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            applications,
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
        console.error('Failed to fetch all applications:', error);
        return { applications: [], metadata: { total: 0, page, limit, totalPages: 0 } };
    }
}
