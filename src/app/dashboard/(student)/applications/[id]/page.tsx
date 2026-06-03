import StatusPipeline, { ApplicationStatus } from '@/components/common/StatusPipeline';
import RedirectionResponse from '@/components/student/RedirectionResponse';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const application = await getApplicationDetails(id) as any;

    if (!application) {
        notFound();
    }

    const isEditable = application.status !== 'REJECTED' && application.status !== 'ENROLLED';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SUBMITTED':
            case 'COUNTRY_REVIEW':
            case 'UNIVERSITY_REVIEW':
                return 'bg-[#1d1b41]/5 text-[#1d1b41] border-[#1d1b41]/10';
            case 'OFFER_ISSUED':
            case 'OFFER_ACCEPTED':
            case 'ENROLLED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'REJECTED':
                return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'PAYMENT_PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header Section — Premium Midnight Navy */}
            <div className="relative overflow-hidden rounded-[3rem] bg-[#1d1b41] p-8 sm:p-12 shadow-2xl shadow-[#1d1b41]/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-[100px] -ml-32 -mb-32" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="flex-1 space-y-6">
                        <Link
                            href="/dashboard/applications"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group text-xs font-black uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Applications
                        </Link>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">Institutional Application</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
                                {application.program.name}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                <Building2 className="w-4 h-4 text-brand-accent" />
                                <span className="text-xs font-bold text-white/90">{application.program.university.name}</span>
                            </div>
                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-xl backdrop-blur-md ${getStatusColor(application.status)}`}>
                                {application.status.replace(/_/g, ' ')}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-8 rounded-[2.5rem] bg-black/20 backdrop-blur-xl border border-white/10">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-brand-accent uppercase tracking-[0.3em]">Reference ID</p>
                            <p className="text-sm font-black text-white uppercase tracking-tighter">#{application.id.slice(-8)}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black text-brand-accent uppercase tracking-[0.3em]">Cycle</p>
                            <p className="text-sm font-black text-white">2024 / 2025</p>
                        </div>
                        <div className="space-y-1 pt-4 border-t border-white/5">
                            <p className="text-[9px] font-black text-brand-accent uppercase tracking-[0.3em]">Submission</p>
                            <p className="text-sm font-black text-white">
                                {format(new Date(application.createdAt), 'MMM dd, yyyy')}
                            </p>
                        </div>
                        <div className="space-y-1 pt-4 border-t border-white/5 text-right">
                            <p className="text-[9px] font-black text-brand-accent uppercase tracking-[0.3em]">Last Updated</p>
                            <p className="text-sm font-black text-white">
                                {format(new Date(application.updatedAt), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alternative Program Suggestion */}
            {application.alternativeProgramId && application.alternativeStatus === 'PENDING' && (
                <RedirectionResponse 
                    applicationId={id} 
                    alternativeProgram={application.alternativeProgram} 
                />
            )}

            {/* Journey Tracker — The new StatusPipeline */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-[#1d1b41]/5 p-8 sm:p-12 overflow-x-auto custom-scrollbar">
                <div className="min-w-[800px]">
                    <div className="mb-8">
                        <h2 className="text-xl font-black text-[#1d1b41] tracking-tight mb-1">Application Journey</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time progress and milestone tracking</p>
                    </div>
                    <StatusPipeline currentStatus={application.status as ApplicationStatus} />
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Official Artifacts — Only shown if they exist */}
                    {(application.offerLetterUrl || application.acceptanceLetterUrl || application.enrollmentDetailsUrl) && (
                        <div className="rounded-[3rem] border border-emerald-100 bg-emerald-50/30 p-8 sm:p-10 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                           <div className="relative z-10">
                               <div className="flex items-center gap-3 mb-8">
                                   <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                       <Download className="w-5 h-5" />
                                   </div>
                                   <div>
                                       <h2 className="text-xl font-black text-emerald-900 tracking-tight leading-none mb-1">Success Artifacts</h2>
                                       <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest">Official documentation from the university</p>
                                   </div>
                               </div>

                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   {application.offerLetterUrl && (
                                       <a
                                           href={application.offerLetterUrl}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="p-5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all flex items-center justify-between group/card"
                                       >
                                           <div className="flex items-center gap-4">
                                               <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/card:scale-110 transition-transform">
                                                   <FileText className="w-5 h-5" />
                                               </div>
                                               <div>
                                                   <p className="text-xs font-black text-emerald-900 leading-none mb-1 uppercase tracking-tight">Offer Letter</p>
                                                   <p className="text-[10px] font-bold text-emerald-600/70">Official Admission</p>
                                               </div>
                                           </div>
                                           <ArrowLeft className="w-4 h-4 text-emerald-300 rotate-180" />
                                       </a>
                                   )}
                                   {application.acceptanceLetterUrl && (
                                       <a
                                           href={application.acceptanceLetterUrl}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="p-5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:shadow-xl transition-all flex items-center justify-between group/card"
                                       >
                                           <div className="flex items-center gap-4">
                                               <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/card:scale-110 transition-transform">
                                                   <CheckCircle2 className="w-5 h-5" />
                                               </div>
                                               <div>
                                                   <p className="text-xs font-black text-emerald-900 leading-none mb-1 uppercase tracking-tight">Seat Confirmed</p>
                                                   <p className="text-[10px] font-bold text-emerald-600/70">Acceptance Success</p>
                                               </div>
                                           </div>
                                           <ArrowLeft className="w-4 h-4 text-emerald-300 rotate-180" />
                                       </a>
                                   )}
                               </div>
                           </div>
                        </div>
                    )}

                    {/* Program Information */}
                    <div className="rounded-[3rem] border border-gray-100 bg-white p-8 sm:p-12 shadow-sm">
                        <div className="flex items-start gap-6 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-[#1d1b41]/5 flex items-center justify-center border border-[#1d1b41]/10 text-[#1d1b41]">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <div className="flex-1 pt-1">
                                <h2 className="text-2xl font-black text-[#1d1b41] tracking-tight leading-none mb-2">Academic Profile</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">Verification of your targeted program of study</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <Clock className="w-4 h-4 text-brand-accent" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Date</span>
                                </div>
                                <p className="text-lg font-black text-[#1d1b41]">
                                    {format(new Date(application.createdAt), 'MMMM dd, yyyy')}
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <CreditCard className="w-4 h-4 text-brand-accent" />
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Application Fee</span>
                                </div>
                                <p className="text-lg font-black text-[#1d1b41]">
                                    {application.program.university.applicationFeeAmount 
                                        ? `${application.program.university.applicationFeeCurrency} ${application.program.university.applicationFeeAmount.toLocaleString()}`
                                        : 'Waived'}
                                </p>
                            </div>
                        </div>

                        {/* Resource Center for this Program */}
                        <div className="mt-8 p-8 rounded-[2.5rem] bg-[#1d1b41] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16" />
                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black tracking-tight leading-none">Need assistance?</h3>
                                    <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Chat with an advisor about this program</p>
                                </div>
                                <Link
                                    href={`/dashboard/messages?recipientId=${application.program.university.id}`}
                                    className="px-8 py-4 rounded-2xl bg-brand-accent hover:bg-[#c29329] text-[#1a1b41] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-brand-accent/20 text-center"
                                >
                                    Message University
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="rounded-[3rem] border border-gray-100 bg-white p-8 sm:p-12 shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#1d1b41] tracking-tight leading-none mb-1">Dossier Repository</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage your required academic documentation</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <DocumentList
                                documents={application.documents}
                                applicationId={application.id}
                                readonly={!isEditable}
                            />

                            {isEditable && (
                                <div className="pt-10 border-t border-gray-100">
                                    <div className="mb-6">
                                        <h3 className="text-sm font-black text-[#1d1b41] uppercase tracking-widest">Upload New Records</h3>
                                        <p className="text-xs text-slate-400 font-medium">Add missing or updated documents to your application file.</p>
                                    </div>
                                    <DocumentUpload applicationId={application.id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-8">
                    {/* Detailed status timeline */}
                    <div className="rounded-[3rem] border border-gray-100 bg-white p-8 sm:p-10 shadow-sm sticky top-6">
                        <div className="mb-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <h2 className="text-lg font-black text-[#1d1b41] tracking-tight mb-1">Detailed Logs</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Chronological status history</p>
                        </div>
                        <ApplicationTimeline
                            currentStatus={application.status}
                            statusHistory={application.statusHistory}
                        />
                        
                        {/* Final Celebratory Call to Action if Enrolled */}
                        {application.status === 'ENROLLED' && (
                            <div className="mt-8 p-8 rounded-[2rem] bg-linear-to-br from-brand-accent to-[#b88e24] text-white shadow-xl shadow-brand-accent/20 relative overflow-hidden text-center">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-12 -mt-12" />
                                <PartyPopper className="w-10 h-10 mx-auto mb-4 text-white drop-shadow-lg" />
                                <h3 className="text-lg font-black mb-2 leading-tight">Student Enrollment Secured!</h3>
                                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-6">Welcome to your academic future</p>
                                <button className="w-full py-4 rounded-xl bg-[#1d1b41] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-colors shadow-lg">
                                    Final Enrollment Handbook
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Payment Section */}
                    {application.status === 'PAYMENT_PENDING' && (
                        <div className="sticky top-6">
                            <ApplicationPaymentSection 
                                applicationId={application.id}
                                universityName={application.program.university.name}
                                applicationFee={application.program.university.applicationFeeAmount || 0}
                                currency={application.program.university.applicationFeeCurrency || 'MWK'}
                                isDevelopment={process.env.NODE_ENV === 'development'}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { getApplicationDetails } from '@/lib/data';
import { notFound } from 'next/navigation';
import DocumentUpload from '@/components/document-upload';
import DocumentList from '@/components/document-list';
import ApplicationTimeline from '@/components/student/ApplicationTimeline';
import { format } from 'date-fns';

import Link from 'next/link';
import { ArrowLeft, Building2, Calendar, FileText, Download, CheckCircle2, Clock, MessageSquare, CreditCard, PartyPopper } from 'lucide-react';
import ApplicationPaymentSection from '@/components/student/ApplicationPaymentSection';

