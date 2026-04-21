'use client';

import { useState } from 'react';
import { updateGlobalScholarshipSettings, toggleProgramExemption } from '@/lib/actions/scholarships';
import { Loader2, CheckCircle2, Percent, AlertCircle, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { Program, University } from '@prisma/client';
import { toast } from 'sonner';

interface ScholarshipManagerProps {
    university: University & { programs: Program[] };
}

export default function ScholarshipManager({ university }: ScholarshipManagerProps) {
    const [isActive, setIsActive] = useState(university.globalScholarshipActive);
    const [percentage, setPercentage] = useState<string>(university.globalScholarshipPercentage?.toString() || '');
    const [isSaving, setIsSaving] = useState(false);
    const [processingPrograms, setProcessingPrograms] = useState<Record<string, boolean>>({});

    const handleSaveGlobal = async () => {
        setIsSaving(true);
        const parsedPercentage = percentage ? parseFloat(percentage) : null;
        
        const result = await updateGlobalScholarshipSettings(isActive, parsedPercentage, university.id);
        
        if (result.success) {
            toast.success('Global scholarship settings updated successfully!');
        } else {
            toast.error(result.error || 'Failed to update settings');
        }
        setIsSaving(false);
    };

    const handleToggleExemption = async (programId: string, currentExemptStatus: boolean) => {
        setProcessingPrograms(prev => ({ ...prev, [programId]: true }));
        const result = await toggleProgramExemption(programId, !currentExemptStatus);
        
        if (result.success) {
            toast.success(`Program ${!currentExemptStatus ? 'exempted from' : 'included in'} global scholarship!`);
        } else {
            toast.error(result.error || 'Failed to toggle exemption');
        }
        setProcessingPrograms(prev => ({ ...prev, [programId]: false }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Global Scholarships</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">
                        Set a universal tuition discount across all programs, with precision exemptions.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Global Settings Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-[#36335e]/5 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/10 rounded-full blur-3xl -translate-y-10 translate-x-10" />
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-[#36335e]/5 flex items-center justify-center text-[#36335e]">
                                <Percent className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black text-[#36335e] uppercase tracking-tight">Master Settings</h2>
                        </div>

                        <div className="space-y-8 relative z-10">
                            {/* Enable Toggle */}
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">Scholarship Status</h4>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                                        {isActive ? 'ACTIVE ACROSS PLATFORM' : 'CURRENTLY DISABLED'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsActive(!isActive)}
                                    className={`transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'}`}
                                >
                                    {isActive ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12" />}
                                </button>
                            </div>

                            {/* Percentage Input */}
                            <div className={`space-y-3 transition-opacity duration-300 ${!isActive ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Discount Percentage (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                        className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-2xl font-black text-slate-900 transition-all placeholder:text-slate-300"
                                        placeholder="e.g. 20"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">%</div>
                                </div>
                                <div className="flex gap-2 text-[11px] text-slate-500 font-medium px-1">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-[#d5a22d]" />
                                    This percentage will be dynamically calculated against the Base Tuition set on each individual program.
                                </div>
                            </div>

                            <button
                                onClick={handleSaveGlobal}
                                disabled={isSaving}
                                className="w-full h-14 bg-gradient-to-r from-[#36335e] to-[#2a284a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#36335e]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Global Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Exemptions List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-lg font-black text-[#36335e] tracking-tight">Program Exemptions</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Toggle switches to exclude specific programs from the global discount.</p>
                            </div>
                            <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black tracking-widest text-slate-400">
                                {university.programs.length} PROGRAMS
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {university.programs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                                    <AlertCircle className="w-10 h-10 opacity-20" />
                                    <p className="text-sm font-bold">No academic programs added yet.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-50">
                                    {university.programs.map(program => (
                                        <li key={program.id} className="p-4 hover:bg-slate-50/80 transition-colors rounded-xl flex items-center justify-between group">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h4 className={`text-sm font-bold truncate ${program.excludeFromGlobalScholarship ? 'text-slate-400' : 'text-slate-900'}`}>
                                                    {program.name}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] uppercase font-bold tracking-widest">
                                                    <span className="text-[#d5a22d]">{program.level}</span>
                                                    {!program.baseTuition && (
                                                        <span className="text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> No Base Price Set</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className={`text-[10px] font-black uppercase tracking-widest w-24 text-right transition-colors ${program.excludeFromGlobalScholarship ? 'text-rose-400' : 'text-emerald-500'}`}>
                                                    {program.excludeFromGlobalScholarship ? 'EXEMPTED' : 'INCLUDED'}
                                                </div>
                                                <button
                                                    onClick={() => handleToggleExemption(program.id, program.excludeFromGlobalScholarship)}
                                                    disabled={processingPrograms[program.id]}
                                                    className={`transition-colors ${processingPrograms[program.id] ? 'opacity-50' : ''} ${program.excludeFromGlobalScholarship ? 'text-rose-400 hover:text-rose-500' : 'text-emerald-500 hover:text-emerald-600'}`}
                                                >
                                                    {processingPrograms[program.id] ? (
                                                        <Loader2 className="w-8 h-8 animate-spin" />
                                                    ) : program.excludeFromGlobalScholarship ? (
                                                        <ToggleLeft className="w-10 h-10" />
                                                    ) : (
                                                        <ToggleRight className="w-10 h-10" />
                                                    )}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
