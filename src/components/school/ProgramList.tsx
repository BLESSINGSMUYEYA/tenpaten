'use client';

import { useState } from 'react';
import { Pencil, Trash2, MapPin, Calendar, Clock, Loader2, BookOpen } from 'lucide-react';
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
    // ... other fields
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
            <EmptyState
                icon={BookOpen}
                title="No active programs"
                description="Start building your curriculum by adding your first program."
            />
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#36335e] text-white">
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Program Identity</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Department & Level</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Logistics</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em]">Tuition Est.</th>
                            <th className="px-6 py-5 text-xs font-black uppercase tracking-[0.2em] text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {programs.map((program) => (
                            <tr key={program.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#36335e]/5 flex items-center justify-center text-[#36335e] group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-black text-[#36335e] group-hover:text-[#d5a22d] transition-colors uppercase truncate max-w-[250px]">
                                            {program.name}
                                        </h4>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1">
                                        <div className="text-sm font-black text-[#36335e]">
                                            {program.department?.name || 'Curriculum Registry'}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                            {program.level || 'Degree Program'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <Clock className="w-4 h-4 text-[#d5a22d]" />
                                            <span>{program.duration || 'Flexible'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Calendar className="w-4 h-4 text-gray-300" />
                                            <span>{program.intake || 'Multiple'} Intake</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-sm font-black text-[#36335e]">
                                        {program.baseTuition ? program.baseTuition.toLocaleString() : 'Fees Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex items-center justify-center gap-2">
                                        {onEdit ? (
                                            <Button
                                                onClick={() => onEdit(program)}
                                                size="icon"
                                                variant="ghost"
                                                className="rounded-xl text-[#36335e] hover:bg-[#36335e] hover:text-[#d5a22d] transition-all"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        ) : (
                                            <Link href={`/dashboard/school/programs/${program.id}`}>
                                                <Button size="icon" variant="ghost" className="rounded-xl text-[#36335e] hover:bg-[#36335e] hover:text-[#d5a22d] transition-all">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            onClick={() => handleDelete(program.id)}
                                            disabled={isDeleting === program.id}
                                            size="icon"
                                            variant="ghost"
                                            className="rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                                        >
                                            {isDeleting === program.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
