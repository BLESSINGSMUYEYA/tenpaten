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
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#36335e] tracking-tight">Academic Curriculum</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage your university's departments, programs, and course intakes.</p>
                </div>
                <div className="flex items-center p-1 bg-gray-100 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('programs')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'programs' ? 'bg-[#36335e] text-[#d5a22d] shadow-lg shadow-[#36335e]/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Programs
                    </button>
                    <button
                        onClick={() => setActiveTab('departments')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'departments' ? 'bg-[#36335e] text-[#d5a22d] shadow-lg shadow-[#36335e]/20' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Departments
                    </button>
                </div>
            </div>

            {activeTab === 'programs' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex-1 min-w-[300px] relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#d5a22d] transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by program name or level..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white focus:border-[#d5a22d]/30 focus:ring-0 rounded-xl text-sm font-medium transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsBulkUploadModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-bold rounded-xl text-xs uppercase tracking-widest transition-all"
                            >
                                <Upload className="w-4 h-4 text-[#d5a22d]" />
                                <span>Bulk Upload</span>
                            </button>
                            <button
                                onClick={handleCreateProgram}
                                className="flex items-center gap-2 px-6 py-3 bg-[#36335e] hover:bg-[#2a284a] text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#36335e]/20"
                            >
                                <Plus className="w-4 h-4 text-[#d5a22d]" />
                                <span>Add Program</span>
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
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-8">
                        <DepartmentManager departments={departments} />
                    </div>
                </div>
            )}
        </div>
        </>
    );
}
