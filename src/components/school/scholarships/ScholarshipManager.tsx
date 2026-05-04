'use client';

import { useState } from 'react';
import { updateGlobalScholarshipSettings, toggleProgramExemption } from '@/lib/actions/scholarships';
import { Loader2, Percent, AlertCircle, Save, Award, GraduationCap, Coins } from 'lucide-react';
import { Program, University } from '@prisma/client';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';

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
            toast.success(`Programme ${!currentExemptStatus ? 'exempted from' : 'included in'} global scholarship!`);
        } else {
            toast.error(result.error || 'Failed to toggle exemption');
        }
        setProcessingPrograms(prev => ({ ...prev, [programId]: false }));
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            
            <PageHeader 
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] border border-[#d5a22d]/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Award className="w-3.5 h-3.5" />
                        Funding Engine
                    </div>
                }
                title="Global Scholarships"
                subtitle={
                    <>
                        Set a universal tuition discount across all programmes for <span className="font-bold text-[#d5a22d]">{university.name}</span>.
                    </>
                }
            />

            <div className="grid gap-8 lg:grid-cols-3">
                {/* ── Master Settings Panel ── */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <div className="bg-[#36335e] px-8 py-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black text-white tracking-tight">Master Settings</h3>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Policy Configuration</p>
                            </div>
                            <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                                <Percent className="w-5 h-5 text-[#d5a22d]" />
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Enable Toggle */}
                            <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-50 flex items-center justify-between group hover:bg-white hover:border-slate-100 transition-all">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black text-[#36335e]/40 uppercase tracking-[0.2em]">Scholarship Status</h4>
                                    <p className="text-sm font-black text-[#36335e]">
                                        {isActive ? 'Active Platform-wide' : 'Currently Disabled'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={() => setIsActive(!isActive)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#36335e] shadow-inner"></div>
                                </label>
                            </div>

                            {/* Percentage Input */}
                            <div className={`space-y-4 transition-all duration-500 ${!isActive ? 'opacity-30 pointer-events-none scale-95 origin-top' : 'opacity-100 scale-100'}`}>
                                <div className="px-1">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Discount Percentage (%)</label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={percentage}
                                            onChange={(e) => setPercentage(e.target.value)}
                                            className="w-full h-20 px-8 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white text-4xl font-black text-[#36335e] transition-all placeholder:text-slate-200 shadow-sm"
                                            placeholder="20"
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[#d5a22d] font-black text-3xl group-focus-within:scale-110 transition-transform">%</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4 p-5 bg-[#d5a22d]/5 rounded-[1.5rem] border border-[#d5a22d]/10">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                        <AlertCircle className="w-5 h-5 text-[#d5a22d]" />
                                    </div>
                                    <p className="text-[10px] text-[#36335e]/70 font-bold uppercase tracking-tight leading-relaxed py-1">
                                        This percentage is calculated against the Base Tuition set on each individual programme.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveGlobal}
                                disabled={isSaving}
                                className="w-full h-16 bg-[#36335e] hover:bg-[#2a284a] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl shadow-[#36335e]/20 transition-all active:scale-95 disabled:opacity-50 group"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 text-[#d5a22d] group-hover:scale-125 transition-transform" />}
                                Deploy Funding Policy
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Exemptions List ── */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[700px]">
                        <div className="bg-[#36335e] px-10 py-7 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="text-xl font-black text-white tracking-tight">Programme Exemptions</h3>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Custom Inclusion Logic</p>
                            </div>
                            <div className="px-5 py-2.5 bg-white/10 text-[#d5a22d] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                {university.programs.length} Programmes Active
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {university.programs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/20">
                                    <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center shadow-sm border border-slate-100 mb-6">
                                        <Coins className="w-10 h-10 text-slate-100" />
                                    </div>
                                    <p className="text-lg font-black text-[#36335e] tracking-tight">No academic programmes found</p>
                                    <p className="text-sm font-bold text-slate-400 mt-1 max-w-xs">Start by adding programmes in the Academics section to configure scholarships.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100">
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Programme Identity</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Toggle Inclusion</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {university.programs.map(program => (
                                            <tr key={program.id} className="hover:bg-slate-50/80 transition-all duration-300 group border-l-4 border-transparent hover:border-[#d5a22d]">
                                                <td className="px-10 py-6">
                                                    <div className="space-y-1.5">
                                                        <h4 className={`text-[15px] font-black tracking-tight transition-colors ${program.excludeFromGlobalScholarship ? 'text-slate-300 line-through' : 'text-[#36335e]'}`}>
                                                            {program.name}
                                                        </h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[9px] uppercase font-black tracking-widest text-[#d5a22d] bg-[#d5a22d]/10 px-2 py-0.5 rounded-lg border border-[#d5a22d]/10">
                                                                {program.level}
                                                            </span>
                                                            {!program.baseTuition ? (
                                                                <span className="text-[9px] uppercase font-black tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                                                                    Pricing Required
                                                                </span>
                                                            ) : (
                                                                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                                    Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                <td className="px-10 py-6 text-center">
                                                    <div className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                                        program.excludeFromGlobalScholarship 
                                                            ? 'text-rose-500 bg-rose-50 border-rose-100' 
                                                            : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                                    }`}>
                                                        {program.excludeFromGlobalScholarship ? 'Exempted' : 'Included'}
                                                    </div>
                                                </td>

                                                <td className="px-10 py-6">
                                                    <div className="flex justify-end relative">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!program.excludeFromGlobalScholarship}
                                                                onChange={() => handleToggleExemption(program.id, program.excludeFromGlobalScholarship)}
                                                                disabled={processingPrograms[program.id]}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-14 h-7 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#36335e] shadow-inner"></div>
                                                            {processingPrograms[program.id] && (
                                                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-full">
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#36335e]" />
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
