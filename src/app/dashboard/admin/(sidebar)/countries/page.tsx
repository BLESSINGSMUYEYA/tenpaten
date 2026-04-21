import prisma from '@/lib/prisma';
import { Globe, Plus } from 'lucide-react';
import CountriesManager from '@/components/admin/CountriesManager';

export const dynamic = 'force-dynamic';

async function getCountries() {
    return prisma.country.findMany({
        orderBy: { name: 'asc' },
        include: {
            director: { select: { fullName: true } },
            _count: { select: { universities: true } }
        }
    });
}

export default async function AdminCountriesPage() {
    const countries = await getCountries();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Global Territories</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">
                        Manage the countries Tenpaten operates in and assign regional directors.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#36335e] rounded-xl text-white text-sm font-bold shadow-lg shadow-[#36335e]/20">
                    <Globe className="w-4 h-4 text-[#d5a22d]" />
                    <span>{countries.length} {countries.length === 1 ? 'Country' : 'Countries'} active</span>
                </div>
            </div>

            <CountriesManager initialCountries={countries} />
        </div>
    );
}
