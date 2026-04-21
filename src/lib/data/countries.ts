import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getAllCountries() {
    try {
        const countries = await prisma.country.findMany({
            orderBy: { name: 'asc' }
        });
        return countries;
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        return [];
    }
}

export async function getCountryDirectorStats() {
    const session = await auth();
    if (!session?.user?.email) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { managedCountry: true },
        });

        if (!user?.managedCountry) return null;

        const [universityCount, applicationCount, affiliateCount, pendingUniversityCount, pendingAffiliateCount] = await Promise.all([
            prisma.university.count({
                where: { countryId: user.managedCountry.id }
            }),
            prisma.application.count({
                where: {
                    program: {
                        university: { countryId: user.managedCountry.id }
                    }
                }
            }),
            prisma.affiliateProfile.count({
                where: {
                    countryId: user.managedCountry.id
                }
            }),
            prisma.university.count({
                where: {
                    countryId: user.managedCountry.id,
                    status: 'PENDING'
                }
            }),
            prisma.affiliateProfile.count({
                where: {
                    countryId: user.managedCountry.id,
                    status: 'PENDING'
                }
            })
        ]);

        return {
            universities: universityCount,
            applications: applicationCount,
            affiliates: affiliateCount,
            pendingUniversities: pendingUniversityCount,
            pendingAffiliates: pendingAffiliateCount,
            countryName: user.managedCountry.name
        };
    } catch (error) {
        console.error('Failed to fetch country director stats:', error);
        return null;
    }
}
