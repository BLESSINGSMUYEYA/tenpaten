import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const session = await auth();
    
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { managedUniversityId } = session.user as any;
    
    if (!managedUniversityId) {
        return NextResponse.json({ error: 'No university managed by this user' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { applicationRequirements, applicationOpenDate, applicationCloseDate } = body;

        const updateData: any = {};
        if (applicationRequirements) updateData.applicationRequirements = applicationRequirements;
        if (applicationOpenDate !== undefined) updateData.applicationOpenDate = applicationOpenDate ? new Date(applicationOpenDate) : null;
        if (applicationCloseDate !== undefined) updateData.applicationCloseDate = applicationCloseDate ? new Date(applicationCloseDate) : null;

        const updatedUniversity = await prisma.university.update({
            where: { id: managedUniversityId },
            data: updateData,
        });

        return NextResponse.json({ success: true, university: updatedUniversity });
    } catch (error) {
        console.error('Failed to update university settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
