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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Application Requirements</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Customize specific document and information requirements for student applications.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#d5a22d]/10 text-[#d5a22d] rounded-xl text-sm font-black uppercase tracking-widest border border-[#d5a22d]/20">
                    <FileText className="w-4 h-4" />
                    <span>Configuration Engine</span>
                </div>
            </div>

            <div className="space-y-6">
                <RequirementSettings university={university} />
            </div>
        </div>
    );
}
