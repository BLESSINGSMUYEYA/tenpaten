import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    props: { params: Promise<{ conversationId: string }> }
) {
    const params = await props.params;
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId } = params;

    try {
        await prisma.conversationParticipant.update({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: session.user.id
                }
            },
            data: { lastReadAt: new Date() }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to mark conversation as read:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
