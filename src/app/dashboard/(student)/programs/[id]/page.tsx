import { getProgramDetails } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProgramDetailsView from '@/components/student/ProgramDetailsView';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const program = await getProgramDetails(id);

    if (!program) {
        return {
            title: 'Program Not Found',
        };
    }

    return {
        title: `${program.name} | ${program.university.name} | Tenpaten`,
        description: program.description ? program.description.substring(0, 160) : `Details about ${program.name} at ${program.university.name}`,
    };
}

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const program = await getProgramDetails(id);

    if (!program) {
        notFound();
    }

    return (
        <div className="space-y-6 pb-12">
            <div className="w-full">
                <ProgramDetailsView program={program as any} />
            </div>
        </div>
    );
}
