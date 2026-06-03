'use client';

import { useState } from 'react';
import { Plus, Search, Layers, GraduationCap, Upload, BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/ui/PageHeader';

const DepartmentManager = dynamic(() => import('@/components/school/DepartmentManager'), { ssr: false });
const ProgramList       = dynamic(() => import('@/components/school/ProgramList'), { ssr: false });
const ProgramForm       = dynamic(() => import('@/components/school/ProgramForm'), { ssr: false });
const BulkUploadModal   = dynamic(() => import('@/components/school/BulkUploadModal'), { ssr: false });

export default function ProgramPageClient({ university, universityId }: { university: any, universityId?: string }) {
    const [activeTab, setActiveTab]               = useState<'programs' | 'departments'>('programs');
    const [isEditingProgram, setIsEditingProgram] = useState(false);
    const [editingProgramData, setEditingProgramData] = useState<any>(null);
    const [searchQuery, setSearchQuery]           = useState('');
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

    const programs    = university.programs    || [];
    const departments = university.departments || [];

    const filteredPrograms = programs.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.level?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditProgram   = (program: any) => { setEditingProgramData(program); setIsEditingProgram(true); };
    const handleCreateProgram = ()             => { setEditingProgramData(null);    setIsEditingProgram(true); };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            
            <PageHeader 
                preTitle={
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        <BookOpen className="w-3.5 h-3.5" />
                        Curriculum Engine
                    </div>
                }
                title="Academic Curriculum"
                subtitle={
                    <>
                        Manage departments, programs, and course intakes for <span className="font-bold text-brand-accent">{university.name}</span>.
                    </>
                }
                action={
                    <div className="flex items-center p-1.5 bg-slate-100 rounded-[1.25rem] shadow-inner border border-slate-200/50">
                        <button
                            onClick={() => setActiveTab('programs')}
                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all transform active:scale-95 ${
                                activeTab === 'programs'
                                    ? 'bg-brand-primary text-brand-accent shadow-lg'
                                    : 'text-slate-400 hover:text-brand-primary'
                            }`}
                        >
                            <GraduationCap className={`w-4 h-4 ${activeTab === 'programs' ? 'text-brand-accent' : 'text-slate-300'}`} />
                            Programmes
                        </button>
                        <button
                            onClick={() => setActiveTab('departments')}
                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all transform active:scale-95 ${
                                activeTab === 'departments'
                                    ? 'bg-brand-primary text-brand-accent shadow-lg'
                                    : 'text-slate-400 hover:text-brand-primary'
                            }`}
                        >
                            <Layers className={`w-4 h-4 ${activeTab === 'departments' ? 'text-brand-accent' : 'text-slate-300'}`} />
                            Departments
                        </button>
                    </div>
                }
            />

            {activeTab === 'programs' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-4 px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                            {/* Search */}
                            <div className="flex-1 min-w-[300px] relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search programs or levels..."
                                    className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl text-sm font-bold text-brand-primary border-none focus:ring-4 focus:ring-brand-primary/10 transition-all shadow-sm placeholder:text-slate-300"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsBulkUploadModalOpen(true)}
                                    className="h-12 flex items-center gap-2.5 px-6 bg-white border border-slate-100 text-brand-primary font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <Upload className="w-4 h-4 text-brand-accent" />
                                    Bulk Upload
                                </button>
                                <button
                                    onClick={handleCreateProgram}
                                    className="h-12 flex items-center gap-2.5 px-6 bg-brand-primary text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-brand-primary-hover transition-all shadow-xl shadow-brand-primary/20 active:scale-95 group"
                                >
                                    <Plus className="w-4 h-4 text-brand-accent group-hover:rotate-90 transition-transform" />
                                    Add Programme
                                </button>
                            </div>
                        </div>

                        <ProgramList programs={filteredPrograms} onEdit={handleEditProgram} />
                    </div>

                    {isEditingProgram && (
                        <ProgramForm
                            departments={departments}
                            initialData={editingProgramData}
                            universityId={universityId}
                            onClose={() => setIsEditingProgram(false)}
                        />
                    )}

                    {isBulkUploadModalOpen && (
                        <BulkUploadModal
                            onClose={() => setIsBulkUploadModalOpen(false)}
                            departments={departments}
                            universityId={universityId}
                        />
                    )}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <DepartmentManager departments={departments} universityId={universityId} />
                </div>
            )}
        </div>
    );
}
