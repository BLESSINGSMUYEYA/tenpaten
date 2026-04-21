import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ScholarshipManager from '@/components/school/scholarships/ScholarshipManager';
import { PageHeader } from '@/components/ui/PageHeader';
import { Percent } from 'lucide-react';

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
        <div className="space-y-6">
            <PageHeader 
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.3em] border border-[#d5a22d]/20">
                        <Percent className="w-3.5 h-3.5" />
                        Platform Economics
                    </div>
                }
                title="Scholarship Engine"
                subtitle="Manage universal tuition discounts and program exemptions."
            />
            <ScholarshipManager university={university} />
        </div>
    );
}
