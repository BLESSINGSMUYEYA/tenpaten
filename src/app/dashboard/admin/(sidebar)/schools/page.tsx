import { getAllUniversitiesWithPrograms } from '@/lib/data';
import SchoolsManager from '@/components/admin/SchoolsManager';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminSchoolsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const awaitedSearchParams = await searchParams;
    const page = parseInt(awaitedSearchParams.page || '1');
    
    const [{ universities, metadata }, countries] = await Promise.all([
        getAllUniversitiesWithPrograms(page, 10).catch(() => ({
            universities: [],
            metadata: { total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false }
        })),
        prisma.country.findMany({
            select: { id: true, name: true, code: true },
            orderBy: { name: 'asc' }
        })
    ]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SchoolsManager 
                initialSchools={universities as any} 
                total={metadata.total}
                countries={countries}
            />
        </div>
    );
}
