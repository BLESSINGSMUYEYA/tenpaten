import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function getActiveSchoolId(): Promise<string | null> {
    try {
        const user = await getCurrentUser();

        if (user.role === 'SCHOOL_ADMIN') {
            return user.managedUniversityId || null;
        }

        if (user.role === 'SCHOOL_SUPER_AGENT') {
            const cookieStore = await cookies();
            const activeSchoolId = cookieStore.get('active-school-id')?.value;

            // Verify the super agent is assigned to this school
            if (activeSchoolId) {
                const assignment = await prisma.schoolSuperAgentUniversity.findUnique({
                    where: {
                        userId_universityId: {
                            userId: user.id,
                            universityId: activeSchoolId,
                        },
                    },
                });
                if (assignment) {
                    return activeSchoolId;
                }
            }

            // If not assigned or no cookie, fetch first assigned school
            const firstAssignment = await prisma.schoolSuperAgentUniversity.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: 'asc' },
                select: { universityId: true },
            });

            if (firstAssignment) {
                // Set cookie for subsequent requests
                try {
                    cookieStore.set('active-school-id', firstAssignment.universityId, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 30, // 30 days
                    });
                } catch (cookieError) {
                    // Ignore cookie setting error in Server Components
                    // It will just be evaluated again next request, or the user will
                    // set it formally via the switchActiveSchool Server Action.
                }
                return firstAssignment.universityId;
            }

            return null;
        }

        return null;
    } catch (e) {
        return null;
    }
}

export async function getActiveSchool() {
    const schoolId = await getActiveSchoolId();
    if (!schoolId) return null;

    return prisma.university.findUnique({
        where: { id: schoolId },
    });
}
