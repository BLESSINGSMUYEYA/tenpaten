'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Layers, Plus, Pencil, Trash2, Save, X, Loader2
} from 'lucide-react';
import { upsertDepartment, deleteDepartment } from '@/lib/actions/department';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/EmptyState';

interface DepartmentListProps {
    departments: any[];
}

export default function DepartmentList({ departments }: DepartmentListProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState<string | 'new' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: '',
    });

    const startEditing = (dept: any) => {
        setFormData(dept);
        setIsEditing(dept.id);
    };

    const startNew = () => {
        setFormData({ name: '' });
        setIsEditing('new');
    };

    const cancelEditing = () => {
        setIsEditing(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await upsertDepartment(formData);
            if (result.success) {
                setIsEditing(null);
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this department? This will only work if there are no programs linked to it.')) return;

        setIsLoading(true);
        try {
            const result = await deleteDepartment(id);
            if (result.success) {
                router.refresh();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#36335e]/10 transition-all duration-300 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#36335e]/10 flex items-center justify-center border border-slate-100 shadow-sm">
                            <Layers className="w-5 h-5 text-[#36335e]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                Departments & Faculties
                            </h3>
                            <p className="text-sm font-medium text-slate-500 leading-none mt-1">Organize academic programs</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button
                            onClick={startNew}
                            className="flex items-center gap-2 px-5 py-3 bg-[#36335e] text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#36335e]/20 hover:bg-[#2a284a] transition-all transform active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Add Department
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="p-8 bg-[#36335e]/5 border-b border-slate-100 animate-in slide-in-from-top-2 duration-300">
                        <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
                            <div className="space-y-2">
                                <Label htmlFor="dept-name" className="text-xs font-black uppercase tracking-widest text-[#36335e] ml-1">Department Name</Label>
                                <Input
                                    id="dept-name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Faculty of Engineering & Technology"
                                    className="h-14 border-none bg-white focus:bg-white focus:ring-4 focus:ring-[#36335e]/10 rounded-2xl transition-all font-bold text-slate-900 shadow-sm"
                                />
                            </div>

                            <div className="flex justify-start gap-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#36335e] text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-[#36335e]/20 hover:bg-[#2a284a] transition-all transform active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isEditing === 'new' ? 'Create' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100/50">
                        {departments.length > 0 ? (
                            departments.map((dept) => (
                                <div key={dept.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors flex justify-between items-center group">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#36335e] transition-colors mb-2">{dept.name}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#36335e]/5 text-[#36335e] text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100 shadow-sm">
                                                <Layers className="w-3 h-3 text-[#d5a22d]" />
                                                {dept._count?.programs || 0} Programs
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 bg-white border border-slate-100 p-1 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={() => startEditing(dept)}
                                            className="p-2.5 text-slate-400 hover:text-[#d5a22d] hover:bg-[#d5a22d]/10 rounded-lg transition-all"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(dept.id)}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12">
                                <EmptyState
                                    icon={Layers}
                                    title="No departments needed yet?"
                                    description="Grouping programs by department helps students browse easier."
                                    action={
                                        <button
                                            onClick={startNew}
                                            className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:border-brand-primary hover:text-brand-primary hover:bg-slate-50 transition-all shadow-sm"
                                        >
                                            Create First Department
                                        </button>
                                    }
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
