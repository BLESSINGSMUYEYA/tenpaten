import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, User, GraduationCap, MapPin, Mail, Users, Sparkles, ArrowLeft } from 'lucide-react';
import StatusUpdateForm from '@/components/school/StatusUpdateForm';
import ReviewToolkit from '@/components/school/ReviewToolkit';
import SchoolDocumentUpload from '@/components/school/SchoolDocumentUpload';
import InitiateMessage from '@/components/messaging/InitiateMessage';
import AlternativeProgramSelector from '@/components/school/AlternativeProgramSelector';
import StatusPipeline, { ApplicationStatus } from '@/components/common/StatusPipeline';
import { getActiveSchoolId } from '@/lib/getActiveSchool';

export default async function SchoolApplicationDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    let universityId = (session?.user as any)?.managedUniversityId;
    const { id } = await params;

    if (userRole !== 'SCHOOL_ADMIN' && userRole !== 'SCHOOL_SUPER_AGENT') {
        redirect('/dashboard');
    }

    if (userRole === 'SCHOOL_SUPER_AGENT') {
        universityId = await getActiveSchoolId();
    } else if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true }
        });
        universityId = dbUser?.managedUniversityId;
    }

    if (!universityId) {
        redirect('/dashboard');
    }

    const application = (await prisma.application.findUnique({
        where: { id },
        include: {
            prospect: true,
            program: {
                include: { university: true }
            },
            statusHistory: {
                orderBy: { createdAt: 'desc' }
            }
        },
    })) as any;

    if (!application || application.program.universityId !== universityId) {
        notFound();
    }

    const isOverride = application.statusHistory.some((h: any) => h.isOverride && h.status === application.status);

    const sections = [
        { id: 'personalInfo', label: 'Identity & Origins', icon: User, data: application.personalInfo as any },
        { id: 'familyInfo', label: 'Kinship Records', icon: Users, data: application.familyInfo as any },
        { id: 'academicInfo', label: 'Scholastic Dossier', icon: GraduationCap, data: application.academicInfo as any },
        { id: 'activitiesInfo', label: 'Merit & Achievements', icon: Sparkles, data: application.activitiesInfo as any },
    ];

    const getStatusStyles = (status: string) => {
        if (status === 'OFFER_ISSUED' || status === 'OFFER_ACCEPTED' || status === 'ENROLLED') 
            return 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/5';
        if (status === 'REJECTED') return 'bg-rose-50 text-rose-700 border-rose-100 shadow-rose-500/5';
        return 'bg-brand-primary text-white border-brand-primary shadow-brand-primary/20';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 px-4 sm:px-6">
            {/* Admissions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 sm:p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/5 rounded-full blur-[100px] -mr-40 -mt-40" />
                
                <div className="relative z-10 space-y-8">
                    <Link
                        href={`/dashboard/school/applications?panel=${id}`}
                        className="inline-flex items-center gap-2.5 text-slate-400 hover:text-brand-primary transition-all group text-[11px] font-black uppercase tracking-[0.2em]"
                    >
                        <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1.5 transition-transform" />
                        Application Registry
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-brand-primary flex items-center justify-center text-brand-accent text-4xl font-black shadow-2xl shadow-brand-primary/30 border-4 border-white">
                            {application.prospect.fullName.charAt(0)}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl sm:text-5xl font-black text-brand-primary tracking-tight leading-[0.9]">
                                {application.prospect.fullName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
                                <span className="flex items-center gap-2.5"><Mail className="w-4.5 h-4.5 text-brand-accent" /> {application.prospect.email}</span>
                                <span className="hidden sm:inline text-slate-200">|</span>
                                <span className="flex items-center gap-2.5 uppercase tracking-widest text-xs font-black"><MapPin className="w-4.5 h-4.5 text-brand-accent" /> {application.id.slice(-8)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-4">
                    <InitiateMessage
                        recipientId={application.prospectId}
                        label="Internal Message"
                        className="flex items-center gap-3 px-8 py-4.5 bg-white border border-slate-100 text-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all shadow-xl shadow-brand-primary/5 group active:scale-95"
                    />
                    <div className={`px-8 py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 border ${getStatusStyles(application.status)}`}>
                        <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                        {application.status.replace(/_/g, ' ')}
                    </div>
                </div>
            </div>

            {/* Lifecycle Pipeline */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-brand-primary/5 p-8 sm:p-12 overflow-x-auto custom-scrollbar">
                <div className="min-w-[900px]">
                    <div className="mb-12 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-brand-primary tracking-tight mb-2">Lifecycle Pipeline</h2>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Admissions Milestone Tracker</p>
                        </div>
                        <div className="text-[11px] font-black text-brand-accent bg-brand-accent/10 px-5 py-2.5 rounded-full uppercase tracking-[0.2em] border border-brand-accent/20 shadow-sm">
                            Real-time Status Sync Active
                        </div>
                    </div>
                    <StatusPipeline 
                        currentStatus={application.status as ApplicationStatus} 
                        isOverride={isOverride}
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Dossier Content */}
                <div className="flex-1 space-y-10">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group">
                        <div className="p-8 sm:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <h2 className="text-2xl font-black text-brand-primary tracking-tight flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center shadow-sm">
                                    <GraduationCap className="w-6 h-6 text-brand-accent" />
                                </div>
                                Academic Vector
                            </h2>
                        </div>
                        <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {[
                                { label: 'Target Program', value: application.program.name },
                                { label: 'Academic Level', value: application.program.level || 'Standard' },
                                { label: 'Duration', value: application.program.duration || 'Full-time' },
                                { label: 'Intake Cyce', value: application.program.intake || 'Autumn 2024' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all duration-300">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2 leading-none">{item.label}</p>
                                    <p className="text-[15px] font-black text-brand-primary leading-tight">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {sections.map((section) => (
                        section.data && (
                            <div key={section.id} className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden group">
                                <div className="p-8 sm:p-10 border-b border-slate-50 flex items-center gap-5 bg-slate-50/30">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center group-hover:bg-brand-primary transition-all duration-500">
                                        <section.icon className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-all" />
                                    </div>
                                    <h2 className="text-2xl font-black text-brand-primary tracking-tight">{section.label}</h2>
                                </div>
                                <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    {Object.entries(section.data).map(([key, value]: [string, any]) => (
                                        <div key={key} className="space-y-3">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none px-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <div className="text-[15px] text-brand-primary font-black p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-white group-hover:border-slate-100 transition-all shadow-sm">
                                                {value?.toString() || <span className="text-slate-200 font-bold italic">Unassigned</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Logistics & Controls */}
                <div className="lg:w-[420px] space-y-10">
                    <ReviewToolkit
                        applicationId={id}
                        initialReviewData={application.reviewData}
                        personalInfo={application.personalInfo}
                        academicInfo={application.academicInfo}
                        documents={application.documents as any[]}
                    />

                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden sticky top-10">
                        <div className="p-10 border-b border-slate-100 bg-brand-primary text-white relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/10 rounded-full blur-2xl -mr-12 -mt-12" />
                            <h2 className="text-2xl font-black tracking-tight leading-none relative z-10">Decision Control</h2>
                            <p className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mt-3 relative z-10">Executive Actions</p>
                        </div>
                        <div className="p-8 sm:p-10 space-y-10">
                            <StatusUpdateForm applicationId={id} currentStatus={application.status} />
                            <div className="h-px bg-slate-100" />
                            <AlternativeProgramSelector applicationId={id} />
                            <div className="h-px bg-slate-100" />
                            <SchoolDocumentUpload
                                applicationId={id}
                                documents={{
                                    offerLetterUrl: application.offerLetterUrl,
                                    acceptanceLetterUrl: application.acceptanceLetterUrl,
                                    enrollmentDetailsUrl: application.enrollmentDetailsUrl
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
