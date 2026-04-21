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
        <div className="space-y-4">
            {/* Header / Column Labels */}
            <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="col-span-5">Program Identity & Logistics</div>
                <div className="col-span-2">Academic Specs</div>
                <div className="col-span-2">Registration Fees</div>
                <div className="col-span-3 text-right">Administrative Actions</div>
            </div>

            {/* List Body */}
            <div className="space-y-3">
                {programs.map((program) => (
                    <div 
                        key={program.id} 
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 px-8 py-6 items-center bg-white rounded-3xl border border-transparent shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-[#36335e]/10 hover:border-[#d5a22d]/30 transition-all duration-500 group relative overflow-hidden"
                    >
                        {/* Hover accent */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d5a22d] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                        {/* Program Identity */}
                        <div className="md:col-span-5 flex items-center gap-6">
                            <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#36335e]/20 group-hover:bg-[#36335e]/5 group-hover:text-[#36335e] transition-all duration-300">
                                <BookOpen className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#36335e] transition-colors leading-none mb-2 truncate uppercase">
                                    {program.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 group-hover:bg-[#36335e]/5 group-hover:border-[#36335e]/10 group-hover:text-[#36335e] transition-all">
                                        {program.department?.name || 'Curriculum Registry'}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-300">•</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{program.level || 'Degree'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Specs */}
                        <div className="md:col-span-2 flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-[#d5a22d]" />
                                <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{program.duration || 'Flexible'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#d5a22d]" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{program.intake || 'Multiple'} Intake</span>
                            </div>
                        </div>

                        {/* Tuition */}
                        <div className="md:col-span-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-60">Tuition Est.</span>
                                <span className="text-md font-black text-[#36335e] tracking-tight">
                                    {program.baseTuition ? program.baseTuition.toLocaleString() : 'Fees Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="md:col-span-3 flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                             {onEdit ? (
                                <Button
                                    onClick={() => onEdit(program)}
                                    variant="ghost"
                                    className="h-11 px-5 text-[#36335e] hover:bg-[#36335e]/5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-[#36335e]/10 shadow-sm"
                                >
                                    <Pencil className="w-4 h-4 mr-2 text-[#d5a22d]" />
                                    Review
                                </Button>
                            ) : (
                                <Link
                                    href={`/dashboard/school/programs/${program.id}`}
                                    className="h-11 px-5 text-[#36335e] hover:bg-[#36335e]/5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-[#36335e]/10 shadow-sm flex items-center"
                                >
                                    <Pencil className="w-4 h-4 mr-2 text-[#d5a22d]" />
                                    Configure
                                </Link>
                            )}
                            <Button
                                onClick={() => handleDelete(program.id)}
                                disabled={isDeleting === program.id}
                                variant="ghost"
                                className="h-11 w-11 p-0 text-rose-600 hover:bg-rose-50 rounded-2xl border border-transparent hover:border-rose-100 shadow-sm"
                            >
                                {isDeleting === program.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
