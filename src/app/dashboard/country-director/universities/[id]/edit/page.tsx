import { getUniversity } from '@/lib/data';
import UniversityProfileForm from '@/components/school/UniversityProfileForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const university = await getUniversity(id);

    if (!university) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-semibold">University not found</h2>
                <Button variant="link" asChild>
                    <Link href="/dashboard/country-director/universities">Back to Universities</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            <div className="flex items-center gap-6">
                <Link
                    href={`/dashboard/country-director/universities/${id}`}
                    className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-[#36335e] hover:border-[#36335e]/10 hover:scale-110 transition-all duration-300 border border-slate-100"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Edit Profile</h1>
                    <p className="text-gray-400 flex items-center gap-2 mt-2 font-medium">
                        <Building2 className="w-4 h-4 text-[#d5a22d]" />
                        {university.name}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl shadow-[#36335e]/10 overflow-hidden border border-slate-100">
                <UniversityProfileForm university={university} universityId={id} />
            </div>
        </div>
    );
}
