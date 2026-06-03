import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ScholarshipManager from '@/components/school/scholarships/ScholarshipManager';
import { getActiveSchoolId } from '@/lib/getActiveSchool';

export default async function SchoolScholarshipsPage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    if (!session?.user?.email) {
        redirect('/login');
    }

    if (userRole !== 'SCHOOL_ADMIN' && userRole !== 'SCHOOL_SUPER_AGENT') {
        redirect('/dashboard');
    }

    let universityId = (session?.user as any)?.managedUniversityId;

    if (userRole === 'SCHOOL_SUPER_AGENT') {
        universityId = await getActiveSchoolId();
    } else if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-black text-brand-primary">University not found</h2>
            </div>
        );
    }

    const university = await prisma.university.findUnique({
        where: { id: universityId },
        include: {
            programs: {
                orderBy: { name: 'asc' }
            }
        }
    });

    if (!university) {
        return redirect('/dashboard');
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <ScholarshipManager university={university} />
        </div>
    );
}
