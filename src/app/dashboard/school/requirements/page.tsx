import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUniversityForAdmin } from '@/lib/data';
import RequirementSettings from '@/components/school/RequirementSettings';
import { FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function SchoolRequirementsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    if (session.user.role !== 'SCHOOL_ADMIN') {
        redirect('/dashboard');
    }

    const university = await getUniversityForAdmin();

    if (!university) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl border-2 border-[#36335e]/10 max-w-md w-full animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
                        <FileText className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-xl font-bold text-[#36335e] tracking-tight mb-2">Requirements Not Found</h1>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        We couldn't retrieve your university details. This might be a system error or missing permissions.
                    </p>
                    <a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-[#d5a22d] hover:text-[#b08523] transition-colors">
                        &larr; Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageHeader
                title="Application Requirements"
                subtitle="Customize specific document and information requirements for student applications."
                action={
                    <div className="flex items-center gap-2 px-4 py-2 bg-brand-primary rounded-xl text-white text-sm font-bold shadow-lg shadow-brand-primary/20">
                        <FileText className="w-4 h-4 text-brand-accent" />
                        <span>Configuration</span>
                    </div>
                }
            />

            <div className="space-y-6">
                <RequirementSettings university={university} />
            </div>
        </>
    );
}
