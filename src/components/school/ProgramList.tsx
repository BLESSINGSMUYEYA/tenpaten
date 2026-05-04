'use client';

import { useState } from 'react';
import { Pencil, Trash2, Calendar, Clock, Loader2, BookOpen } from 'lucide-react';
import { deleteProgram } from '@/lib/actions/school-academics';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';

interface Program {
    id: string;
    name: string;
    level?: string | null;
    department?: { name: string } | null;
    duration?: string | null;
    intake?: string | null;
    baseTuition?: number | null;
    majors?: string[];
}

interface ProgramListProps {
    programs: Program[];
    onEdit?: (program: Program) => void;
}

export default function ProgramList({ programs, onEdit }: ProgramListProps) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this program? This cannot be undone.')) return;
        setIsDeleting(id);
        await deleteProgram(id);
        setIsDeleting(null);
    };

    if (programs.length === 0) {
        return (
            <div className="py-20">
                <EmptyState
                    icon={BookOpen}
                    title="No active programs"
                    description="Start building your curriculum by adding your first program."
                />
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#36335e] text-white">
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-white/70">Programme Identity</th>
                        <th className="px-5 py-5 text-xs font-black uppercase tracking-widest text-white/70">Department & Level</th>
                        <th className="px-5 py-5 text-xs font-black uppercase tracking-widest text-white/70">Logistics</th>
                        <th className="px-5 py-5 text-xs font-black uppercase tracking-widest text-white/70">Tuition Est.</th>
                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-white/70 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {programs.map((program) => (
                        <tr key={program.id} className="hover:bg-slate-50/80 transition-all duration-300 group border-l-4 border-transparent hover:border-[#d5a22d]">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#36335e]/5 flex items-center justify-center text-[#36335e] group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all duration-500 shadow-sm">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-black text-[#36335e] group-hover:text-[#d5a22d] transition-colors text-[15px] tracking-tight leading-tight max-w-[280px]">
                                        {program.name}
                                    </h4>
                                </div>
                            </td>
                            <td className="px-5 py-6">
                                <div className="space-y-1.5">
                                    <div className="text-sm font-black text-[#36335e]">
                                        {program.department?.name || 'Unassigned Faculty'}
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#d5a22d]" />
                                        {program.level || 'Standard Degree'}
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                                        <Clock className="w-4 h-4 text-[#d5a22d]" />
                                        <span>{program.duration || 'Flexible Duration'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                                        <Calendar className="w-4 h-4 text-slate-200" />
                                        <span>{program.intake || 'Multiple'} Intakes</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-black text-[#36335e]">
                                        {program.baseTuition ? `$${program.baseTuition.toLocaleString()}` : 'Fees Pending'}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Base Rate</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center justify-center gap-3">
                                    {onEdit ? (
                                        <button
                                            onClick={() => onEdit(program)}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#36335e] hover:text-[#d5a22d] transition-all shadow-sm border border-slate-100"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <Link href={`/dashboard/school/programs/${program.id}`}>
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-[#36335e] hover:text-[#d5a22d] transition-all shadow-sm border border-slate-100">
                                                <Pencil className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleDelete(program.id)}
                                        disabled={isDeleting === program.id}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-rose-300 hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-slate-100 disabled:opacity-50"
                                    >
                                        {isDeleting === program.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
