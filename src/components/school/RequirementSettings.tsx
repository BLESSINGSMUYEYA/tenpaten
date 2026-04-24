'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, FileText, User, GraduationCap, Sparkles, Upload, Briefcase, CircleDollarSign, Clock } from 'lucide-react';
import { APPLICATION_DOCUMENTS } from '@/lib/constants';

interface UniversityRequirementSettingsProps {
    university: any;
}

export default function RequirementSettings({ university }: UniversityRequirementSettingsProps) {
    const [requirements, setRequirements] = useState(university.applicationRequirements || {
        personalInfo: true,
        academicInfo: true,
        familyInfo: true,
        activitiesInfo: false,
        financialInfo: false,
        workExperience: false,
        requiredDocuments: ['passport', 'transcripts'],
        academicRequirements: '',
        languageRequirements: '',
        additionalNote: ''
    });
    const [openDate, setOpenDate] = useState(university.applicationOpenDate ? new Date(university.applicationOpenDate).toISOString().split('T')[0] : '');
    const [closeDate, setCloseDate] = useState(university.applicationCloseDate ? new Date(university.applicationCloseDate).toISOString().split('T')[0] : '');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const toggleSection = (section: string) => {
        setRequirements({
            ...requirements,
            [section]: !requirements[section]
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const response = await fetch('/api/university/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    applicationRequirements: requirements,
                    applicationOpenDate: openDate || null,
                    applicationCloseDate: closeDate || null
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Requirements updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update requirements.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { id: 'personalInfo', label: 'Personal Information', icon: User, description: 'Basic student details, contact info, and identity.' },
        { id: 'academicInfo', label: 'Academic Background', icon: GraduationCap, description: 'Education history, grades, and qualifications.' },
        { id: 'familyInfo', label: 'Family Information', icon: FileText, description: 'Parent details and emergency contacts.' },
        { id: 'activitiesInfo', label: 'Activities & Achievements', icon: Sparkles, description: 'Extracurriculars and awards.' },
        { id: 'financialInfo', label: 'Financial Information', icon: CircleDollarSign, description: 'Funding sources and financial aid requests.' },
        { id: 'workExperience', label: 'Work Experience', icon: Briefcase, description: 'Previous employment history and resume.' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Application Window Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-[#36335e]/5 overflow-hidden transition-all duration-300">
                <div className="p-8 border-b border-slate-100 bg-[#36335e]/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#36335e] tracking-tight">Global Application Window</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Define the operational period for admissions across all programs.</p>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-md border border-[#36335e]/10 flex items-center justify-center text-[#36335e]">
                        <Clock className="w-7 h-7 text-[#d5a22d]" />
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Admissions Start Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={openDate}
                                    onChange={(e) => setOpenDate(e.target.value)}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white transition-all text-sm font-bold text-[#36335e] shadow-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Final Submission Deadline</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={closeDate}
                                    onChange={(e) => setCloseDate(e.target.value)}
                                    className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white transition-all text-sm font-bold text-[#36335e] shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <p className="text-xs font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                            The portal will automatically lock outside these dates. Ensure these match your institutional calendar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Customization Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-[#36335e]/5 overflow-hidden transition-all duration-300">
                <div className="p-8 border-b border-slate-100 bg-[#36335e]/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#36335e] tracking-tight">Data Collection Strategy</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Configure the student profile data required for a complete application.</p>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-md border border-[#36335e]/10 flex items-center justify-center">
                        <User className="w-7 h-7 text-[#d5a22d]" />
                    </div>
                </div>

                <div className="divide-y divide-slate-100/50">
                    {sections.map((section) => (
                        <div key={section.id} className="p-6 md:p-8 flex items-start justify-between gap-6 hover:bg-slate-50/50 transition-colors group">
                            <div className="flex gap-5">
                                <div className="p-4 bg-[#36335e]/5 rounded-2xl h-fit shadow-sm border border-[#36335e]/10 group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all">
                                    <section.icon className="w-6 h-6 transition-colors" />
                                </div>
                                <div className="mt-1">
                                    <h4 className="font-black text-[#36335e] uppercase tracking-tight text-lg mb-1">{section.label}</h4>
                                    <p className="text-sm font-medium text-slate-500 leading-snug">{section.description}</p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    checked={requirements[section.id]}
                                    onChange={() => toggleSection(section.id)}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#36335e]"></div>
                                <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:inline w-20">
                                    {requirements[section.id] ? <span className="text-[#36335e] bg-[#36335e]/10 px-2.5 py-1 rounded-lg">Mandatory</span> : 'Optional'}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Document Requirements Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-[#36335e]/5 overflow-hidden transition-all duration-300">
                <div className="p-8 border-b border-slate-100 bg-[#36335e]/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#36335e] tracking-tight">Verifiable Documentation</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Toggle the essential digital documents students must provision.</p>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-md border border-[#36335e]/10 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-[#d5a22d]" />
                    </div>
                </div>
                <div className="p-8">
                    <div className="flex flex-wrap gap-3">
                        {APPLICATION_DOCUMENTS.map((doc) => (
                            <button
                                key={doc.value}
                                className={`px-6 py-3.5 rounded-2xl border shadow-sm text-xs font-black uppercase tracking-widest transition-all transform active:scale-95 ${requirements.requiredDocuments?.includes(doc.value)
                                    ? 'bg-[#36335e] border-[#36335e] text-[#d5a22d] shadow-[#36335e]/20 shadow-lg'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-[#36335e]/30 hover:bg-slate-50'
                                    }`}
                                onClick={() => {
                                    const slug = doc.value;
                                    const current = requirements.requiredDocuments || [];
                                    const next = current.includes(slug)
                                        ? current.filter((s: string) => s !== slug)
                                        : [...current, slug];
                                    setRequirements({ ...requirements, requiredDocuments: next });
                                }}
                            >
                                {doc.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Textual Requirements Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-[#36335e]/5 overflow-hidden transition-all duration-300">
                <div className="p-8 border-b border-slate-100 bg-[#36335e]/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#36335e] tracking-tight">Institutional Criteria</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Specify detailed admission standards and academic prerequisites.</p>
                    </div>
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-md border border-[#36335e]/10 flex items-center justify-center">
                        <FileText className="w-7 h-7 text-[#d5a22d]" />
                    </div>
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Admissions Standards</label>
                        <textarea
                            value={requirements.academicRequirements || ''}
                            onChange={(e) => setRequirements({ ...requirements, academicRequirements: e.target.value })}
                            placeholder="Example: Minimumn GPA of 3.0&#10;High school diploma&#10;SAT/ACT scores"
                            className="w-full h-32 px-8 py-6 rounded-[2rem] bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white transition-all text-sm font-bold text-[#36335e] resize-none shadow-inner"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Language Proficiency Framework</label>
                        <textarea
                            value={requirements.languageRequirements || ''}
                            onChange={(e) => setRequirements({ ...requirements, languageRequirements: e.target.value })}
                            placeholder="Example: IELTS 6.5 minimum&#10;TOEFL 80 minimum"
                            className="w-full h-32 px-8 py-6 rounded-[2rem] bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white transition-all text-sm font-bold text-[#36335e] resize-none shadow-inner"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Candidate Advisor Note</label>
                        <textarea
                            value={requirements.additionalNote || ''}
                            onChange={(e) => setRequirements({ ...requirements, additionalNote: e.target.value })}
                            placeholder="Any other important info for students..."
                            className="w-full h-24 px-8 py-6 rounded-[2rem] bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/5 focus:bg-white transition-all text-sm font-bold text-[#36335e] resize-none shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 font-black uppercase tracking-widest text-xs shadow-lg border animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                    message.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/10' 
                    : 'bg-rose-50 text-rose-800 border-rose-200 shadow-rose-500/10'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> : <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="flex justify-end pt-8">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 px-10 py-5 bg-[#36335e] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#2a284a] transition-all shadow-xl shadow-[#36335e]/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 group"
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Synchronizing...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5 text-[#d5a22d] group-hover:scale-110 transition-transform" />
                            Deploy Requirements
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
