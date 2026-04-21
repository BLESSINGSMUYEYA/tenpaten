import { getUniversityForAdmin } from '@/lib/data';
import DepartmentManager from '@/components/school/DepartmentManager';
import ProgramList from '@/components/school/ProgramList';
import ProgramPageClient from './ProgramPageClient'; // We'll extract client logic here
import { Layers, GraduationCap } from 'lucide-react';

export default async function SchoolProgramsPage() {
    const university = await getUniversityForAdmin();

    if (!university) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                    Error: Could not load university data. Please try again or contact support.
                </div>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-2 md:px-4 py-2 md:py-4">
            <ProgramPageClient university={university} />
        </main>
    );
}
