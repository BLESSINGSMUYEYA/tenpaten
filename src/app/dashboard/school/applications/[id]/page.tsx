import StatusPipeline, { ApplicationStatus } from '@/components/common/StatusPipeline';

export default async function SchoolApplicationDetails({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    const universityId = (session?.user as any)?.managedUniversityId;
    const { id } = await params;

    if (userRole !== 'SCHOOL_ADMIN' || !universityId) {
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
        return 'bg-[#1d1b41] text-white border-[#1d1b41] shadow-[#1d1b41]/20';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            {/* Admissions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-10 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d5a22d]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10 space-y-6">
                    <Link
                        href="/dashboard/school/applications"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-[#1d1b41] transition-colors group text-[10px] font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Application Registry
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-[#1d1b41] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[#1d1b41]/20 border-4 border-white">
                            {application.prospect.fullName.charAt(0)}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl sm:text-4xl font-black text-[#1d1b41] tracking-tight leading-none">
                                {application.prospect.fullName}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#d5a22d]" /> {application.prospect.email}</span>
                                <span className="text-[#d5a22d]/30">&bull;</span>
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#d5a22d]" /> ID: {application.id.slice(-8).toUpperCase()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-4">
                    <InitiateMessage
                        recipientId={application.prospectId}
                        label="Internal Message"
                        className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 text-[#1d1b41] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1d1b41] hover:text-white transition-all shadow-xl shadow-[#1d1b41]/5 group active:scale-95"
                    />
                    <div className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 border ${getStatusStyles(application.status)}`}>
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
                            <h2 className="text-2xl font-black text-[#1d1b41] tracking-tight mb-1">Lifecycle Pipeline</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admissions Milestone Tracker</p>
                        </div>
                        <div className="text-[10px] font-black text-[#d5a22d] bg-[#d5a22d]/5 px-4 py-2 rounded-full uppercase tracking-widest border border-[#d5a22d]/10">
                            Real-time Status Sync Active
                        </div>
                    </div>
                    <StatusPipeline currentStatus={application.status as ApplicationStatus} />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Dossier Content */}
                <div className="flex-1 space-y-10">
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                            <h2 className="text-2xl font-black text-[#1d1b41] tracking-tight flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#d5a22d]/10 flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-[#d5a22d]" />
                                </div>
                                Academic Vector
                            </h2>
                        </div>
                        <div className="p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: 'Target Program', value: application.program.name },
                                { label: 'Academic Level', value: application.program.level || 'Standard' },
                                { label: 'Duration', value: application.program.duration || 'Full-time' },
                                { label: 'Intake Cyce', value: application.program.intake || 'Autumn 2024' }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#d5a22d] transition-colors">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{item.label}</p>
                                    <p className="text-sm font-black text-[#1d1b41] leading-tight">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {sections.map((section) => (
                        section.data && (
                            <div key={section.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <div className="p-10 border-b border-gray-100 flex items-center gap-4 bg-gray-50/30">
                                    <div className="w-10 h-10 rounded-xl bg-[#1d1b41]/5 flex items-center justify-center">
                                        <section.icon className="w-6 h-6 text-[#1d1b41] group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h2 className="text-2xl font-black text-[#1d1b41] tracking-tight">{section.label}</h2>
                                </div>
                                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                    {Object.entries(section.data).map(([key, value]: [string, any]) => (
                                        <div key={key} className="space-y-2">
                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                            <div className="text-sm text-[#1d1b41] font-black p-5 bg-gray-50/50 rounded-2xl border border-gray-50 group-hover:bg-white group-hover:border-slate-100 transition-all">
                                                {value?.toString() || <span className="text-slate-300 font-medium italic">Unassigned</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {/* Logistics & Controls */}
                <div className="lg:w-[400px] space-y-10">
                    <ReviewToolkit
                        applicationId={id}
                        initialReviewData={application.reviewData}
                        personalInfo={application.personalInfo}
                        academicInfo={application.academicInfo}
                        documents={application.documents as any[]}
                    />

                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden sticky top-10">
                        <div className="p-10 border-b border-gray-100 bg-[#1d1b41] text-white">
                            <h2 className="text-2xl font-black tracking-tight leading-none">Decision Control</h2>
                            <p className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.3em] mt-2">Executive Actions</p>
                        </div>
                        <div className="p-10 space-y-8">
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

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, User, GraduationCap, MapPin, Calendar, Mail, Phone, CheckCircle2, XCircle, AlertCircle, Clock, Users, Sparkles, MessageSquare, ArrowLeft } from 'lucide-react';
import StatusUpdateForm from '@/components/school/StatusUpdateForm';
import ReviewToolkit from '@/components/school/ReviewToolkit';
import SchoolDocumentUpload from '@/components/school/SchoolDocumentUpload';
import InitiateMessage from '@/components/messaging/InitiateMessage';
import AlternativeProgramSelector from '@/components/school/AlternativeProgramSelector';

