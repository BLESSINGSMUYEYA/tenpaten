import { getUniversityById } from '@/lib/data';
import { notFound } from 'next/navigation';
import UniversityDetailsView from '@/components/student/UniversityDetailsView';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const university = await getUniversityById(id);

    if (!university) {
        return {
            title: 'University Not Found',
        };
    }

    return {
        title: `${university.name} | Tenpaten`,
        description: university.description ? university.description.substring(0, 160) : `Details about ${university.name}`,
    };
}

export default async function UniversityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const university = await getUniversityById(id);

    if (!university) {
        notFound();
    }

    return (
        <div className="container mx-auto px-1 sm:px-2 py-2 sm:py-4 max-w-[1440px]">
            <UniversityDetailsView 
                university={{
                    ...university,
                    applicationOpenDate: university.applicationOpenDate,
                    applicationCloseDate: university.applicationCloseDate
                } as any} 
            />
        </div>
    );
}
