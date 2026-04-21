import { getApplicationsByCountry } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Search, Filter, Calendar, GraduationCap, Building2, User, ArrowRight } from 'lucide-react';
import { ApplicationStatus } from '@prisma/client';
import { format } from 'date-fns';

export default async function Page({
    searchParams,
}: {
    searchParams?: Promise<{
        page?: string;
    }>;
}) {
    const { page } = (await searchParams) || {};
    const currentPage = Number(page) || 1;
    const { applications, metadata } = await getApplicationsByCountry(currentPage);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Admissions Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.3em] border border-[#d5a22d]/20">
                        <FileText className="w-3.5 h-3.5" />
                        Regional Admissions Command
                    </div>
                    <h1 className="text-5xl font-black text-[#1d1b41] tracking-tight leading-tight">
                        Regional <span className="text-slate-300">Applications</span>
                    </h1>
                    <p className="text-slate-500 font-bold max-w-xl text-sm leading-relaxed">
                        Authorized oversight and verification of all academic submissions within your geographic jurisdiction.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div className="bg-[#1d1b41] px-8 py-5 rounded-[2rem] shadow-2xl shadow-[#1d1b41]/20 flex items-center gap-6 border border-white/10">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#d5a22d]">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-white">{metadata.total}</div>
                            <div className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none mt-1">Total Registry</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Toolkit */}
            <div className="flex flex-wrap items-center gap-6 bg-white p-3 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-slate-200/50">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#d5a22d] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search student credentials, identity records, or target academy..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-4 focus:ring-[#d5a22d]/5 rounded-[1.5rem] text-sm font-bold placeholder:text-slate-300 transition-all"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-2 border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest px-8 h-14 hover:border-[#1d1b41] hover:text-[#1d1b41] transition-all bg-white flex items-center gap-3">
                        <Filter className="w-4 h-4" />
                        Registry Filters
                    </Button>
                </div>
            </div>

            {/* Applications Registry Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Student Identity</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Target Vector</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Submission Chronicle</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Workflow Status</th>
                                <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50/30 transition-all duration-500 group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-[#1d1b41]/5 flex items-center justify-center text-[#1d1b41] group-hover:bg-[#1d1b41] group-hover:text-[#d5a22d] transition-all border border-slate-100 group-hover:border-[#1d1b41] group-hover:shadow-xl group-hover:shadow-[#1d1b41]/20">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-[#1d1b41] text-lg group-hover:text-[#d39c1d] transition-colors leading-none tracking-tight">
                                                    {app.prospect.fullName}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors mt-2.5 uppercase tracking-wider">{app.prospect.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-2.5">
                                            <div className="flex items-center gap-3 text-sm font-black text-[#1d1b41]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#d5a22d]" />
                                                <span className="truncate max-w-[250px]">{app.program.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-4">
                                                <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                                <span>{app.program.university.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2.5 uppercase tracking-widest text-[10px] font-black text-[#1d1b41]">
                                                <Calendar className="w-4 h-4 text-[#d5a22d]" />
                                                {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-300 ml-6 uppercase">Regional Received</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <StatusBadge status={app.status as ApplicationStatus} />
                                    </td>
                                    <td className="px-10 py-8 text-center">
                                        <Link href={`/dashboard/country-director/applications/${app.id}`}>
                                            <Button size="icon" variant="ghost" className="rounded-2xl text-[#1d1b41] hover:bg-[#1d1b41] hover:text-[#d39c1d] transition-all h-14 w-14 shadow-sm border border-slate-100 hover:border-[#1d1b41] hover:shadow-2xl hover:shadow-[#1d1b41]/20">
                                                <ArrowRight className="w-6 h-6" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-10 py-10 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Admissions Segment <span className="text-[#1d1b41]">{currentPage}</span> of <span className="text-[#1d1b41]">{metadata.totalPages}</span> Result Sets
                    </p>
                    <div className="flex items-center gap-4">
                        <Button
                            disabled={!metadata.hasPrevPage}
                            variant="outline"
                            className="rounded-2xl text-[10px] font-black uppercase tracking-widest px-8 h-14 border-2 border-slate-200 hover:border-[#1d1b41] hover:text-[#1d1b41] bg-white transition-all shadow-sm"
                        >
                            Previous Scope
                        </Button>
                        <Button
                            disabled={!metadata.hasNextPage}
                            className="bg-[#1d1b41] text-white hover:bg-black rounded-2xl text-[10px] font-black uppercase tracking-widest px-10 h-14 shadow-2xl shadow-[#1d1b41]/20 transition-all active:scale-95"
                        >
                            Next Segment
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const styles = {
        DRAFT: "bg-slate-100 text-slate-500 border-slate-200 shadow-slate-100/50",
        PAYMENT_PENDING: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-500/10",
        SUBMITTED: "bg-[#1d1b41] text-[#d5a22d] border-[#1d1b41] shadow-[#1d1b41]/20 font-black",
        COUNTRY_REVIEW: "bg-indigo-50 text-indigo-700 border-indigo-200",
        UNIVERSITY_REVIEW: "bg-violet-50 text-violet-700 border-violet-200",
        OFFER_ISSUED: "bg-emerald-50 text-emerald-700 border-emerald-200",
        OFFER_ACCEPTED: "bg-[#d5a22d] text-[#1d1b41] border-[#d5a22d] shadow-[#d5a22d]/20 font-black",
        ENROLLED: "bg-emerald-600 text-white border-emerald-600 shadow-emerald-500/30 font-black px-6",
        REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
        <span className={`px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all inline-flex items-center gap-2 ${styles[status]}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
            {status.replace(/_/g, ' ')}
        </span>
    );
}
