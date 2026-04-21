'use client';

import { useState } from 'react';
import { findAlternativePrograms, sendSwitchSuggestion } from '@/lib/actions/allocation';
import { RefreshCw, Search, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AlternativeProgramSelector({ applicationId }: { applicationId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [matches, setMatches] = useState<any[]>([]);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSearch = async () => {
        setIsOpen(true);
        setIsLoading(true);
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

    const handleSuggest = async (programId: string) => {
        setIsSending(true);
        setError('');
        try {
            await sendSwitchSuggestion(applicationId, programId);
            setIsOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Failed to send suggestion');
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
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#36335e] flex items-center gap-2">
                                <Search className="w-5 h-5 text-indigo-500" />
                                Alternative Programs
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <RefreshCw className="w-8 h-8 animate-spin mb-4 text-indigo-400" />
                                    <p>Analyzing academic profile...</p>
                                </div>
                            ) : error ? (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
                            ) : matches.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No suitable alternative programs found.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-tight leading-relaxed">
                                            Strategic matches identified via merit-matching analysis.
                                        </p>
                                    </div>

                                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                                        {matches.map((match) => (
                                            <div 
                                                key={match.program.id} 
                                                className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#36335e]/20 group-hover:text-[#36335e] transition-colors">
                                                            <CheckCircle2 className="w-6 h-6" />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-black rounded-lg shadow-lg">
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
                                                
                                                <button
                                                    onClick={() => handleSuggest(match.program.id)}
                                                    disabled={isSending}
                                                    className="h-10 px-5 bg-[#36335e] hover:bg-[#1a1b41] disabled:opacity-50 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#36335e]/20 transition-all transform active:scale-95 whitespace-nowrap"
                                                >
                                                    {isSending ? 'Sending...' : 'Suggest Switch'}
                                                </button>
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
