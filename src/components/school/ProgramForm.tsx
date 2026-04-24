'use client';

import { useState } from 'react';
import { Loader2, Save, X, Plus, GraduationCap, FileText } from 'lucide-react';
import { createProgram, updateProgram } from '@/lib/actions/school-academics';

interface ProgramFormProps {
    departments: { id: string; name: string }[];
    initialData?: any;
    onClose: () => void;
    universityId?: string; // Explicit ID for Country Directors/Admins
}

export default function ProgramForm({ departments, initialData, onClose, universityId }: ProgramFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        level: initialData?.level || 'Undergraduate',
        departmentId: initialData?.departmentId || '',
        baseTuition: initialData?.baseTuition?.toString() || '',
        duration: initialData?.duration || '',
        intake: initialData?.intake || '',
        description: initialData?.description || '',
        requirements: initialData?.requirements || '',
    });

    const [majors, setMajors] = useState<string[]>(initialData?.majors || []);
    const [newMajor, setNewMajor] = useState('');

    const addMajor = () => {
        if (newMajor.trim()) {
            setMajors([...majors, newMajor.trim()]);
            setNewMajor('');
        }
    };

    const removeMajor = (index: number) => {
        setMajors(majors.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = { ...formData, majors };

        if (initialData?.id) {
            await updateProgram(initialData.id, payload);
        } else {
            await createProgram(payload, universityId);
        }

        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#36335e]/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col scale-in-center">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#36335e]/5">
                    <div>
                        <h2 className="text-2xl font-black text-[#36335e] tracking-tight">
                            {initialData ? 'Update Curriculum' : 'Provision New Program'}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Institutional Academic Registry</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-rose-50 rounded-2xl transition-all text-slate-400 hover:text-rose-600 shadow-sm hover:shadow-md bg-white border border-slate-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
                    {/* Core Identity Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#36335e] flex items-center justify-center text-[#d5a22d]">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-[#36335e] uppercase tracking-widest">Academic Identity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Program Title *</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white text-base font-bold text-[#36335e] transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="e.g. Master of Business Administration"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Academic Level *</label>
                                <div className="relative">
                                    <select
                                        value={formData.level}
                                        onChange={e => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white text-base font-bold text-[#36335e] transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        <option>Undergraduate</option>
                                        <option>Postgraduate</option>
                                        <option>Diploma</option>
                                        <option>Certificate</option>
                                        <option>PhD</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#36335e]/30">
                                        <X className="w-4 h-4 rotate-45" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Faculty / Department</label>
                                <div className="relative">
                                    <select
                                        value={formData.departmentId}
                                        onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                        className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white text-base font-bold text-[#36335e] transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        <option value="">Unassigned Faculty...</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#36335e]/30">
                                        <X className="w-4 h-4 rotate-45" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financials & Logistics Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#36335e] flex items-center justify-center text-[#d5a22d]">
                                <Loader2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-[#36335e] uppercase tracking-widest">Financials & Logistics</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Curriculum Duration</label>
                                <input
                                    value={formData.duration}
                                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                    className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white text-base font-bold text-[#36335e] transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="e.g. 48 Months"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Admission Intakes</label>
                                <input
                                    value={formData.intake}
                                    onChange={e => setFormData({ ...formData, intake: e.target.value })}
                                    className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white text-base font-bold text-[#36335e] transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="e.g. January, July"
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Annual Base Tuition ($) *</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        value={formData.baseTuition}
                                        onChange={e => setFormData({ ...formData, baseTuition: e.target.value })}
                                        className="w-full h-16 px-6 bg-[#36335e]/5 border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white text-2xl font-black text-[#36335e] transition-all placeholder:text-slate-300 shadow-inner"
                                        placeholder="0.00"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[#36335e]/30 font-black text-xl">USD</div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 ml-1 mt-1 uppercase tracking-tight">
                                    Used for dynamic scholarship calculations and platform-wide pricing analytics.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Specializations Section */}
                    <div className="space-y-4 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-inner">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-black text-[#36335e] uppercase tracking-widest">Available Majors</h3>
                            <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-slate-200 text-[#36335e] tracking-widest shadow-sm">
                                {majors.length} DEFINED
                            </span>
                        </div>
                        
                        <div className="flex gap-3 mb-6">
                            <input
                                value={newMajor}
                                onChange={e => setNewMajor(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMajor())}
                                className="flex-1 h-14 px-6 bg-white border-none rounded-2xl focus:ring-4 focus:ring-[#36335e]/5 text-sm font-bold text-[#36335e] transition-all shadow-sm"
                                placeholder="Enter a specialization..."
                            />
                            <button
                                type="button"
                                onClick={addMajor}
                                className="h-14 w-14 flex items-center justify-center bg-[#36335e] text-white rounded-2xl hover:bg-[#2a284a] shadow-lg shadow-[#36335e]/20 transition-all active:scale-95 group"
                            >
                                <Plus className="w-6 h-6 text-[#d5a22d] group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {majors.length === 0 ? (
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full text-center py-4 italic">No majors defined for this program yet.</p>
                            ) : (
                                majors.map((m, i) => (
                                    <span key={i} className="inline-flex items-center gap-2 pl-4 pr-1 py-1.5 bg-white border border-[#36335e]/10 shadow-sm rounded-xl text-xs font-black text-[#36335e] uppercase tracking-tight transition-all hover:border-[#36335e]/30">
                                        {m}
                                        <button
                                            type="button"
                                            onClick={() => removeMajor(i)}
                                            className="w-7 h-7 flex items-center justify-center bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Criteria Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#36335e] flex items-center justify-center text-[#d5a22d]">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black text-[#36335e] uppercase tracking-widest">Detailed Criteria</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Institutional Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white text-sm font-bold text-[#36335e] transition-all min-h-[140px] resize-none shadow-inner placeholder:text-slate-300"
                                    placeholder="Provide a comprehensive program summary for prospective students..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Admission Prerequisites</label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white text-sm font-bold text-[#36335e] transition-all min-h-[140px] resize-none shadow-inner placeholder:text-slate-300"
                                    placeholder="Define specific academic or professional requirements for entry..."
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-8 border-t border-slate-100 bg-[#36335e]/5 flex justify-end gap-4 shadow-2xl relative z-20">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-10 py-5 font-black uppercase tracking-widest text-xs text-slate-500 hover:text-[#36335e] hover:bg-white rounded-2xl transition-all"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        onClick={handleSubmit}
                        className="flex items-center gap-3 px-12 py-5 bg-[#36335e] hover:bg-[#2a284a] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#36335e]/20 transition-all transform active:scale-95 disabled:opacity-50 group"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 text-[#d5a22d] group-hover:scale-110 transition-transform" />
                        )}
                        {initialData ? 'Commit Changes' : 'Deploy Program'}
                    </button>
                </div>
            </div>
        </div>
    );
}
