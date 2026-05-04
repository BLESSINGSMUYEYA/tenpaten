'use client';

import { useState, useTransition } from 'react';
import { X, GraduationCap, Clock, AlertTriangle, ChevronDown, ChevronUp, Send, ExternalLink } from 'lucide-react';
import { ApplicationStatus } from '@prisma/client';
import { StatusBadge } from '@/components/school/StatusBadge';
import OverrideModal from '@/components/school/OverrideModal';
import { updateApplicationStatus } from '@/lib/actions/applications';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface StatusHistoryEntry {
    id: string;
    status: string;
    changedBy: string;
    note: string | null;
    createdAt: Date;
    isOverride: boolean;
    overrideReason: string | null;
}

interface SidePanelApplicant {
    id: string;
    status: ApplicationStatus;
    rank: number | null;
    meritScore: number | null;
    createdAt: Date;
    prospect: { fullName: string; email: string };
    program: { id: string; name: string };
    alternativeProgramId: string | null;
    alternativeStatus: string | null;
    statusHistory: StatusHistoryEntry[];
    academicInfo: any;
    activitiesInfo: any;
    reviewData: any;
}

interface ApplicantSidePanelProps {
    applicant: SidePanelApplicant;
    onClose: () => void;
}

function Section({
    title,
    defaultOpen = false,
    children,
}: {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-8 py-5 hover:bg-slate-50/50 transition-all group"
            >
                <span className="text-xs font-black text-[#36335e]/60 group-hover:text-[#36335e] transition-colors">
                    {title}
                </span>
                {open ? (
                    <ChevronUp className="w-4.5 h-4.5 text-[#d5a22d]" />
                ) : (
                    <ChevronDown className="w-4.5 h-4.5 text-slate-300 group-hover:text-[#36335e]" />
                )}
            </button>
            {open && <div className="px-8 pb-6 space-y-4">{children}</div>}
        </div>
    );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
    const color =
        score >= 80 ? 'bg-emerald-500' :
        score >= 60 ? 'bg-[#d5a22d]' :
        score >= 40 ? 'bg-amber-400' : 'bg-rose-400';

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">{label}</span>
                <span className="font-black text-[#36335e]">{score}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`h-full rounded-full transition-all duration-1000 ${color}`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}

