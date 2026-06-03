import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const session = await auth();
    
    if (!session || !session.user || (session.user as any).role !== 'SCHOOL_SUPER_AGENT') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { schoolId } = body;

        if (!schoolId) {
            return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
        }

        // Verify assignment
        const assignment = await prisma.schoolSuperAgentUniversity.findUnique({
            where: {
                userId_universityId: {
                    userId: session.user.id,
                    universityId: schoolId,
                },
            },
        });

        if (!assignment) {
            return NextResponse.json({ error: 'Unauthorized assignment' }, { status: 403 });
        }

        const cookieStore = await cookies();
        cookieStore.set('active-school-id', schoolId, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to switch school:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
