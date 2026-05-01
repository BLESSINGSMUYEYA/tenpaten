'use client';

import { useState, useTransition } from 'react';
import { runScoringAndRank } from '@/lib/actions/bulk-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Send, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProgrammeCardProps {
    programId:     string;
    programName:   string;
    intake:        string | null;
    totalApps:     number;
    rankedApps:    number;   // apps with rank set
    offersIssued:  number;
    offersAccepted:number;
    quota:         number | null;
}

export default function ProgrammeCard({
    programId,
    programName,
    intake,
    totalApps,
    rankedApps,
    offersIssued,
    offersAccepted,
    quota,
}: ProgrammeCardProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [scored, setScored] = useState(false);

    const unranked      = totalApps - rankedApps;
    const fillPct       = quota ? Math.min(100, Math.round((offersAccepted / quota) * 100)) : null;
    const readyForOffer = rankedApps > offersIssued;
    const allDone       = totalApps === 0 || (offersIssued >= rankedApps && unranked === 0);

    const handleRunScoring = () => {
        startTransition(async () => {
            try {
                const result = await runScoringAndRank(programId);
                toast.success(`Ranked ${result.ranked} applicants in ${result.programName}`);
                setScored(true);
                router.refresh();
            } catch (err: any) {
                toast.error(err.message || 'Scoring failed');
            }
        });
    };

    // Determine CTA
    let cta: React.ReactNode;
    if (allDone) {
        cta = (
            <Link
                href={`/dashboard/school/applications?programId=${programId}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
            >
                <CheckCircle2 className="w-3.5 h-3.5" /> View Applicants
            </Link>
        );
    } else if (unranked > 0 && !scored) {
        cta = (
            <button
                onClick={handleRunScoring}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1d1b41] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#2a284a] disabled:opacity-50 transition-all"
            >
                {isPending ? (
                    <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Scoring...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Run Scoring ({unranked} unranked)
                    </>
                )}
            </button>
        );
    } else if (readyForOffer) {
        cta = (
            <Link
                href={`/dashboard/school/applications?programId=${programId}&sortBy=rank`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#d5a22d] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#b08523] transition-colors shadow-md shadow-[#d5a22d]/20"
            >
                <Send className="w-3.5 h-3.5" />
                Issue Offers ({rankedApps - offersIssued} ready)
            </Link>
        );
    } else {
        cta = (
            <Link
                href={`/dashboard/school/applications?programId=${programId}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-100"
            >
                <ArrowRight className="w-3.5 h-3.5" /> View Applicants
            </Link>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-[#1d1b41]/5 hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-50">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h4 className="font-black text-[#1d1b41] tracking-tight leading-tight text-sm truncate">
                            {programName}
                        </h4>
                        {intake && (
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {intake} intake
                            </p>
                        )}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#1d1b41]/5 text-[#1d1b41] text-[10px] font-black uppercase tracking-widest shrink-0">
                        {totalApps} apps
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-5 space-y-4 flex-1">
                {/* Fill Rate */}
                {fillPct !== null && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">Fill Rate</span>
                            <span className="text-[#1d1b41]">{offersAccepted} / {quota} seats</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#36335e] to-[#d5a22d] transition-all duration-700"
                                style={{ width: `${fillPct}%` }}
                            />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">
                            {fillPct}% filled
                        </p>
                    </div>
                )}

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ranked</p>
                        <p className="text-lg font-black text-[#1d1b41] mt-0.5">{rankedApps}</p>
                    </div>
                    <div className="p-3 bg-[#d5a22d]/5 rounded-2xl">
                        <p className="text-[9px] font-black text-[#d5a22d] uppercase tracking-widest">Offers Out</p>
                        <p className="text-lg font-black text-[#1d1b41] mt-0.5">{offersIssued}</p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="px-6 pb-6">{cta}</div>
        </div>
    );
}
