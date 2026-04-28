import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getUniversities() {
    const session = await auth();
    if (!session?.user?.email) return [];

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { managedCountry: true },
        });

        if (!user?.managedCountry) {
            return [];
        }

        const universities = await prisma.university.findMany({
            where: { countryId: user.managedCountry.id },
            orderBy: { name: 'asc' },
            include: { _count: { select: { programs: true } } }
        });

        return universities;
    } catch (error) {
        console.error('Failed to fetch universities:', error);
        return [];
    }
}

export async function getAllUniversitiesWithPrograms(
    page: number = 1, 
    limit: number = 10,
    filters?: {
        query?: string;
        country?: string;
        level?: string;
        sortBy?: string;
    }
) {
    try {
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        
        if (filters?.country && filters.country !== 'all') {
            where.country = { name: filters.country };
        }
        
        if (filters?.level && filters.level !== 'all') {
            where.programs = {
                some: { level: filters.level }
            };
        }
        
        if (filters?.query) {
            const query = filters.query;
            const shortQuery = query.length >= 3 ? query.substring(0, 3) : query;
            
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { name: { startsWith: shortQuery, mode: 'insensitive' } }, // Loose match for fuzzy pool
                {
                    programs: {
                        some: {
                            OR: [
                                { name: { contains: query, mode: 'insensitive' } },
                                { majors: { has: query } },
                                { name: { startsWith: shortQuery, mode: 'insensitive' } }
                            ]
                        }
                    }
                }
            ];
        }

        // Build orderBy
        let orderBy: any = { name: 'asc' };
        if (filters?.sortBy === 'name-desc') orderBy = { name: 'desc' };
        if (filters?.sortBy === 'newest') orderBy = { createdAt: 'desc' };

        const [universities, total] = await Promise.all([
            prisma.university.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    images: true,
                    description: true,
                    globalScholarshipActive: true,
                    globalScholarshipPercentage: true,
                    applicationRequirements: true,
                    applicationOpenDate: true,
                    applicationCloseDate: true,
                    createdAt: true,
                    country: {
                        select: {
                            name: true,
                            code: true,
                            currencySymbol: true
                        }
                    },
                    departments: {
                        select: { id: true, name: true }
                    },
                    programs: {
                        where: filters?.level && filters.level !== 'all' ? { level: filters.level } : undefined,
                        select: {
                            id: true,
                            name: true,
                            level: true,
                            baseTuition: true,
                            scholarshipPercentage: true,
                            duration: true,
                            intake: true,
                            excludeFromGlobalScholarship: true,
                            majors: true,
                            requirements: true,
                            department: {
                                select: { name: true }
                            }
                        }
                    },
                    admins: {
                        select: { id: true },
                        take: 1
                    }
                },
                orderBy
            }),
            prisma.university.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            universities,
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
        console.error('Failed to fetch universities with programs:', error);
        throw new Error('Failed to fetch universities with programs.');
    }
}

export async function getProgramDetails(id: string) {
    if (!id) return null;
    try {
        const program = await prisma.program.findUnique({
            where: { id },
            include: {
                university: {
                    include: {
                        country: true,
                        admins: {
                            select: { id: true },
                            take: 1
                        }
                    }
                },
                department: true
            }
        });
        return program;
    } catch (error) {
        console.error('Failed to fetch program details:', error);
        return null;
    }
}

export async function getUniversity(id: string) {
    try {
        const university = await prisma.university.findUnique({
            where: { id },
            include: {
                programs: {
                    include: { department: true }
                },
                departments: true,
                country: true,
                admins: {
                    select: { id: true },
                    take: 1
                },
                _count: { select: { affiliates: true, programs: true } }
            }
        });
        return university;
    } catch (error) {
        console.error('Failed to fetch university:', error);
        return null;
    }
}

export async function getUniversityById(id: string) {
    try {
        const university = await prisma.university.findUnique({
            where: { id },
            include: {
                country: true,
                programs: {
                    include: { department: true }
                },
                departments: true,
                admins: {
                    select: { id: true },
                    take: 1
                },
            }
        });
        return university;
    } catch (error) {
        console.error('Failed to fetch university details:', error);
        return null;
    }
}

export async function getUniversityForAdmin() {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                managedUniversity: {
                    include: {
                        programs: {
                            include: {
                                applications: true,
                                department: true
                            }
                        },
                        departments: {
                            include: {
                                _count: { select: { programs: true } }
                            }
                        }
                    }
                }
            }
        });

        return user?.managedUniversity;
    } catch (error) {
        console.error('Failed to fetch university for admin:', error);
        return null;
    }
}

export async function getAllUniversities() {
    try {
        const universities = await prisma.university.findMany({
            orderBy: { name: 'asc' },
            select: { id: true, name: true }
        });
        return { universities };
    } catch (error) {
        console.error('Failed to fetch all universities:', error);
        return { universities: [] };
    }
}

export async function getUniversityBySlug(slug: string) {
    try {
        const university = await prisma.university.findFirst({
            where: { slug, status: 'APPROVED' },
            select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                description: true,
                website: true,
                images: true,
                country: { select: { name: true, code: true } },
                _count: { select: { programs: true } },
            },
        });
        return university;
    } catch (error) {
        console.error('Failed to fetch university by slug:', error);
        return null;
    }
}
