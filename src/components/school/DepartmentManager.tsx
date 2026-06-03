'use client';

import { useState } from 'react';
import { Trash2, Plus, Loader2, Layers, GraduationCap } from 'lucide-react';
import { createDepartment, deleteDepartment } from '@/lib/actions/school-academics';

interface Department {
    id: string;
    name: string;
    _count?: { programs: number };
}

export default function DepartmentManager({ departments, universityId }: { departments: Department[], universityId?: string }) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        await createDepartment({ name }, universityId);
        setName('');
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this department?')) return;
        setIsDeleting(id);
        await deleteDepartment(id);
        setIsDeleting(null);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-10 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="w-20 h-20 bg-brand-primary/5 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm border border-brand-primary/10 relative z-10">
                    <Layers className="w-10 h-10 text-brand-primary" />
                </div>
                
                <div className="relative z-10 space-y-2 mb-10">
                    <h3 className="text-3xl font-black text-brand-primary tracking-tight">Expand Institutional Structure</h3>
                    <p className="text-sm font-bold text-slate-400 max-w-md mx-auto">Add academic faculties and administrative departments to better organize your curriculum.</p>
                </div>

                <form onSubmit={handleAdd} className="w-full max-w-xl flex flex-col sm:flex-row gap-4 relative z-10">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Faculty of Engineering & Technology"
                        className="flex-1 h-14 px-8 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand-primary/10 focus:bg-white text-[15px] font-black shadow-sm transition-all text-brand-primary placeholder:text-slate-300 placeholder:font-bold"
                    />
                    <button
                        disabled={isLoading || !name.trim()}
                        className="h-14 px-10 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-widest text-[11px] rounded-2xl transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform active:scale-95 whitespace-nowrap group"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5 text-brand-accent group-hover:rotate-90 transition-transform" />}
                        Initialize Faculty
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-brand-primary text-white">
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-white/70">Faculty / Department Name</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-white/70">Curriculum Volume</th>
                                <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-white/70 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {departments.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-10 py-20 text-center bg-slate-50/20">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm border border-slate-100">
                                                <Layers className="w-8 h-8 text-slate-200" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-brand-primary tracking-tight">No departments initialized</p>
                                                <p className="text-sm font-bold text-slate-400 mt-1">Start by creating your first academic faculty above.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                departments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-slate-50/80 transition-all duration-300 group border-l-4 border-transparent hover:border-brand-accent">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-accent transition-all duration-500 shadow-sm">
                                                    <Layers className="w-6 h-6" />
                                                </div>
                                                <h4 className="font-black text-brand-primary group-hover:text-brand-accent transition-colors text-[15px] tracking-tight truncate">
                                                    {dept.name}
                                                </h4>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all shadow-sm">
                                                <GraduationCap className="w-4 h-4" />
                                                <span>{dept._count?.programs || 0} Programs Active</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleDelete(dept.id)}
                                                    disabled={isDeleting === dept.id}
                                                    className="w-11 h-11 flex items-center justify-center text-rose-300 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-slate-100 hover:border-rose-600 bg-white shadow-sm disabled:opacity-50"
                                                    title="Remove Department"
                                                >
                                                    {isDeleting === dept.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
