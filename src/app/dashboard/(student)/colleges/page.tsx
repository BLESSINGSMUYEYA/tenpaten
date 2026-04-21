import { getAllUniversitiesWithPrograms } from '@/lib/data/universities';
import { getAllCountries } from '@/lib/data/countries';
import UniversitiesList from '@/components/student/UniversitiesList';
import Pagination from '@/components/common/Pagination';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Sparkles } from 'lucide-react';

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
    const limit = 8; // Grid of 2x4 works perfectly
    const [{ universities: universitiesData, metadata }, countries] = await Promise.all([
        getAllUniversitiesWithPrograms(currentPage, limit, {
            query,
            country,
            level,
            sortBy
        }),
        getAllCountries()
    ]);

    // Map to simplified university format for the list
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
            const queryWords = lowerQuery.split(' ').filter(Boolean);
            
            matchingProgram = mappedPrograms.find((p: any) => {
                const programName = p.name?.toLowerCase() || '';
                const majors = p.majors?.map((m: string) => m.toLowerCase()) || [];
                
                // Fuzzy/Loose match: Check if query is in name/majors OR if any word matches
                return programName.includes(lowerQuery) || 
                       majors.some((m: string) => m.includes(lowerQuery)) ||
                       queryWords.some(word => word.length >= 3 && (programName.includes(word) || majors.some((m: string) => m.includes(word))));
            }) || null;
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
        <div className="space-y-0 pb-6 -mt-6 overflow-x-hidden">
            <div className="px-1 max-w-7xl mx-auto w-full">
                {/* Universities List with integrated Header Control */}
                <UniversitiesList universities={universities} allCountries={countries} hideUntilSearch={true}>
                    {/* Pagination Controls - Now hidden until search */}
                    <div className="mt-12 flex justify-center">
                        <Pagination totalPages={metadata.totalPages} currentPage={currentPage} />
                    </div>
                </UniversitiesList>
            </div>
        </div>
    );
}
