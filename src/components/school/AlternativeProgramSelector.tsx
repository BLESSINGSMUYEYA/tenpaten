'use client';

import { useState } from 'react';
import { findAlternativePrograms, sendSwitchSuggestion, forceSwitchProgram } from '@/lib/actions/allocation';
import { RefreshCw, Search, CheckCircle2, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AlternativeProgramSelector({ applicationId }: { applicationId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [suggestedProgram, setSuggestedProgram] = useState('');
    const [matches, setMatches] = useState<any[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSearch = async () => {
        setIsOpen(true);
        setIsLoading(true);
        setIsSuccess(false);
        setError('');
        try {
            const results = await findAlternativePrograms(applicationId);
            setMatches(results);
        } catch (err: any) {
            setError(err.message || 'Failed to find programs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggest = async (programId: string, programName: string) => {
        setIsSending(true);
        setError('');
        try {
            await sendSwitchSuggestion(applicationId, programId);
            setSuggestedProgram(programName);
            setSuccessMessage('The applicant has been notified of the suggestion to switch.');
            setIsSuccess(true);
            toast.success('Switch suggestion sent');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to send suggestion');
        } finally {
            setIsSending(false);
        }
    };

    const handleForceSwitch = async (programId: string, programName: string) => {
        if (!confirm(`Are you sure you want to INSTANTLY switch this student to ${programName}? This bypasses student approval.`)) return;
        
        setIsSending(true);
        setError('');
        try {
            await forceSwitchProgram(applicationId, programId);
            setSuggestedProgram(programName);
            setSuccessMessage('Student has been switched immediately. Approval bypassed.');
            setIsSuccess(true);
            toast.success('Program switched instantly');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to switch program');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            <button
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-bold transition-colors"
            >
                <RefreshCw className="w-4 h-4" />
                Find Alternative Programs
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-black text-[#36335e] flex items-center gap-2 uppercase tracking-tight">
                                <Search className="w-5 h-5 text-indigo-500" />
                                {isSuccess ? 'Work Done!' : 'Alternative Programs'}
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto flex-1">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in slide-in-from-bottom-4">
                                    <div className="w-20 h-20 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black text-[#36335e] tracking-tight">Request Successfully Logged</h4>
                                        <p className="text-sm text-slate-500 font-medium max-w-[320px] mx-auto">
                                            {successMessage} <span className="font-bold text-indigo-600">{suggestedProgram}</span>.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsOpen(false)}
                                        className="px-10 py-4 bg-[#36335e] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#36335e]/20"
                                    >
                                        Close Portal
                                    </button>
                                </div>
                            ) : isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                                        <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                                    </div>
                                    <p className="font-bold text-[#36335e] uppercase tracking-widest text-[10px]">Analyzing academic profile...</p>
                                </div>
                            ) : error ? (
                                <div className="p-6 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 rotate-45" />
                                    {error}
                                </div>
                            ) : matches.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p className="font-bold">No suitable alternatives found.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-tight leading-relaxed">
                                            Strategic matches identified via merit-matching analysis.
                                        </p>
                                    </div>

                                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                                        {matches.map((match) => (
                                            <div 
                                                key={match.program.id} 
                                                className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#36335e]/20 group-hover:text-[#36335e] transition-colors">
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-green-500 text-white text-[8px] font-black rounded-lg shadow-lg">
                                                            {match.score}%
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-[#36335e] uppercase tracking-tight leading-none mb-1.5 group-hover:text-indigo-600 transition-colors">
                                                            {match.program.name}
                                                        </h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {match.program.level} • {match.program.intake || 'Multiple'} Intake
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleSuggest(match.program.id, match.program.name)}
                                                        disabled={isSending}
                                                        title="Suggest to Student"
                                                        className="h-11 px-5 border border-[#36335e]/10 hover:bg-slate-50 disabled:opacity-50 text-[#36335e] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95 whitespace-nowrap"
                                                    >
                                                        Suggest
                                                    </button>
                                                    <button
                                                        onClick={() => handleForceSwitch(match.program.id, match.program.name)}
                                                        disabled={isSending}
                                                        title="Force Switch Immediately"
                                                        className="h-11 px-5 bg-[#36335e] hover:bg-black disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#36335e]/20 transition-all transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        <Zap className="w-3.5 h-3.5 fill-current" />
                                                        Instant Switch
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
