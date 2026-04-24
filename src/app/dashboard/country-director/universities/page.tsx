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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">University Management</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage institutional profiles and educational standards within your country.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#d5a22d]/10 text-[#d5a22d] rounded-xl text-sm font-black uppercase tracking-widest border border-[#d5a22d]/20">
                    <Building2 className="w-4 h-4" />
                    <span>Regional Network Registry</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d5a22d] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for an institution by name or location..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-0 rounded-xl text-sm font-medium transition-all"
                    />
                </div>
                <Link href="/dashboard/country-director/universities/create">
                    <Button className="bg-[#36335e] hover:bg-[#2a284a] text-white rounded-xl px-6 py-6 shadow-lg shadow-[#36335e]/20 transition-all active:scale-95 flex gap-2 font-bold">
                        <Plus className="w-5 h-5 text-[#d5a22d]" />
                        <span>Add University</span>
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
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
                                <tr className="bg-[#36335e] text-white">
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Institution</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Network Scale</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Verification Status</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Registry Date</th>
                                    <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
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
