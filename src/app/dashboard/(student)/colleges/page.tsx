import { getAllUniversitiesWithPrograms } from '@/lib/data/universities';
import { getAllCountries } from '@/lib/data/countries';
import UniversitiesList from '@/components/student/UniversitiesList';
import Pagination from '@/components/common/Pagination';

export default async function UniversitiesPage({
    searchParams,
}: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        country?: string;
        level?: string;
        sortBy?: string;
    }>;
}) {
    const { page, query, country, level, sortBy } = (await searchParams) || {};
    const currentPage = Number(page) || 1;
    const limit = 12;
    const [{ universities: universitiesData, metadata }, countries] = await Promise.all([
        getAllUniversitiesWithPrograms(currentPage, limit, {
            query,
            country,
            level,
            sortBy
        }),
        getAllCountries()
    ]);

    const universities = universitiesData.map((uni: any) => {
        const mappedPrograms = uni.programs.map((p: any) => ({
            id: p.id,
            name: p.name,
            level: p.level || 'Unknown',
            baseTuition: p.baseTuition,
            scholarshipPercentage: (uni.globalScholarshipActive && !p.excludeFromGlobalScholarship) ? uni.globalScholarshipPercentage : (p.scholarshipPercentage || null),
            duration: p.duration,
            intake: p.intake,
            departmentName: p.department?.name,
            majors: p.majors || []
        }));

        let matchingProgram = null;
        if (query) {
            const lowerQuery = query.toLowerCase();
            matchingProgram = mappedPrograms.find((p: any) =>
                p.name?.toLowerCase().includes(lowerQuery) ||
                p.majors?.some((m: string) => m.toLowerCase().includes(lowerQuery))
            ) || null;
        }

        return {
            id: uni.id,
            name: uni.name,
            logo: uni.logo,
            images: uni.images || [],
            description: uni.description || '',
            country: uni.country?.name || 'Unknown',
            programCount: uni.programs.length,
            departments: uni.departments?.map((d: any) => d.name) || [],
            hasScholarship: uni.globalScholarshipActive || uni.programs.some((p: any) => p.scholarshipPercentage > 0),
            programs: mappedPrograms,
            matchingProgram,
            countryObj: { currencySymbol: uni.country?.currencySymbol },
            adminId: uni.admins[0]?.id,
            createdAt: uni.createdAt
        };
    });

    return (
        <div className="pb-12 -mt-6 overflow-x-hidden">
            <div className="px-1 max-w-7xl mx-auto w-full">
                <UniversitiesList universities={universities} allCountries={countries}>
                    <div className="mt-8 flex justify-center">
                        <Pagination totalPages={metadata.totalPages} currentPage={currentPage} />
                    </div>
                </UniversitiesList>
            </div>
        </div>
    );
}
