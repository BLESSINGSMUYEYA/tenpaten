'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { startOfMonth, subMonths, format } from 'date-fns';

export async function getAdminStats() {
    await requireRole('SUPER_ADMIN');

    const [totalProspects, totalUniversities, totalApplications] = await Promise.all([
        prisma.user.count({ where: { role: 'PROSPECT' } }),
        prisma.university.count(),
        prisma.application.count(),
    ]);

    // Monthly growth for the last 6 months
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const monthlyApplications = await prisma.application.groupBy({
        by: ['createdAt'],
        where: {
            createdAt: { gte: sixMonthsAgo }
        },
        _count: { id: true }
    });

    // Format data for Recharts (aggregating by month string)
    const chartData = Array.from({ length: 6 }).map((_, i) => {
        const date = subMonths(new Date(), 5 - i);
        const monthLabel = format(date, 'MMM');
        const count = monthlyApplications.filter(app =>
            format(app.createdAt, 'MMM yyyy') === format(date, 'MMM yyyy')
        ).reduce((acc, curr) => acc + curr._count.id, 0);

        return { name: monthLabel, total: count };
    });

    return {
        metrics: [
            { label: 'Total Students', value: totalProspects, trend: '+12%' },
            { label: 'Partner Universities', value: totalUniversities, trend: '+3' },
            { label: 'Total Applications', value: totalApplications, trend: '+25%' },
        ],
        chartData
    };
}

export async function getSchoolStats(universityId: string) {
    const user = await requireRole(['SCHOOL_ADMIN', 'SUPER_ADMIN']);

    // Safety check for school admins
    if (user.role === 'SCHOOL_ADMIN' && user.managedUniversityId !== universityId) {
        throw new Error("Unauthorized access to school stats");
    }

    const [
        statusCounts, 
        programCounts, 
        yieldData, 
        allPrograms, 
        meritScoreBuckets, 
        pendingScoring, 
        pendingOffers, 
        pendingRedirections
    ] = await Promise.all([
        prisma.application.groupBy({
            by: ['status'],
            where: { program: { universityId } },
            _count: { id: true }
        }),
        prisma.application.groupBy({
            by: ['programId'],
            where: { program: { universityId } },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        }),
        prisma.application.groupBy({
            by: ['programId', 'status'],
            where: {
                program: { universityId },
                status: { in: ['OFFER_ISSUED', 'OFFER_ACCEPTED', 'ENROLLED'] },
            },
            _count: { id: true },
        }),
        prisma.program.findMany({
            where: { universityId },
            select: { id: true, name: true }
        }),
        prisma.$queryRaw<Array<{ bucket: string; count: bigint }>>`
            SELECT 
                CASE 
                    WHEN "meritScore" <= 20 THEN '0–20'
                    WHEN "meritScore" <= 40 THEN '21–40'
                    WHEN "meritScore" <= 60 THEN '41–60'
                    WHEN "meritScore" <= 80 THEN '61–80'
                    ELSE '81–100'
                END AS bucket,
                COUNT(*) AS count
            FROM "Application"
            INNER JOIN "Program" ON "Application"."programId" = "Program"."id"
            WHERE "Program"."universityId" = ${universityId}
            AND "meritScore" IS NOT NULL
            GROUP BY bucket
        `,
        prisma.application.count({
            where: {
                program: { universityId },
                status: { in: ['SUBMITTED', 'UNIVERSITY_REVIEW'] },
                rank: null,
            }
        }),
        prisma.application.count({
            where: {
                program: { universityId },
                status: { in: ['SUBMITTED', 'UNIVERSITY_REVIEW'] },
                rank: { not: null },
            }
        }),
        prisma.application.count({
            where: {
                program: { universityId },
                alternativeStatus: 'PENDING',
            }
        })
    ]);

    const statusChartData = statusCounts.map(s => ({
        name: s.status.replace(/_/g, ' '),
        value: s._count.id
    }));

    const programChartData = programCounts.map(p => ({
        name: allPrograms.find(tp => tp.id === p.programId)?.name || 'Unknown',
        value: p._count.id
    }));

    const yieldByProgram: Record<string, { issued: number; accepted: number }> = {};
    for (const row of yieldData) {
        if (!yieldByProgram[row.programId]) yieldByProgram[row.programId] = { issued: 0, accepted: 0 };
        if (row.status === 'OFFER_ISSUED') yieldByProgram[row.programId].issued += row._count.id;
        if (row.status === 'OFFER_ACCEPTED' || row.status === 'ENROLLED') yieldByProgram[row.programId].accepted += row._count.id;
    }

    const yieldChartData = allPrograms.map(p => ({
        name: p.name,
        offered: (yieldByProgram[p.id]?.issued ?? 0) + (yieldByProgram[p.id]?.accepted ?? 0),
        accepted: yieldByProgram[p.id]?.accepted ?? 0,
    })).filter(d => d.offered > 0);

    const meritDistributionMap = new Map(meritScoreBuckets.map(b => [b.bucket, Number(b.count)]));
    const meritDistribution = [
        { name: '0–20', value: meritDistributionMap.get('0–20') || 0 },
        { name: '21–40', value: meritDistributionMap.get('21–40') || 0 },
        { name: '41–60', value: meritDistributionMap.get('41–60') || 0 },
        { name: '61–80', value: meritDistributionMap.get('61–80') || 0 },
        { name: '81–100', value: meritDistributionMap.get('81–100') || 0 },
    ];

    return {
        statusChartData,
        programChartData,
        yieldChartData,
        meritDistribution,
        taskQueue: { pendingScoring, pendingOffers, pendingRedirections },
        totalApplications: statusCounts.reduce((acc, curr) => acc + curr._count.id, 0)
    };
}


