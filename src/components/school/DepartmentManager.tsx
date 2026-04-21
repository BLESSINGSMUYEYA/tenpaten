'use client';

import { useState } from 'react';
import { Trash2, Plus, Loader2, Layers } from 'lucide-react';
import { createDepartment, deleteDepartment } from '@/lib/actions/school-academics';

interface Department {
    id: string;
    name: string;
    _count?: { programs: number };
}

export default function DepartmentManager({ departments }: { departments: Department[] }) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        await createDepartment({ name });
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
        <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#36335e]/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#36335e]/20">
                    <Layers className="w-8 h-8 text-[#36335e]" />
                </div>
                <h3 className="text-2xl font-black text-[#36335e] tracking-tight mb-2">Create New Department</h3>
                <p className="text-sm font-medium text-slate-500 mb-8 max-w-md">Add academic faculties to organize your curriculum and programs.</p>

                <form onSubmit={handleAdd} className="w-full max-w-lg flex flex-col sm:flex-row gap-4 relative group">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Faculty of Engineering"
                        className="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white text-sm font-bold shadow-sm transition-all text-[#36335e] placeholder:text-slate-400 placeholder:font-medium"
                    />
                    <button
                        disabled={isLoading || !name.trim()}
                        className="px-8 py-4 bg-[#36335e] hover:bg-[#2a284a] text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg shadow-[#36335e]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95 whitespace-nowrap"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Create
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.length === 0 && (
                    <div className="col-span-full py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <Layers className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">No Departments Yet</h4>
                        <p className="text-sm text-slate-500 font-medium">Create your first department to get started.</p>
                    </div>
                )}

                {departments.map((dept) => (
                    <div key={dept.id} className="group flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#36335e]/20 transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#36335e]/10 group-hover:text-[#36335e] transition-colors border border-slate-100">
                                <Layers className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 group-hover:text-[#36335e] transition-colors tracking-tight text-lg leading-tight mb-1">{dept.name}</p>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#36335e]/50" />
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{dept._count?.programs || 0} Programs</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDelete(dept.id)}
                            disabled={isDeleting === dept.id}
                            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100 group-hover:opacity-100 md:opacity-0 focus:opacity-100 transform active:scale-95"
                            title="Delete Department"
                        >
                            {isDeleting === dept.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
