import { getAllUniversitiesWithPrograms } from '@/lib/data/universities';
import { getAllCountries } from '@/lib/data/countries';
import UniversitiesList from '@/components/student/UniversitiesList';
import Pagination from '@/components/common/Pagination';
import { FeaturedSection, DestinationsSection, HowItWorksSection, TrustSection } from '@/components/student/BrowseUniversitySections';
import ProgramCard from '@/components/student/ProgramCard';
import { GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    const limit = 8;
    const [{ universities: universitiesData, metadata }, countries] = await Promise.all([
        getAllUniversitiesWithPrograms(currentPage, limit, {
            query,
            country,
            level,
            sortBy
        }),
        getAllCountries()
    ]);

    // Map to simplified university format
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

    const allPrograms = universities.flatMap(uni => 
        uni.programs.slice(0, 3).map((p: any) => ({
            ...p,
            university: { id: uni.id, name: uni.name }
        }))
    ).slice(0, 6);

    const isSearching = !!query || !!country || !!level;

    return (
        <div className="space-y-0 pb-12 -mt-6 overflow-x-hidden">
            <div className="px-1 max-w-7xl mx-auto w-full">
                <UniversitiesList universities={universities} allCountries={countries} hideUntilSearch={true}>
                    {!isSearching && (
                        <div className="mt-12 space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            {/* 1. Universities Section */}
                            <FeaturedSection universities={universities} />

                            {/* 2. Programs Section */}
                            <div className="space-y-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-[#1d1b41] uppercase tracking-tight">Top Programs</h2>
                                        <p className="text-slate-500 text-sm font-medium">Explore world-class academic paths</p>
                                    </div>
                                    <div className="h-px flex-1 bg-gray-100 mx-12 hidden lg:block" />
                                    <Link href="/dashboard/programs" className="group flex items-center gap-3 text-[#d5a22d] font-black text-xs uppercase tracking-widest hover:text-[#1d1b41] transition-all">
                                        All Programs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {allPrograms.map((program) => (
                                        <div key={program.id} className="relative group">
                                            <ProgramCard program={program} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <DestinationsSection countries={countries} />
                            <HowItWorksSection />
                            <TrustSection />
                        </div>
                    )}

                    <div className="mt-16 flex justify-center">
                        <Pagination totalPages={metadata.totalPages} currentPage={currentPage} />
                    </div>
                </UniversitiesList>
            </div>
        </div>
    );
}
