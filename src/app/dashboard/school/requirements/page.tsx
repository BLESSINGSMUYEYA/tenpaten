import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUniversityForAdmin } from '@/lib/data';
import RequirementSettings from '@/components/school/RequirementSettings';
import { FileText, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function SchoolRequirementsPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    if ((session.user as any).role !== 'SCHOOL_ADMIN' && (session.user as any).role !== 'SCHOOL_SUPER_AGENT') {
        redirect('/dashboard');
    }

    const university = await getUniversityForAdmin();

    if (!university) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl border-2 border-brand-primary/10 max-w-md w-full animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-sm">
                        <FileText className="w-8 h-8 text-rose-500" />
                    </div>
                    <h1 className="text-xl font-bold text-brand-primary tracking-tight mb-2">Requirements Not Found</h1>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        We couldn't retrieve your university details. This might be a system error or missing permissions.
                    </p>
                    <a href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-brand-accent hover:text-[#b08523] transition-colors">
                        &larr; Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <PageHeader 
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Building2 className="w-3.5 h-3.5" />
                        Institutional Setup
                    </div>
                }
                title="Application Requirements"
                subtitle={
                    <>
                        Customize document and information requirements for <span className="font-bold text-brand-accent">{university.name}</span> applications.
                    </>
                }
            />

            <RequirementSettings university={university} />
        </div>
    );
}
