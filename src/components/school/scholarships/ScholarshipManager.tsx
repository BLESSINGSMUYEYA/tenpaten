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
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group">
                                <div>
                                    <h4 className="text-xs font-black text-[#36335e] uppercase tracking-widest">Scholarship Status</h4>
                                    <p className="text-[10px] font-bold tracking-widest text-slate-400 mt-1 uppercase">
                                        {isActive ? <span className="text-[#36335e] bg-[#36335e]/10 px-2 py-0.5 rounded-lg">Active Across Platform</span> : 'Currently Disabled'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={() => setIsActive(!isActive)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#36335e]"></div>
                                </label>
                            </div>

                            {/* Percentage Input */}
                            <div className={`space-y-4 transition-all duration-500 ${!isActive ? 'opacity-30 pointer-events-none scale-95 origin-top' : 'opacity-100 scale-100'}`}>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Discount Percentage (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                        className="w-full h-16 px-8 bg-[#36335e]/5 border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white text-2xl font-black text-[#36335e] transition-all placeholder:text-slate-300 shadow-inner"
                                        placeholder="e.g. 20"
                                    />
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[#36335e]/30 font-black text-xl">%</div>
                                </div>
                                <div className="flex gap-2 text-[10px] text-slate-500 font-bold px-1 uppercase tracking-tight leading-relaxed">
                                    <AlertCircle className="w-4 h-4 shrink-0 text-[#d5a22d]" />
                                    This percentage will be dynamically calculated against the Base Tuition set on each individual program.
                                </div>
                            </div>

                            <button
                                onClick={handleSaveGlobal}
                                disabled={isSaving}
                                className="w-full h-16 bg-[#36335e] hover:bg-[#2a284a] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-[#36335e]/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 group"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-[#d5a22d] group-hover:scale-110 transition-transform" />}
                                Save Global Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Exemptions List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-[#36335e]/5 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[600px]">
                        <div className="p-8 border-b border-slate-100 bg-[#36335e]/5 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-[#36335e] tracking-tight">Program Exemptions</h3>
                                <p className="text-sm font-medium text-slate-500 mt-1">Configure specific exclusions from the global discount policy.</p>
                            </div>
                            <div className="px-4 py-2 bg-white border border-[#36335e]/10 rounded-xl text-[10px] font-black tracking-widest text-[#36335e] shadow-sm">
                                {university.programs.length} PROGRAMS REGISTRY
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                            {university.programs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                                        <AlertCircle className="w-10 h-10 opacity-20" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest">No academic programs added yet.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100/50">
                                    {university.programs.map(program => (
                                        <div key={program.id} className="p-6 hover:bg-slate-50/50 transition-colors rounded-[2rem] flex items-center justify-between group">
                                            <div className="flex-1 min-w-0 pr-8">
                                                <h4 className={`text-base font-black uppercase tracking-tight transition-colors ${program.excludeFromGlobalScholarship ? 'text-slate-400' : 'text-[#36335e]'}`}>
                                                    {program.name}
                                                </h4>
                                                <div className="flex items-center gap-4 mt-2 text-[10px] uppercase font-black tracking-widest">
                                                    <span className="text-[#d5a22d] bg-[#d5a22d]/5 px-2 py-0.5 rounded-lg border border-[#d5a22d]/10">{program.level}</span>
                                                    {!program.baseTuition ? (
                                                        <span className="text-rose-500 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                                                            <AlertCircle className="w-3.5 h-3.5" /> No Base Price Set
                                                        </span>
                                                    ) : (
                                                        <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">Pricing Ready</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-6 shrink-0">
                                                <div className={`text-[10px] font-black uppercase tracking-[0.2em] w-24 text-right transition-all ${program.excludeFromGlobalScholarship ? 'text-rose-500 bg-rose-50 px-3 py-1 rounded-lg' : 'text-[#36335e] bg-[#36335e]/10 px-3 py-1 rounded-lg'}`}>
                                                    {program.excludeFromGlobalScholarship ? 'EXEMPTED' : 'INCLUDED'}
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={!program.excludeFromGlobalScholarship}
                                                        onChange={() => handleToggleExemption(program.id, program.excludeFromGlobalScholarship)}
                                                        disabled={processingPrograms[program.id]}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#36335e]"></div>
                                                    {processingPrograms[program.id] && (
                                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-full">
                                                            <Loader2 className="w-4 h-4 animate-spin text-[#36335e]" />
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