export async function getAffiliateStats(affiliateId: string) {
    const user = await requireRole(['AFFILIATE', 'SUPER_ADMIN', 'COUNTRY_DIRECTOR', 'PROSPECT']);

    const referrals = await prisma.application.count({
        where: { affiliateId }
    });

    const successfulReferrals = await prisma.application.count({
        where: { affiliateId, status: 'ENROLLED' }
    });

    return {
        metrics: [
            { label: 'Total Referrals', value: referrals, trend: '+5' },
            { label: 'Successful Enrolments', value: successfulReferrals, trend: '+2' },
            { label: 'Conversion Rate', value: referrals > 0 ? `${((successfulReferrals / referrals) * 100).toFixed(1)}%` : '0%', trend: 'Stable' }
        ]
    };
}

export async function getCountryDirectorAnalytics() {
    const user = await prisma.user.findUnique({
        where: { id: (await auth())?.user?.id },
        include: { managedCountry: true }
    });

    if (!user?.managedCountry) {
        return null;
    }

    const countryId = user.managedCountry.id;

    const [universities, affiliates, applications] = await Promise.all([
        prisma.university.count({ where: { countryId } }),
        prisma.affiliateProfile.count({ where: { countryId } }),
        prisma.application.count({ where: { program: { university: { countryId } } } })
    ]);

    // Simple growth trend (mocking historical data for now based on createdAt)
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const monthlyApps = await prisma.application.groupBy({
        by: ['createdAt'],
        where: {
            program: { university: { countryId } },
            createdAt: { gte: sixMonthsAgo }
        },
        _count: { id: true }
    });

    const chartData = Array.from({ length: 6 }).map((_, i) => {
        const date = subMonths(new Date(), 5 - i);
        const count = monthlyApps.filter(app =>
            format(app.createdAt, 'MMM yyyy') === format(date, 'MMM yyyy')
        ).reduce((acc, curr) => acc + curr._count.id, 0);

        return { name: format(date, 'MMM'), total: count };
    });

    return {
        metrics: [
            { label: 'Universities', value: universities, trend: '+1' },
            { label: 'Partners', value: affiliates, trend: '+3' },
            { label: 'Applications', value: applications, trend: '+15%' }
        ],
        countryName: user.managedCountry.name,
        chartData
    };
}
