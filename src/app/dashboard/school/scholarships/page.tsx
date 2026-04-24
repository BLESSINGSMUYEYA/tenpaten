import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ScholarshipManager from '@/components/school/scholarships/ScholarshipManager';

export default async function SchoolScholarshipsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    if (session.user.role !== 'SCHOOL_ADMIN') {
        redirect('/dashboard');
    }

    let universityId = (session?.user as any)?.managedUniversityId;

    if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-black text-[#36335e]">University not found</h2>
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
