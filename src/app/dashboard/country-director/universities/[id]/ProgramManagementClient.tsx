'use client';

import { useState } from 'react';
import { Plus, BookOpen, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProgramForm from '@/components/school/ProgramForm';
import { deleteProgram } from '@/lib/actions/school-academics';

interface ProgramManagementClientProps {
    university: any;
}

export default function ProgramManagementClient({ university }: ProgramManagementClientProps) {
    const [isEditingProgram, setIsEditingProgram] = useState(false);
    const [editingProgramData, setEditingProgramData] = useState<any>(null);

    const programs = university.programs || [];
    const departments = university.departments || [];

    const handleEditProgram = (program: any) => {
        setEditingProgramData(program);
        setIsEditingProgram(true);
    };

    const handleCreateProgram = () => {
        setEditingProgramData(null);
        setIsEditingProgram(true);
    };

    const handleDeleteProgram = async (id: string) => {
        if (confirm('Are you sure you want to delete this program?')) {
            const result = await deleteProgram(id);
            if (result.error) alert(result.error);
        }
    };

    return (
        <div className="space-y-10">
            {/* Header section with Stats & Add Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center text-brand-accent shadow-2xl shadow-brand-primary/30 transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-brand-primary tracking-tight">Academic Registry</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] bg-brand-accent/10 px-2 py-0.5 rounded-md border border-brand-accent/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                                {programs.length} Active Courses
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleCreateProgram}
                    className="h-14 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-black rounded-2xl border-none shadow-xl shadow-brand-primary/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5 text-brand-accent" />
                    <span>Expand Curriculum</span>
                </Button>
            </div>

            {/* Premium List Component */}
            <div className="space-y-4">
                {programs.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-20 text-center">
                        <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                            <BookOpen className="w-10 h-10" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">No programs configured yet</p>
                        <Button 
                            variant="outline" 
                            onClick={handleCreateProgram}
                            className="rounded-xl border-slate-200 text-brand-primary font-bold"
                        >
                            Get Started
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* List Column Headers */}
                        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <div className="col-span-6">Course Identity & Department</div>
                            <div className="col-span-3">Duration & Level</div>
                            <div className="col-span-3 text-right">Management</div>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3">
                            {programs.map((prog: any) => (
                                <div 
                                    key={prog.id} 
                                    className="grid grid-cols-12 gap-4 px-8 py-6 items-center bg-white rounded-3xl border border-transparent shadow-lg shadow-brand-primary/5 hover:shadow-2xl hover:shadow-brand-primary/10 hover:border-brand-accent/30 transition-all duration-500 group relative overflow-hidden"
                                >
                                    {/* Accent line on hover */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                                    
                                    {/* Program Identity */}
                                    <div className="col-span-12 md:col-span-6 flex items-center gap-6">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary/20 group-hover:bg-brand-primary/5 group-hover:text-brand-primary transition-all duration-300">
                                            <BookOpen className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-brand-primary transition-colors uppercase leading-none mb-2 truncate">
                                                {prog.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 group-hover:bg-brand-primary/5 group-hover:border-brand-primary/10 group-hover:text-brand-primary transition-all">
                                                    {prog.department?.name || 'General Registry'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specifications */}
                                    <div className="col-span-12 md:col-span-3 flex md:block items-center justify-between mt-4 md:mt-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-slate-700 tracking-tight uppercase">{prog.level || 'Degree Level'}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/50" />
                                                {prog.duration || 'N/A Portfolio'}
                                            </p>
                                        </div>
                                        <div className="md:hidden">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 text-brand-primary hover:bg-brand-primary/5 rounded-xl"
                                                    onClick={() => handleEditProgram(prog)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 p-0 text-rose-600 hover:bg-rose-50 rounded-xl"
                                                    onClick={() => handleDeleteProgram(prog.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions Desktop */}
                                    <div className="hidden md:col-span-3 md:flex justify-end items-center gap-3 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-11 px-5 text-brand-primary hover:bg-brand-primary/5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-brand-primary/10 shadow-sm"
                                            onClick={() => handleEditProgram(prog)}
                                        >
                                            <Edit2 className="w-4 h-4 mr-2 text-brand-accent" />
                                            Administer
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-11 w-11 p-0 text-rose-600 hover:bg-rose-50 rounded-2xl border border-transparent hover:border-rose-100 shadow-sm"
                                            onClick={() => handleDeleteProgram(prog.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {isEditingProgram && (
                <ProgramForm
                    departments={departments}
                    initialData={editingProgramData}
                    universityId={university.id}
                    onClose={() => setIsEditingProgram(false)}
                />
            )}
        </div>
    );

}
