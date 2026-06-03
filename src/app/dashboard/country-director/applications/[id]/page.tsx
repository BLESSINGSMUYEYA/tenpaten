import StatusPipeline, { ApplicationStatus } from '@/components/common/StatusPipeline';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const application = await getApplicationDetails(id);

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-semibold">Application not found</h2>
                <Button variant="link" asChild>
                    <Link href="/dashboard/country-director/applications">Back to Applications</Link>
                </Button>
            </div>
        );
    }

    const personalInfo = application.personalInfo as any || {};
    const academicInfo = application.academicInfo as any || {};
    const documents = application.documents as any[] || [];

    const getStatusStyles = (status: string) => {
        if (status === 'SUBMITTED') return 'bg-[#1d1b41] text-brand-accent border-[#1d1b41] shadow-[#1d1b41]/20';
        if (status === 'REJECTED') return 'bg-rose-50 text-rose-700 border-rose-100';
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Admissions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <Link
                        href="/dashboard/country-director/applications"
                        className="h-16 w-16 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#1d1b41] hover:border-[#1d1b41]/20 hover:scale-110 transition-all duration-500 shadow-inner group"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1b41]/10 text-[#1d1b41] text-[10px] font-black uppercase tracking-[0.2em] border border-[#1d1b41]/10">
                            <FileCheck className="w-3.5 h-3.5" />
                            Regional Verification Portal
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1d1b41] tracking-tight leading-none">{application.prospect.fullName}</h1>
                        <p className="text-slate-500 font-bold flex flex-wrap items-center gap-3 text-sm">
                            <span className="flex items-center gap-2 text-brand-accent"><GraduationCap className="w-5 h-5" /> {application.program.name}</span>
                            <span className="text-slate-200">|</span>
                            <span className="flex items-center gap-2"><Building2 className="w-5 h-5 text-slate-300" /> {application.program.university.name}</span>
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-4">
                    <InitiateMessage
                        recipientId={application.prospect.id}
                        label="Direct Message"
                        className="h-14 px-8 bg-white border-2 border-slate-100 text-[#1d1b41] hover:bg-[#1d1b41] hover:text-white hover:border-[#1d1b41] rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 transition-all active:scale-95"
                    />
                    <div className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl border transition-all ${getStatusStyles(application.status)}`}>
                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {application.status.replace(/_/g, ' ')}
                    </div>
                </div>
            </div>

            {/* Lifecycle Pipeline */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-[#1d1b41]/5 p-10 overflow-x-auto custom-scrollbar">
                <div className="min-w-[900px]">
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-[#1d1b41] tracking-tight mb-1">Status Progression</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Application Lifecycle Tracker</p>
                        </div>
                        <div className="text-[10px] font-black text-brand-accent bg-brand-accent/5 px-4 py-2 rounded-full uppercase tracking-widest border border-brand-accent/10">
                            Authorized Regional Review
                        </div>
                    </div>
                    <StatusPipeline currentStatus={application.status as ApplicationStatus} />
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-10">
                    <Card className="border-none shadow-2xl shadow-[#1d1b41]/5 rounded-[3rem] overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-[#1d1b41]/5 text-[#1d1b41] border border-[#1d1b41]/10">
                                    <FileCheck className="w-7 h-7" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black text-[#1d1b41] tracking-tight">Review Console</CardTitle>
                                    <CardDescription className="font-bold text-slate-400 mt-1 uppercase tracking-widest text-[10px]">Execute Admissions Decisions</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <StatusUpdater applicationId={application.id} currentStatus={application.status} />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Card className="border-none shadow-xl shadow-[#1d1b41]/5 rounded-[3rem] overflow-hidden group">
                            <CardHeader className="bg-slate-50/30 border-b border-slate-50 p-10 pb-6">
                                <CardTitle className="text-lg font-black text-[#1d1b41] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#1d1b41]/5 flex items-center justify-center text-[#1d1b41] group-hover:bg-[#1d1b41] group-hover:text-brand-accent transition-all">
                                        <User className="w-5 h-5" />
                                    </div>
                                    Personal Dossier
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 space-y-6">
                                {[
                                    { label: 'Primary Contact', value: application.prospect.email },
                                    { label: 'Mobile Network', value: personalInfo.phone || 'N/A' },
                                    { label: 'Citizenship', value: personalInfo.nationality || 'N/A' },
                                    { label: 'Travel ID', value: personalInfo.passportNumber || 'N/A' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-1.5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">{item.label}</span>
                                        <span className="text-sm font-black text-[#1d1b41] break-all">{item.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl shadow-[#1d1b41]/5 rounded-[3rem] overflow-hidden group">
                            <CardHeader className="bg-slate-50/30 border-b border-slate-50 p-10 pb-6">
                                <CardTitle className="text-lg font-black text-[#1d1b41] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-[#1d1b41] transition-all">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    Academic Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 space-y-6">
                                {[
                                    { label: 'Highest Credential', value: academicInfo.highestQualification || 'N/A' },
                                    { label: 'Prior Academy', value: academicInfo.lastInstitution || 'N/A' },
                                    { label: 'Match Grade (GPA)', value: academicInfo.gpa || 'N/A' },
                                    { label: 'Cohort Year', value: academicInfo.graduationYear || 'N/A' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-1.5 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">{item.label}</span>
                                        <span className="text-sm font-black text-[#1d1b41]">{item.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-none shadow-2xl shadow-[#1d1b41]/5 rounded-[3rem] overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10">
                            <CardTitle className="text-2xl font-black text-[#1d1b41] tracking-tight flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-brand-accent/10 text-brand-accent border border-brand-accent/10">
                                    <FileText className="w-7 h-7" />
                                </div>
                                Verification Vault
                            </CardTitle>
                            <CardDescription className="font-bold text-slate-400 mt-1 uppercase tracking-widest text-[10px]">Registry Documents & Credentials</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10">
                            {documents.length === 0 ? (
                                <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                    <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">No credentials uploaded</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {documents.map((doc: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 hover:shadow-2xl hover:shadow-[#1d1b41]/10 hover:border-[#1d1b41]/20 transition-all group overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-12 h-12 bg-brand-accent/5 rounded-full -mr-6 -mt-6 blur-xl" />
                                            <div className="flex items-center gap-5 relative z-10">
                                                <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#1d1b41] group-hover:text-brand-accent transition-all">
                                                    <FileText className="w-7 h-7" />
                                                </div>
                                                <div className="max-w-[140px]">
                                                    <p className="text-sm font-black text-[#1d1b41] truncate">{doc.name || 'Credential'}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{doc.type || 'verify'}</p>
                                                </div>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl hover:bg-[#1d1b41] hover:text-white transition-all relative z-10" asChild>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-10">
                    <Card className="border-none shadow-2xl shadow-[#1d1b41]/30 rounded-[3rem] bg-[#1d1b41] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <CardHeader className="p-10 pb-6">
                            <CardTitle className="text-2xl font-black flex items-center gap-4 relative z-10">
                                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/10">
                                    <Building2 className="w-6 h-6 text-brand-accent" />
                                </div>
                                Academy Logic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-8 relative z-10">
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 group-hover:bg-white/10 transition-all">
                                <h4 className="text-3xl font-black tracking-tight leading-none text-white">{application.program.university.name}</h4>
                                <p className="text-brand-accent text-xs font-black mt-3 uppercase tracking-[0.2em]">{application.program.name}</p>

                                <Separator className="bg-white/10 my-8" />

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Fees Estimate</p>
                                        <p className="text-xl font-black tracking-tighter text-white">
                                            {(application.program.university as any)?.country?.currencySymbol || '$'}
                                            {application.program.baseTuition?.toLocaleString() || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Cycle</p>
                                        <p className="text-xl font-black tracking-tighter text-white">{application.program.duration || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[3rem] overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10 pb-6">
                            <CardTitle className="text-lg font-black flex items-center gap-4 text-[#1d1b41]">
                                <div className="p-3 rounded-2xl bg-[#1d1b41]/5 text-[#1d1b41]">
                                    <Clock className="w-5 h-5" />
                                </div>
                                Event Horizon
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="space-y-12 relative before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-50">
                                {application.statusHistory.map((history, idx) => (
                                    <div key={history.id} className="relative pl-12 group">
                                        <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-white shadow-xl transition-all duration-700
                                            ${idx === 0 ? 'bg-[#1d1b41] ring-8 ring-[#1d1b41]/5 scale-125' : 'bg-slate-200 group-hover:bg-brand-accent'}`} />
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(history.createdAt).toLocaleDateString()}</p>
                                            <p className={`text-sm font-black tracking-tight ${idx === 0 ? 'text-[#1d1b41]' : 'text-slate-500'}`}>{history.status.replace(/_/g, ' ')}</p>
                                            {history.note && (
                                                <div className="mt-4 text-[11px] bg-slate-50/80 p-5 rounded-2xl text-slate-400 font-bold italic border border-slate-100 leading-relaxed shadow-sm group-hover:bg-white group-hover:text-slate-600 transition-all">
                                                    "{history.note}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { getApplicationDetails } from '@/lib/data';
import StatusUpdater from './status-updater';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    GraduationCap,
    FileCheck,
    Clock,
    MessageSquare,
    ExternalLink,
    CheckCircle2,
    Building2,
    Calendar,
    Mail,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import InitiateMessage from '@/components/messaging/InitiateMessage';

