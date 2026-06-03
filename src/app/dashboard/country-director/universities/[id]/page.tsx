import { getUniversity } from '@/lib/data';
import ProgramPageClient from '@/app/dashboard/school/programs/ProgramPageClient';
import InitiateMessage from '@/components/messaging/InitiateMessage';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { approveUniversity, rejectUniversity } from '@/lib/actions/country-director';
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    XCircle,
    Globe,
    Edit3,
    Calendar
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import UniversityReviewActions from '@/components/country-director/UniversityReviewActions';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const university = await getUniversity(id);

    if (!university) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-semibold">University not found</h2>
                <Button variant="link" asChild>
                    <Link href="/dashboard/country-director/universities">Back to Universities</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/country-director/universities"
                        className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary/10 hover:scale-110 transition-all duration-300 border border-slate-100"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                            <Building2 className="w-3 h-3" />
                            Institution Profile
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">{university.name}</h1>
                        <p className="text-gray-400 mt-1 font-medium flex items-center gap-2">
                            <Globe className="w-4 h-4 text-brand-accent" />
                            Global Operations • {university.country.name}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 border-slate-200 text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary hover:border-brand-primary/10 rounded-2xl font-bold shadow-sm" asChild>
                        <Link href={`/dashboard/country-director/universities/${id}/edit`}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Link>
                    </Button>
                    {university.admins[0]?.id && (
                        <InitiateMessage
                            recipientId={university.admins[0].id}
                            label="Message Admin"
                            className="h-12 px-6 bg-white border-slate-200 text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary hover:border-brand-primary/10 rounded-2xl font-bold shadow-sm"
                        />
                    )}
                    {university.status === 'PENDING' && (
                        <UniversityReviewActions universityId={university.id} />
                    )}
                    {university.status !== 'PENDING' && (
                        <div className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-sm border
                            ${university.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {university.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {university.status}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-8">
                    <Card className="border-none shadow-xl shadow-brand-primary/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                            <CardTitle className="text-xl font-bold flex items-center gap-3 text-brand-primary">
                                <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                Registry Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Programs</label>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{university._count.programs}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Affiliates</label>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{university._count.affiliates}</p>
                                </div>
                            </div>
                            <Separator className="bg-slate-100" />
                            <div className="space-y-6">
                                <div className="group cursor-pointer">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 block">Website</label>
                                    <p className="text-sm font-bold text-brand-primary group-hover:text-brand-primary-hover transition-colors flex items-center gap-2 truncate">
                                        <Globe className="w-4 h-4 text-brand-accent" />
                                        {university.website || 'Not updated'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 block">Registration Date</label>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-brand-accent" />
                                        {new Date(university.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {university.status === 'APPROVED' && (
                        <Card className="border-none shadow-xl shadow-brand-primary/20 rounded-[2.5rem] bg-brand-primary text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <CardContent className="p-8 flex gap-5 items-center">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                    <CheckCircle2 className="w-8 h-8 text-brand-accent" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold tracking-tight">Active Ops</h4>
                                    <p className="text-white/60 text-sm font-medium leading-tight mt-1">Institutional records verified and accessible.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <ProgramPageClient university={university} universityId={university.id} />
                </div>
            </div>
        </div>
    );
}
