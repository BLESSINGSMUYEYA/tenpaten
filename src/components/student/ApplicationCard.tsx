'use client';

import StatusPipeline, { ApplicationStatus } from '@/components/common/StatusPipeline';
import { Building2, Calendar, Clock, ArrowRight, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type ApplicationCardProps = {
    application: {
        id: string;
        programId: string;
        status: ApplicationStatus;
        createdAt: Date;
        updatedAt: Date;
        program: {
            name: string;
            university: {
                name: string;
            };
        };
    };
    showProgress?: boolean;
};

const statusConfig: Record<string, { color: string; bgColor: string; borderColor: string; label: string; icon: React.ReactNode }> = {
    DRAFT: { color: 'text-slate-700', bgColor: 'bg-gray-100', borderColor: 'border-gray-200', label: 'Draft', icon: <FileText className="w-4 h-4" /> },
    PAYMENT_PENDING: { color: 'text-[#d5a22d]', bgColor: 'bg-[#d5a22d]/5', borderColor: 'border-[#d5a22d]/20', label: 'Payment', icon: <Clock className="w-4 h-4" /> },
    SUBMITTED: { color: 'text-[#1d1b41]', bgColor: 'bg-[#1d1b41]/5', borderColor: 'border-[#1d1b41]/10', label: 'Submitted', icon: <CheckCircle2 className="w-4 h-4" /> },
    COUNTRY_REVIEW: { color: 'text-[#1d1b41]', bgColor: 'bg-[#1d1b41]/5', borderColor: 'border-[#1d1b41]/10', label: 'Region Review', icon: <Clock className="w-4 h-4" /> },
    UNIVERSITY_REVIEW: { color: 'text-[#1d1b41]', bgColor: 'bg-[#1d1b41]/5', borderColor: 'border-[#1d1b41]/10', label: 'Uni Review', icon: <Clock className="w-4 h-4" /> },
    OFFER_ISSUED: { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', label: 'Offer Issued', icon: <CheckCircle2 className="w-4 h-4" /> },
    OFFER_ACCEPTED: { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', label: 'Accepted', icon: <CheckCircle2 className="w-4 h-4" /> },
    ENROLLED: { color: 'text-[#d5a22d]', bgColor: 'bg-[#d5a22d]/10', borderColor: 'border-[#d5a22d]/30', label: 'Enrolled', icon: <CheckCircle2 className="w-4 h-4" /> },
    REJECTED: { color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: 'border-rose-200', label: 'Rejected', icon: <AlertCircle className="w-4 h-4" /> },
};

export default function ApplicationCard({ application, showProgress = true }: ApplicationCardProps) {
    const config = statusConfig[application.status] || statusConfig.DRAFT;

    const getTimeAgo = (date: Date) => {
        const now = new Date();
        const diffInMs = now.getTime() - new Date(date).getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 hover:border-[#d5a22d]/20 shadow-sm hover:shadow-xl hover:shadow-[#1d1b41]/5 transition-all duration-500 hover:-translate-y-1">
            <div className="p-6 text-left">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#d5a22d] mb-1">
                            Application Entry
                        </p>
                        <h3 className="text-lg font-black text-[#1d1b41] mb-1 group-hover:text-[#d5a22d] transition-colors leading-tight line-clamp-1">
                            {application.program.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                            <span className="font-bold truncate">{application.program.university.name}</span>
                        </div>
                    </div>

                    <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${config.borderColor} ${config.bgColor}`}>
                        <div className={`${config.color}`}>{config.icon}</div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* Pipeline Progress */}
                {showProgress && (
                    <div className="mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-left">Journey Status</p>
                        <StatusPipeline currentStatus={application.status} compact />
                    </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Applied</p>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {getTimeAgo(application.createdAt)}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Last Update</p>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {getTimeAgo(application.updatedAt)}
                        </div>
                    </div>
                </div>

                {/* Action button */}
                <Link
                    href={application.status === 'DRAFT' 
                        ? `/dashboard/apply?programId=${application.programId}&draftId=${application.id}` 
                        : `/dashboard/applications/${application.id}`
                    }
                    className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-[#1d1b41] hover:bg-[#2a285a] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#1d1b41]/20 transition-all active:scale-95"
                >
                    <span>{application.status === 'DRAFT' ? 'Resume Application' : 'Track Status'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Decorative gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d5a22d]/0 to-[#d5a22d]/0 group-hover:from-[#d5a22d]/5 group-hover:to-[#d5a22d]/5 transition-all duration-300 pointer-events-none" />
        </div>
    );
}
