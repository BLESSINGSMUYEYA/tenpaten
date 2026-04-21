import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import UniversityProfileForm from '@/components/school/UniversityProfileForm';
import prisma from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Building2,
    CheckCircle2,
    XCircle,
    Globe,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';

export default async function SchoolProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    if (session.user.role !== 'SCHOOL_ADMIN') {
        redirect('/dashboard');
    }

    let universityId = (session?.user as any)?.managedUniversityId;

    if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    const university = universityId ? await prisma.university.findUnique({
        where: { id: universityId },
        include: {
            country: true,
            _count: {
                select: {
                    programs: true,
                    affiliates: true
                }
            }
        }
    }) : null;

    if (!university) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-black text-[#36335e]">University not found</h2>
                <Button variant="link" asChild className="text-[#d5a22d] font-bold">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        );
    }

    const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });

    return (
        <div className="w-full pb-12 animate-in fade-in duration-700">
            <div className="mb-8">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-[#36335e] transition-colors group mb-6"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                
                <PageHeader 
                    preTitle={
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.3em] border border-[#d5a22d]/20">
                            <Building2 className="w-3.5 h-3.5" />
                            Profile Management
                        </div>
                    }
                    title={university.name}
                    subtitle={
                        <span className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#d5a22d]" />
                            {university.country?.name} • Global Education Partner
                        </span>
                    }
                    action={
                        university.status !== 'PENDING' && (
                            <div className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-sm border
                                ${university.status === 'APPROVED' ? 'bg-[#d5a22d]/10 text-[#d5a22d] border-[#d5a22d]/20' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {university.status === 'APPROVED' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {university.status}
                            </div>
                        )
                    }
                />
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-8">
                    {/* Registry Data Container */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#36335e]/10 overflow-hidden border border-gray-100 p-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#36335e]/5 flex items-center justify-center text-[#36335e]">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-[#36335e] tracking-tight">Registry Logic</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Live Statistics</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Programs</label>
                                <p className="text-3xl font-black text-[#36335e] tracking-tight">{university._count?.programs || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Affiliates</label>
                                <p className="text-3xl font-black text-[#36335e] tracking-tight">{university._count?.affiliates || 0}</p>
                            </div>
                        </div>
                        
                        <Separator className="bg-slate-100" />
                        
                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 block">Institutional Website</label>
                                <a href={university.website || '#'} target="_blank" className="text-sm font-bold text-[#36335e] hover:text-[#d5a22d] transition-colors flex items-center gap-2 truncate">
                                    <Globe className="w-4 h-4 text-[#d5a22d]" />
                                    {university.website || 'No website provided'}
                                </a>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 block">Registration Timestamp</label>
                                <p className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#d5a22d]" />
                                    {new Date(university.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Status Highlight */}
                    {university.status === 'APPROVED' && (
                        <Card className="border-none shadow-2xl shadow-[#36335e]/20 rounded-[2.5rem] bg-[#36335e] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/20 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <CardContent className="p-8 flex gap-5 items-center">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                    <CheckCircle2 className="w-8 h-8 text-[#d5a22d]" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black tracking-tight">Verified Platform Partner</h4>
                                    <p className="text-white/60 text-[11px] font-medium leading-tight">Your institutional records are verified and visible.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#36335e]/10 overflow-hidden border border-gray-100">
                        <UniversityProfileForm university={university} countries={countries} />
                    </div>
                </div>
            </div>
        </div>
    );
}
