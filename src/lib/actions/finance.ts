'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function getSchoolFinancialSummary() {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'SCHOOL_ADMIN' || !user.managedUniversityId) {
        throw new Error('Unauthorized');
    }

    const universityId = user.managedUniversityId;

    const transactions = await prisma.institutionalTransaction.findMany({
        where: { universityId },
        include: {
            user: {
                select: { fullName: true, email: true }
            },
            application: {
                include: {
                    program: { select: { name: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const payouts = await prisma.payout.findMany({
        where: { universityId },
        orderBy: { requestedAt: 'desc' }
    });

    const summary = transactions.reduce((acc, tx) => {
        if (tx.status === 'SUCCESS') {
            acc.totalRevenue += tx.totalAmount;
            acc.platformFees += tx.platformFee;
            acc.grossBalance += tx.schoolAmount;
        }
        return acc;
    }, {
        totalRevenue: 0,
        platformFees: 0,
        grossBalance: 0
    });

    const totalPaidOut = payouts
        .filter(p => p.status === 'COMPLETED' || p.status === 'PROCESSING' || p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = summary.grossBalance - totalPaidOut;

    return {
        transactions,
        payouts,
        summary: {
            ...summary,
            totalPaidOut,
            availableBalance
        },
        currency: transactions[0]?.currency || 'MWK'
    };
}

export async function requestPayout(amount: number) {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'SCHOOL_ADMIN' || !user.managedUniversityId) {
        throw new Error('Unauthorized');
    }

    const universityId = user.managedUniversityId;

    // Verify balance before allowing request
    const financialData = await getSchoolFinancialSummary();
    if (amount > financialData.summary.availableBalance) {
        throw new Error('Insufficient balance');
    }

    if (amount <= 0) {
        throw new Error('Invalid amount');
    }

    const payout = await prisma.payout.create({
        data: {
            universityId,
            amount,
            status: 'PENDING',
            currency: financialData.currency
        }
    });

    return payout;
}

export async function getRegionalFinancialOverview() {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'COUNTRY_DIRECTOR') {
        throw new Error('Unauthorized');
    }

    const country = await prisma.country.findFirst({
        where: { directorId: user.id },
        include: {
            universities: {
                select: { id: true, name: true }
            }
        }
    });

    if (!country) throw new Error('No country assigned to this director');

    const universityIds = country.universities.map(u => u.id);

    const transactions = await prisma.institutionalTransaction.findMany({
        where: { universityId: { in: universityIds } },
        include: {
            user: { select: { fullName: true } },
            university: { select: { name: true } },
            application: { include: { program: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const summary = transactions.reduce((acc, tx) => {
        if (tx.status === 'SUCCESS') {
            acc.totalVolume += tx.totalAmount;
            acc.totalPlatformRevenue += tx.platformFee;
            acc.regionalAvailableBalance += tx.schoolAmount;
        }
        return acc;
    }, {
        totalVolume: 0,
        totalPlatformRevenue: 0,
        regionalAvailableBalance: 0
    });

    // Grouping by university
    const universityStats = country.universities.map(uni => {
        const uniTx = transactions.filter(tx => tx.universityId === uni.id && tx.status === 'SUCCESS');
        return {
            id: uni.id,
            name: uni.name,
            totalRevenue: uniTx.reduce((sum, tx) => sum + tx.totalAmount, 0),
            netEarnings: uniTx.reduce((sum, tx) => sum + tx.schoolAmount, 0),
            transactionCount: uniTx.length
        };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
        summary,
        universityStats,
        transactions,
        countryName: country.name,
        currency: transactions[0]?.currency || 'MWK'
    };
}

export async function getGlobalFinancialOverview() {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
    }

    const transactions = await prisma.institutionalTransaction.findMany({
        include: {
            user: { select: { fullName: true } },
            university: { select: { name: true } },
            application: { include: { program: { select: { name: true } } } },
            affiliate: { include: { user: { select: { fullName: true } } } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const payouts = await prisma.payout.findMany({
        include: {
            university: { select: { name: true } }
        },
        orderBy: { requestedAt: 'desc' }
    });

    const affiliatePayouts = await prisma.affiliatePayout.findMany({
        include: {
            affiliate: { include: { user: { select: { fullName: true } } } }
        },
        orderBy: { requestedAt: 'desc' }
    });

    const summary = transactions.reduce((acc, tx) => {
        if (tx.status === 'SUCCESS') {
            acc.totalVolume += tx.totalAmount;
            acc.totalPlatformRevenue += tx.platformFee;
            acc.totalAffiliateCommissions += tx.affiliateAmount || 0;
            acc.totalSchoolEarnings += tx.schoolAmount;
        }
        return acc;
    }, {
        totalVolume: 0,
        totalPlatformRevenue: 0,
        totalAffiliateCommissions: 0,
        totalSchoolEarnings: 0
    });

    return {
        summary,
        transactions,
        payouts,
        affiliatePayouts,
        currency: transactions[0]?.currency || 'MWK'
    };
}

export async function updatePayoutStatus(payoutId: string, status: any, adminNotes?: string) {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
    }

    const payout = await prisma.payout.update({
        where: { id: payoutId },
        data: { 
            status, 
            adminNotes,
            processedAt: status === 'COMPLETED' ? new Date() : undefined
        }
    });

    return payout;
}

// --- Affiliate Payout Actions ---

export async function getAffiliateFinancialSummary() {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'AFFILIATE') {
        throw new Error('Unauthorized');
    }

    const affiliate = await prisma.affiliateProfile.findUnique({
        where: { userId: user.id }
    });

    if (!affiliate) throw new Error('Affiliate profile not found');

    const transactions = await prisma.institutionalTransaction.findMany({
        where: { affiliateId: affiliate.id, status: 'SUCCESS' },
        orderBy: { createdAt: 'desc' }
    });

    const payouts = await prisma.affiliatePayout.findMany({
        where: { affiliateId: affiliate.id },
        orderBy: { requestedAt: 'desc' }
    });

    const totalEarnings = transactions.reduce((sum, tx) => sum + (tx.affiliateAmount || 0), 0);
    const totalPaidOut = payouts
        .filter(p => p.status === 'COMPLETED' || p.status === 'PROCESSING' || p.status === 'PENDING')
        .reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = totalEarnings - totalPaidOut;

    return {
        totalEarnings,
        totalPaidOut,
        availableBalance,
        transactions,
        payouts,
        currency: transactions[0]?.currency || 'MWK'
    };
}

export async function requestAffiliatePayout(amount: number) {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'AFFILIATE') {
        throw new Error('Unauthorized');
    }

    const affiliate = await prisma.affiliateProfile.findUnique({
        where: { userId: user.id }
    });

    if (!affiliate) throw new Error('Affiliate profile not found');

    const summary = await getAffiliateFinancialSummary();
    if (amount > summary.availableBalance) {
        throw new Error('Insufficient balance');
    }

    if (amount <= 0) {
        throw new Error('Invalid amount');
    }

    const payout = await prisma.affiliatePayout.create({
        data: {
            affiliateId: affiliate.id,
            amount,
            status: 'PENDING',
            currency: summary.currency
        }
    });

    return payout;
}

export async function updateAffiliatePayoutStatus(payoutId: string, status: any, adminNotes?: string) {
    const session = await auth();
    const user = session?.user as any;

    if (!user || user.role !== 'SUPER_ADMIN') {
        throw new Error('Unauthorized');
    }

    const payout = await prisma.affiliatePayout.update({
        where: { id: payoutId },
        data: { 
            status, 
            adminNotes,
            processedAt: status === 'COMPLETED' ? new Date() : undefined
        }
    });

    return payout;
}
