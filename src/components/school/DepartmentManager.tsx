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
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#36335e] text-white">
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Faculty / Department Name</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Curriculum Size</th>
                                <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {departments.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                                        No departments found. Create one above to get started.
                                    </td>
                                </tr>
                            ) : (
                                departments.map((dept) => (
                                    <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#36335e]/5 flex items-center justify-center text-[#36335e] group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all">
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-black text-[#36335e] group-hover:text-[#d5a22d] transition-colors uppercase truncate">
                                                    {dept.name}
                                                </h4>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:bg-[#36335e]/5 group-hover:text-[#36335e] transition-all">
                                                <span>{dept._count?.programs || 0} Programs</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => handleDelete(dept.id)}
                                                    disabled={isDeleting === dept.id}
                                                    className="p-2.5 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-transparent hover:border-rose-100"
                                                    title="Delete Department"
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
