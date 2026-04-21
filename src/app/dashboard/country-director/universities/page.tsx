import { getUniversities } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Building2,
    ChevronRight,
    Plus,
    Search,
    MapPin,
    GraduationCap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default async function Page() {
    const universities = (await getUniversities()).filter(u => (u.status as any) !== 'DRAFT');

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36335e]/10 text-[#36335e] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Building2 className="w-3 h-3" />
                        Network Registry
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">University Management</h1>
                    <p className="text-gray-500 mt-2 font-medium italic">Manage institutional profiles and educational standards within your country.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#d5a22d] transition-colors" />
                        <input
                            type="text"
                            placeholder="Find an institution..."
                            className="pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#d5a22d] focus:bg-white transition-all w-72 shadow-sm text-[#36335e]"
                        />
                    </div>
                    <Link href="/dashboard/country-director/universities/create">
                        <Button className="h-12 px-6 bg-[#36335e] hover:bg-[#2a284a] text-white font-bold rounded-2xl shadow-lg shadow-[#36335e]/20 transition-all transform hover:scale-105 active:scale-95 leading-none">
                            <Plus className="w-5 h-5 mr-2 text-[#d5a22d]" />
                            Add University
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-[#36335e]/10 overflow-hidden border border-slate-100">
                {universities.length === 0 ? (
                    <div className="text-center py-24 px-12">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <Building2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">No Universities Yet</h3>
                        <p className="text-slate-500 mt-2 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                            Start building your country's educational network by adding the first institution.
                        </p>
                        <Link href="/dashboard/country-director/universities/create" className="mt-8 inline-block">
                            <Button className="bg-[#36335e] hover:bg-[#2a284a] text-white font-bold rounded-2xl px-8 h-12 shadow-lg shadow-[#36335e]/20 transition-all transform hover:scale-105 active:scale-95 leading-none">
                                Create First University
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institution</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Scale</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registry Date</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {universities.map((uni) => (
                                    <tr key={uni.id} className="group hover:bg-slate-50/50 transition-colors duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#36335e]/5 group-hover:text-[#36335e] transition-all duration-300">
                                                    <Building2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-[#36335e] transition-colors uppercase tracking-tight leading-none mb-1">
                                                        {uni.name}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        <MapPin className="w-3 h-3 text-[#d5a22d]" />
                                                        Regional Hub
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-[#d5a22d] animate-pulse" />
                                                <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">
                                                    {uni._count.programs} Curriculum Tracks
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border
                                                ${uni.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    uni.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                {uni.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                                {new Date(uni.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link href={`/dashboard/country-director/universities/${uni.id}`}>
                                                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-slate-300 hover:text-[#36335e] hover:bg-[#36335e]/5 transition-all">
                                                    <ChevronRight className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
