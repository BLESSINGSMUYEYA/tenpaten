'use client';

import { useState } from 'react';
import { Loader2, Save, X, Plus } from 'lucide-react';
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
        <div className="fixed inset-0 bg-[#36335e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {initialData ? 'Edit Program' : 'Add New Program'}
                    </h2>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 flex-1">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Program Name *</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-base font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                placeholder="e.g. B.Sc. in Computer Science"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Level *</label>
                            <select
                                value={formData.level}
                                onChange={e => setFormData({ ...formData, level: e.target.value })}
                                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-base font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                            >
                                <option>Undergraduate</option>
                                <option>Postgraduate</option>
                                <option>Diploma</option>
                                <option>Certificate</option>
                                <option>PhD</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Department</label>
                            <select
                                value={formData.departmentId}
                                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-base font-bold text-slate-900 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select Department...</option>
                                {departments.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Duration</label>
                            <input
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-base font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                placeholder="e.g. 4 Years"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Intake Sessions</label>
                            <input
                                value={formData.intake}
                                onChange={e => setFormData({ ...formData, intake: e.target.value })}
                                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-base font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                placeholder="e.g. Sep, Jan"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Annual Tuition Fee (Numeric) *</label>
                            <input
                                type="number"
                                required
                                value={formData.baseTuition}
                                onChange={e => setFormData({ ...formData, baseTuition: e.target.value })}
                                className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-base font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                placeholder="e.g. 10000"
                            />
                            <p className="text-xs text-slate-500 font-medium ml-1 mt-1">
                                Enter the strict numeric value. This drives the scholarship engine and currency formatting platform-wide.
                            </p>
                        </div>
                    </div>



                    {/* Majors */}
                    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-200 shadow-inner">
                        <label className="block text-sm font-bold text-slate-900 mb-4">Majors / Specializations</label>
                        <div className="flex gap-3 mb-4">
                            <input
                                value={newMajor}
                                onChange={e => setNewMajor(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMajor())}
                                className="flex-1 h-12 px-5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] text-sm font-medium transition-all"
                                placeholder="Add major..."
                            />
                            <button
                                type="button"
                                onClick={addMajor}
                                className="h-12 w-12 flex items-center justify-center bg-[#36335e] text-white rounded-xl hover:bg-[#2a284a] shadow-md transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {majors.map((m, i) => (
                                <span key={i} className="inline-flex items-center gap-2 pl-4 pr-2 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-slate-700">
                                    {m}
                                    <button
                                        type="button"
                                        onClick={() => removeMajor(i)}
                                        className="w-6 h-6 flex items-center justify-center bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Textareas */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-sm font-medium text-slate-700 transition-all min-h-[120px] resize-y"
                                placeholder="Provide an overview of the program..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Requirements</label>
                            <textarea
                                value={formData.requirements}
                                onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                                className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:border-[#36335e] focus:bg-white text-sm font-medium text-slate-700 transition-all min-h-[120px] resize-y"
                                placeholder="List program-specific entry requirements..."
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-8 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-3 px-8 py-4 bg-[#36335e] hover:bg-[#2a284a] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-[#36335e]/20 transition-all transform active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {initialData ? 'Update Program' : 'Save Program'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
