'use client';

import { useState } from 'react';
import { Plus, Search, Layers, GraduationCap, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
const DepartmentManager = dynamic(() => import('@/components/school/DepartmentManager'), { ssr: false });
const ProgramList = dynamic(() => import('@/components/school/ProgramList'), { ssr: false });
const ProgramForm = dynamic(() => import('@/components/school/ProgramForm'), { ssr: false });
const BulkUploadModal = dynamic(() => import('@/components/school/BulkUploadModal'), { ssr: false });
import { PageHeader } from '@/components/ui/PageHeader';
import { DashboardCard } from '@/components/ui/DashboardCard';

export default function ProgramPageClient({ university }: { university: any }) {
    const [activeTab, setActiveTab] = useState<'programs' | 'departments'>('programs');
    const [isEditingProgram, setIsEditingProgram] = useState(false);
    const [editingProgramData, setEditingProgramData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);

    const programs = university.programs || [];
    const departments = university.departments || [];

    const filteredPrograms = programs.filter((p: any) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.level?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditProgram = (program: any) => {
        setEditingProgramData(program);
        setIsEditingProgram(true);
    };

    const handleCreateProgram = () => {
        setEditingProgramData(null);
        setIsEditingProgram(true);
    };

    return (
        <>
            <PageHeader
                preTitle={
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] border border-[#d5a22d]/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Layers className="w-3 h-3" />
                        Curriculum
                    </div>
                }
                title="Academic Programs"
                subtitle="Manage your university's curriculum, departments, and course intakes."
                action={
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                        <button
                            onClick={() => setActiveTab('programs')}
                            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'programs'
                                ? 'bg-white text-brand-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Programs
                        </button>
                        <button
                            onClick={() => setActiveTab('departments')}
                            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'departments'
                                ? 'bg-white text-brand-primary shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Departments
                        </button>
                    </div>
                }
            />

            {activeTab === 'programs' ? (
                <div className="space-y-8">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#36335e] transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search programs..."
                                className="w-full sm:w-80 pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setIsBulkUploadModalOpen(true)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#36335e] border border-slate-200 font-bold rounded-2xl text-sm transition-all transform hover:scale-105 active:scale-95"
                            >
                                <Upload className="w-4 h-4" />
                                Bulk Upload
                            </button>
                            <button
                                onClick={handleCreateProgram}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#36335e] hover:bg-[#2a284a] text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-[#36335e]/20 transform hover:scale-105 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Add Program
                            </button>
                        </div>
                    </div>

                    <ProgramList programs={filteredPrograms} onEdit={handleEditProgram} />

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
                <DashboardCard className="p-8">
                    <DepartmentManager departments={departments} />
                </DashboardCard>
            )}
        </>
    );
}