export default function ApplicantSidePanel({ applicant, onClose }: ApplicantSidePanelProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showOverride, setShowOverride] = useState(false);

    const handleIssueOffer = () => {
        startTransition(async () => {
            const result = await updateApplicationStatus(applicant.id, 'OFFER_ISSUED', 'Offer issued from applicant list panel');
            if (result === 'success') {
                toast.success(`Offer issued to ${applicant.prospect.fullName}`);
                router.refresh();
            } else {
                toast.error(result || 'Failed to issue offer');
            }
        });
    };

    const canIssueOffer =
        applicant.status === 'SUBMITTED' ||
        applicant.status === 'UNIVERSITY_REVIEW' ||
        applicant.status === 'COUNTRY_REVIEW';

    const scoreLabel =
        (applicant.meritScore ?? 0) >= 90 ? 'Exceptional' :
        (applicant.meritScore ?? 0) >= 75 ? 'Strong' :
        (applicant.meritScore ?? 0) >= 60 ? 'Good' :
        (applicant.meritScore ?? 0) >= 40 ? 'Average' : 'Developing';

    return (
        <>
            <div
                className="fixed inset-0 bg-[#36335e]/20 backdrop-blur-sm z-30 lg:hidden"
                onClick={onClose}
            />

            <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-slate-100 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
                {/* Header */}
                <div className="bg-[#36335e] text-white p-8 shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/10 rounded-full blur-2xl -mr-16 -mt-16" />
                    <div className="flex items-start justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-5 min-w-0">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#d5a22d] font-black text-xl shrink-0 shadow-lg border border-white/10">
                                {applicant.prospect.fullName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-black text-xl tracking-tight leading-tight truncate">
                                    {applicant.prospect.fullName}
                                </h2>
                                <p className="text-white/60 text-sm font-medium truncate mt-1">
                                    {applicant.prospect.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all shrink-0"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mt-6 flex-wrap relative z-10">
                        <StatusBadge status={applicant.status} size="sm" />
                        {applicant.rank !== null && (
                            <span className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/80 border border-white/5">
                                Rank #{applicant.rank}
                            </span>
                        )}
                        {applicant.meritScore !== null && (
                            <span className="px-3 py-1 rounded-full bg-[#d5a22d]/20 text-[10px] font-black uppercase tracking-widest text-[#d5a22d] border border-[#d5a22d]/10">
                                {scoreLabel} · {applicant.meritScore}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-5 text-sm font-bold text-white/60 relative z-10">
                        <GraduationCap className="w-4 h-4 text-[#d5a22d]" />
                        {applicant.program.name}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    {canIssueOffer && (
                        <Button
                            onClick={handleIssueOffer}
                            disabled={isPending}
                            className="flex-1 h-12 bg-[#36335e] hover:bg-[#2a284a] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#36335e]/20 transition-all active:scale-95"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Issuing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="w-4 h-4" /> Issue Offer
                                </span>
                            )}
                        </Button>
                    )}
                    <Button
                        onClick={() => setShowOverride(true)}
                        variant="outline"
                        className="h-12 px-6 rounded-2xl text-xs font-black uppercase tracking-widest border-amber-200 text-amber-700 hover:bg-amber-50 transition-all"
                    >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Override
                    </Button>
                    <Link
                        href={`/dashboard/school/applications/${applicant.id}`}
                        className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:text-[#36335e] hover:border-[#36335e]/30 hover:bg-[#36335e]/5 transition-all shrink-0"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </Link>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {applicant.meritScore !== null && (
                        <Section title="Merit Breakdown" defaultOpen>
                            <ScoreBar
                                label="Overall Decision Score"
                                score={applicant.meritScore}
                            />
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {applicant.academicInfo?.gpa && (
                                    <div className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-1 border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">GPA / Grade</span>
                                        <span className="font-black text-[#36335e] text-base">{applicant.academicInfo.gpa}</span>
                                    </div>
                                )}
                                {applicant.academicInfo?.testScore && (
                                    <div className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-1 border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{applicant.academicInfo.testType || 'Test Score'}</span>
                                        <span className="font-black text-[#36335e] text-base">{applicant.academicInfo.testScore}</span>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}

                    {applicant.activitiesInfo && Object.keys(applicant.activitiesInfo).length > 0 && (
                        <Section title="Scholastic Achievements">
                            <div className="space-y-3">
                                {Object.entries(applicant.activitiesInfo).slice(0, 5).map(([key, value]: [string, any]) => (
                                    <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{value?.toString()}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {applicant.alternativeProgramId && (
                        <Section title="Admissions Redirection">
                            <div className={`p-5 rounded-[1.5rem] border text-sm font-bold flex flex-col gap-3 ${applicant.alternativeStatus === 'ACCEPTED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : applicant.alternativeStatus === 'REJECTED' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
                                    Alternative suggestion response
                                </div>
                                <p className="font-black text-lg">{applicant.alternativeStatus ?? 'Pending Response'}</p>
                            </div>
                        </Section>
                    )}

                    <Section title="Decision Audit Trail">
                        {applicant.statusHistory.length === 0 ? (
                            <p className="text-sm text-slate-400 font-bold text-center py-4">No activity recorded yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {applicant.statusHistory.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className={`p-4 rounded-2xl border text-sm space-y-2 ${entry.isOverride ? 'bg-amber-50 border-amber-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`font-black uppercase tracking-widest text-[10px] ${entry.isOverride ? 'text-amber-700' : 'text-[#36335e]/60'}`}>
                                                {entry.isOverride && '⚠ Override · '}{entry.status.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {format(new Date(entry.createdAt), 'dd MMM yy HH:mm')}
                                            </span>
                                        </div>
                                        {entry.overrideReason && (
                                            <div className="p-2 bg-white rounded-lg text-amber-700 font-bold text-[11px] border border-amber-100">
                                                {entry.overrideReason}
                                            </div>
                                        )}
                                        {entry.note && (
                                            <p className="text-slate-500 font-bold text-xs leading-relaxed">{entry.note}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    <div className="px-8 py-8 text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] border-t border-slate-50 flex items-center justify-between">
                        <span>Application Initialized</span>
                        <span>{format(new Date(applicant.createdAt), 'dd MMM yyyy')}</span>
                    </div>
                </div>
            </div>

            {showOverride && (
                <OverrideModal
                    applicationId={applicant.id}
                    applicantName={applicant.prospect.fullName}
                    currentStatus={applicant.status}
                    currentRank={applicant.rank}
                    onClose={() => setShowOverride(false)}
                    onSuccess={() => { setShowOverride(false); onClose(); }}
                />
            )}
        </>
    );
}
