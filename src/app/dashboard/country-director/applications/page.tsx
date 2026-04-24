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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Regional Applications</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Monitor and verify all student applications within your jurisdiction.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#d5a22d]/10 text-[#d5a22d] rounded-xl text-sm font-black uppercase tracking-widest border border-[#d5a22d]/20">
                    <FileText className="w-4 h-4" />
                    <span>{metadata.total} Total Submissions</span>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-1 min-w-[300px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d5a22d] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by student name, email, or university..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-0 rounded-xl text-sm font-medium transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="rounded-xl border-gray-200 text-gray-600 font-bold flex gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Sort & Filter</span>
                    </Button>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#36335e] text-white">
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Student Details</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Program & School</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Submitted On</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[#36335e]/5 flex items-center justify-center text-[#36335e] group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-[#36335e] group-hover:text-[#d5a22d] transition-colors">
                                                    {app.prospect.fullName}
                                                </h3>
                                                <p className="text-xs font-bold text-gray-400 mt-0.5">{app.prospect.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-sm font-black text-[#36335e]">
                                                <GraduationCap className="w-4 h-4 text-[#d5a22d]" />
                                                <span className="truncate max-w-[200px]">{app.program.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tight">
                                                <Building2 className="w-3.5 h-3.5 text-slate-300" />
                                                <span>{app.program.university.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <StatusBadge status={app.status as ApplicationStatus} />
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Link href={`/dashboard/country-director/applications/${app.id}`}>
                                            <Button size="icon" variant="ghost" className="rounded-xl text-[#36335e] hover:bg-[#36335e] hover:text-[#d5a22d] transition-all">
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Page {currentPage} of {metadata.totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={!metadata.hasPrevPage}
                            variant="outline"
                            className="rounded-xl text-xs font-black uppercase tracking-[0.1em]"
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={!metadata.hasNextPage}
                            className="bg-[#36335e] text-[#d5a22d] hover:bg-[#2a284a] rounded-xl text-xs font-black uppercase tracking-[0.1em]"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
    const styles = {
        DRAFT: "bg-gray-100 text-gray-500 border-gray-200",
        PAYMENT_PENDING: "bg-indigo-50 text-indigo-600 border-indigo-100",
        SUBMITTED: "bg-blue-50 text-blue-600 border-blue-100",
        COUNTRY_REVIEW: "bg-amber-50 text-amber-600 border-amber-100",
        UNIVERSITY_REVIEW: "bg-purple-50 text-purple-600 border-purple-100",
        OFFER_ISSUED: "bg-[#d5a22d]/10 text-[#d5a22d] border-[#d5a22d]/20",
        OFFER_ACCEPTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
        ENROLLED: "bg-[#36335e] text-[#d5a22d] border-[#36335e]",
        REJECTED: "bg-red-50 text-red-600 border-red-100",
    };

    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${styles[status]}`}>
            {status.replace('_', ' ')}
        </span>
    );
}
