import { getUniversity } from '@/lib/data';
import ProgramManagementClient from '@/app/dashboard/country-director/universities/[id]/ProgramManagementClient';
import InitiateMessage from '@/components/messaging/InitiateMessage';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
                <h2 className="text-xl font-black text-brand-primary">University not found</h2>
                <Button variant="link" asChild className="text-brand-accent font-bold">
                    <Link href="/dashboard/admin/schools">Back to Schools</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/admin/schools"
                        className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-brand-accent hover:scale-110 transition-all duration-300 border border-gray-100"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-brand-accent/20">
                            <Building2 className="w-3 h-3" />
                            System Oversight
                        </div>
                        <h1 className="text-4xl font-black text-brand-primary tracking-tight">{university.name}</h1>
                        <p className="text-gray-500 mt-1 font-medium italic flex items-center gap-2">
                            <Globe className="w-4 h-4 text-brand-accent" />
                            {university.country.name} • Global Education Partner
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {university.admins[0]?.id && (
                        <InitiateMessage
                            recipientId={university.admins[0].id}
                            label="Contact School Admin"
                            className="h-12 px-6 bg-white border-gray-200 text-brand-primary hover:bg-brand-primary/5 hover:border-brand-primary/20 rounded-2xl font-bold shadow-sm"
                        />
                    )}
                    {university.status === 'PENDING' && (
                        <UniversityReviewActions universityId={university.id} />
                    )}
                    {university.status !== 'PENDING' && (
                        <div className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-md border
                            ${university.status === 'APPROVED' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {university.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {university.status}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-8">
                    {/* Registry Data Container */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 overflow-hidden border border-gray-100 p-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-brand-primary tracking-tight">Registry Logic</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Live Statistics</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Programs</label>
                                <p className="text-3xl font-black text-brand-primary tracking-tight">{university._count.programs}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Affiliates</label>
                                <p className="text-3xl font-black text-brand-primary tracking-tight">{university._count.affiliates}</p>
                            </div>
                        </div>
                        
                        <Separator className="bg-slate-100" />
                        
                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 block">Institutional Website</label>
                                <a href={university.website || '#'} target="_blank" className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-2 truncate">
                                    <Globe className="w-4 h-4 text-brand-accent" />
                                    {university.website || 'No website provided'}
                                </a>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 block">Registration Timestamp</label>
                                <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-brand-accent" />
                                    {new Date(university.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Status Highlight */}
                    {university.status === 'APPROVED' && (
                        <Card className="border-none shadow-2xl shadow-brand-primary/20 rounded-[2.5rem] bg-brand-primary text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <CardContent className="p-8 flex gap-5 items-center">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                    <CheckCircle2 className="w-8 h-8 text-brand-accent" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black tracking-tight">Verified Platform Partner</h4>
                                    <p className="text-white/60 text-sm font-medium leading-tight mt-1">Institutional records are verified and visible to all students.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <ProgramManagementClient university={university} />
                </div>
            </div>
        </div>
    );
}
