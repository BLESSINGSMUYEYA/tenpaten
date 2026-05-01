import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    const universityId = (session?.user as any)?.managedUniversityId;

    if (userRole !== 'SCHOOL_ADMIN' || !universityId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('search') || undefined;
    const statusFilter = searchParams.get('status');
    const programFilter = searchParams.get('programId');

    const where: Prisma.ApplicationWhereInput = {
        program: { universityId },
        ...(searchTerm && {
            OR: [
                { prospect: { fullName: { contains: searchTerm, mode: 'insensitive' } } },
                { prospect: { email: { contains: searchTerm, mode: 'insensitive' } } },
            ],
        }),
        ...(statusFilter && statusFilter !== 'ALL' && { status: statusFilter as any }),
        ...(programFilter && programFilter !== 'ALL' && { programId: programFilter }),
    };

    const applications = await prisma.application.findMany({
        where,
        include: {
            prospect: true,
            program: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    const data = applications.map((app) => ({
        'Full Name': app.prospect.fullName,
        'Email': app.prospect.email,
        'Program': app.program.name,
        'Status': app.status.replace(/_/g, ' '),
        'Merit Score': app.meritScore ?? 'N/A',
        'Rank': app.rank ?? 'Unranked',
        'Submission Date': new Date(app.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');

    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
        status: 200,
        headers: {
            'Content-Disposition': `attachment; filename="Applicant_Registry_${new Date().toISOString().split('T')[0]}.xlsx"`,
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
    });
}
