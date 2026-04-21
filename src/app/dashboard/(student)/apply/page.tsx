import { auth } from '@/auth';
import { getAllUniversitiesWithPrograms, getAllCountries } from '@/lib/data';
import prisma from '@/lib/prisma';
import SettingsTabs from '@/components/settings/SettingsTabs';
import { Sparkles } from 'lucide-react';

export default async function ApplicationPage() {
    const session = await auth();

    let user = null;
    let universities: any[] = [];
    let countries: any[] = [];

    try {
        if (session?.user?.email) {
            user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });
        }

        const [universitiesResponse, countriesResponse] = await Promise.all([
            getAllUniversitiesWithPrograms(),
            getAllCountries()
        ]);

        universities = universitiesResponse.universities;
        countries = countriesResponse;

    } catch (error) {
        console.error('Application page data fetching error:', error);
    }

    if (!user) {
        // Handle case where user is not found (shouldn't happen if authenticated, but good for safety)
        return <div>User not found. Please log in.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] w-fit">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase">New Application</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#36335e] tracking-tight leading-tight">
                    Start Your <span className="text-[#d5a22d]">Journey</span>
                </h1>
                <p className="text-sm text-slate-500 font-medium max-w-md">
                    Complete the steps below to apply to your dream university and track your progress.
                </p>
            </div>

            <SettingsTabs user={user} universities={universities} countries={countries} />
        </div>
    );
}
