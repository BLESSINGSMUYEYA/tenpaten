'use client';

import { useState } from 'react';
import { Plus, Search, Layers, GraduationCap, Upload, BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/ui/PageHeader';

const DepartmentManager = dynamic(() => import('@/components/school/DepartmentManager'), { ssr: false });
const ProgramList       = dynamic(() => import('@/components/school/ProgramList'), { ssr: false });
const ProgramForm       = dynamic(() => import('@/components/school/ProgramForm'), { ssr: false });
const BulkUploadModal   = dynamic(() => import('@/components/school/BulkUploadModal'), { ssr: false });

export default function ProgramPageClient({ university }: { university: any }) {
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
                    <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] border border-[#d5a22d]/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        <BookOpen className="w-3.5 h-3.5" />
                        Curriculum Engine
                    </div>
                }
                title="Academic Curriculum"
                subtitle={
                    <>
                        Manage departments, programs, and course intakes for <span className="font-bold text-[#d5a22d]">{university.name}</span>.
                    </>
                }
                action={
                    <div className="flex items-center p-1.5 bg-slate-100 rounded-[1.25rem] shadow-inner border border-slate-200/50">
                        <button
                            onClick={() => setActiveTab('programs')}
                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all transform active:scale-95 ${
                                activeTab === 'programs'
                                    ? 'bg-[#36335e] text-[#d5a22d] shadow-lg'
                                    : 'text-slate-400 hover:text-[#36335e]'
                            }`}
                        >
                            <GraduationCap className={`w-4 h-4 ${activeTab === 'programs' ? 'text-[#d5a22d]' : 'text-slate-300'}`} />
                            Programmes
                        </button>
                        <button
                            onClick={() => setActiveTab('departments')}
                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all transform active:scale-95 ${
                                activeTab === 'departments'
                                    ? 'bg-[#36335e] text-[#d5a22d] shadow-lg'
                                    : 'text-slate-400 hover:text-[#36335e]'
                            }`}
                        >
                            <Layers className={`w-4 h-4 ${activeTab === 'departments' ? 'text-[#d5a22d]' : 'text-slate-300'}`} />
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
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-[#36335e] transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search programs or levels..."
                                    className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl text-sm font-bold text-[#36335e] border-none focus:ring-4 focus:ring-[#36335e]/10 transition-all shadow-sm placeholder:text-slate-300"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsBulkUploadModalOpen(true)}
                                    className="h-12 flex items-center gap-2.5 px-6 bg-white border border-slate-100 text-[#36335e] font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    <Upload className="w-4 h-4 text-[#d5a22d]" />
                                    Bulk Upload
                                </button>
                                <button
                                    onClick={handleCreateProgram}
                                    className="h-12 flex items-center gap-2.5 px-6 bg-[#36335e] text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-[#2a284a] transition-all shadow-xl shadow-[#36335e]/20 active:scale-95 group"
                                >
                                    <Plus className="w-4 h-4 text-[#d5a22d] group-hover:rotate-90 transition-transform" />
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
                            onClose={() => setIsEditingProgram(false)}
                        />
                    )}

                    {isBulkUploadModalOpen && (
                        <BulkUploadModal
                            onClose={() => setIsBulkUploadModalOpen(false)}
                            departments={departments}
                        />
                    )}
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <DepartmentManager departments={departments} />
                </div>
            )}
        </div>
    );
}
