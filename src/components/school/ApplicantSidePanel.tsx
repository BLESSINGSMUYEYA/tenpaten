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

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Collapsible section ───────────────────────────────────────────────────────

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
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-[#36335e] transition-colors">
                    {title}
                </span>
                {open ? (
                    <ChevronUp className="w-4 h-4 text-slate-300 group-hover:text-[#36335e]" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-[#36335e]" />
                )}
            </button>
            {open && <div className="px-6 pb-5 space-y-3">{children}</div>}
        </div>
    );
}

// ── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ label, score }: { label: string; score: number }) {
    const color =
        score >= 80 ? 'bg-emerald-500' :
        score >= 60 ? 'bg-[#d5a22d]' :
        score >= 40 ? 'bg-amber-400' : 'bg-rose-400';

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">{label}</span>
                <span className="font-black text-[#36335e]">{score}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

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
            {/* Backdrop (mobile) */}
            <div
                className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-slate-100 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-[#1d1b41] text-white p-6 shrink-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white font-black text-lg shrink-0">
                                {applicant.prospect.fullName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-black text-lg tracking-tight leading-tight truncate">
                                    {applicant.prospect.fullName}
                                </h2>
                                <p className="text-white/50 text-xs font-medium truncate mt-0.5">
                                    {applicant.prospect.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Summary row */}
                    <div className="flex items-center gap-3 mt-5 flex-wrap">
                        <StatusBadge status={applicant.status} size="sm" />
                        {applicant.rank !== null && (
                            <span className="px-2.5 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/80">
                                Rank #{applicant.rank}
                            </span>
                        )}
                        {applicant.meritScore !== null && (
                            <span className="px-2.5 py-1 rounded-full bg-[#d5a22d]/20 text-[9px] font-black uppercase tracking-widest text-[#d5a22d]">
                                {scoreLabel} · {applicant.meritScore}
                            </span>
                        )}
                    </div>

                    {/* Programme */}
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-white/60">
                        <GraduationCap className="w-3.5 h-3.5 text-[#d5a22d]" />
                        {applicant.program.name}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    {canIssueOffer && (
                        <Button
                            onClick={handleIssueOffer}
                            disabled={isPending}
                            className="flex-1 h-10 bg-[#36335e] hover:bg-[#2a284a] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-[#36335e]/20 transition-all"
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Issuing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <Send className="w-3.5 h-3.5" /> Issue Offer
                                </span>
                            )}
                        </Button>
                    )}
                    <Button
                        onClick={() => setShowOverride(true)}
                        variant="outline"
                        className="h-10 px-4 rounded-xl text-xs font-black uppercase tracking-widest border-amber-200 text-amber-700 hover:bg-amber-50 transition-all"
                    >
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                        Override
                    </Button>
                    <Link
                        href={`/dashboard/school/applications/${applicant.id}`}
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-[#36335e] hover:border-[#36335e]/30 hover:bg-[#36335e]/5 transition-all shrink-0"
                        title="Open full detail view"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>

                {/* Scrollable Sections */}
                <div className="flex-1 overflow-y-auto">

                    {/* Factor Scores */}
                    {applicant.meritScore !== null && (
                        <Section title="Merit Score Breakdown">
                            <ScoreBar
                                label="Overall Merit"
                                score={applicant.meritScore}
                            />
                            {applicant.academicInfo?.gpa && (
                                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-500">GPA / Grade</span>
                                    <span className="font-black text-[#36335e]">{applicant.academicInfo.gpa}</span>
                                </div>
                            )}
                            {applicant.academicInfo?.testScore && (
                                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-500">{applicant.academicInfo.testType || 'Test Score'}</span>
                                    <span className="font-black text-[#36335e]">{applicant.academicInfo.testScore}</span>
                                </div>
                            )}
                            {applicant.academicInfo?.highestQualification && (
                                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-500">Qualification</span>
                                    <span className="font-black text-[#36335e] capitalize">{applicant.academicInfo.highestQualification.replace(/_/g, ' ')}</span>
                                </div>
                            )}
                        </Section>
                    )}

                    {/* Activities */}
                    {applicant.activitiesInfo && Object.keys(applicant.activitiesInfo).length > 0 && (
                        <Section title="Merit & Achievements">
                            <div className="space-y-2">
                                {Object.entries(applicant.activitiesInfo).slice(0, 5).map(([key, value]: [string, any]) => (
                                    <div key={key} className="p-3 bg-slate-50 rounded-xl text-xs">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        <p className="font-bold text-slate-700 line-clamp-2">{value?.toString()}</p>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Redirection History */}
                    {applicant.alternativeProgramId && (
                        <Section title="Redirection History">
                            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${applicant.alternativeStatus === 'ACCEPTED' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : applicant.alternativeStatus === 'REJECTED' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                Alternative programme suggested — student response:{' '}
                                <span className="font-black">{applicant.alternativeStatus ?? 'Pending'}</span>
                            </div>
                        </Section>
                    )}

                    {/* Audit Trail */}
                    <Section title="Audit Trail" defaultOpen={false}>
                        {applicant.statusHistory.length === 0 ? (
                            <p className="text-xs text-slate-400 font-medium">No history yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {applicant.statusHistory.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className={`p-3 rounded-xl border text-xs space-y-1 ${entry.isOverride ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`font-black uppercase tracking-widest text-[9px] ${entry.isOverride ? 'text-amber-700' : 'text-slate-500'}`}>
                                                {entry.isOverride && '⚠ Override · '}{entry.status.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(entry.createdAt), 'dd MMM yy HH:mm')}
                                            </span>
                                        </div>
                                        {entry.overrideReason && (
                                            <p className="text-amber-700 font-bold text-[10px]">
                                                Reason: {entry.overrideReason}
                                            </p>
                                        )}
                                        {entry.note && (
                                            <p className="text-slate-500 font-medium">{entry.note}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    {/* Applied date */}
                    <div className="px-6 py-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                        Applied {format(new Date(applicant.createdAt), 'dd MMM yyyy')}
                    </div>
                </div>
            </div>

            {/* Override Modal */}
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
