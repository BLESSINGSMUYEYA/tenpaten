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
        <div className="space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#36335e]/10 transition-all duration-300 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Global Application Window</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Set the dates when applications are open for all programs.</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Application Open Date</label>
                            <input
                                type="date"
                                value={openDate}
                                onChange={(e) => setOpenDate(e.target.value)}
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#d5a22d]/20 focus:bg-white transition-all text-sm font-bold text-[#36335e]"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Application Close Date (Deadline)</label>
                            <input
                                type="date"
                                value={closeDate}
                                onChange={(e) => setCloseDate(e.target.value)}
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#d5a22d]/20 focus:bg-white transition-all text-sm font-bold text-[#36335e]"
                            />
                        </div>
                    </div>
                    <p className="mt-6 text-xs font-medium text-slate-400 italic">
                        Students will be able to apply to any program between these dates. Outside this window, applications will be disabled.
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#36335e]/10 transition-all duration-300 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Application Form Customization</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Enable or disable sections that students must fill during application.</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-400" />
                    </div>
                </div>

                <div className="divide-y divide-slate-100/50">
                    {sections.map((section) => (
                        <div key={section.id} className="p-6 md:p-8 flex items-start justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                            <div className="flex gap-5">
                                <div className="p-3 bg-slate-100 rounded-xl h-fit shadow-sm border border-slate-200/50">
                                    <section.icon className="w-5 h-5 text-slate-600" />
                                </div>
                                <div className="mt-1">
                                    <h4 className="font-bold text-slate-900 leading-none mb-2">{section.label}</h4>
                                    <p className="text-sm font-medium text-slate-500 leading-snug">{section.description}</p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    checked={requirements[section.id]}
                                    onChange={() => toggleSection(section.id)}
                                    className="sr-only peer"
                                />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#36335e]"></div>
                                <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden sm:inline w-20">
                                    {requirements[section.id] ? <span className="text-[#36335e] bg-[#36335e]/10 px-2.5 py-1 rounded-lg">Required</span> : 'Hidden'}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#36335e]/10 transition-all duration-300 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Document Requirements</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Select which documents students must upload.</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                </div>
                <div className="p-8">
                    <div className="flex flex-wrap gap-3">
                        {APPLICATION_DOCUMENTS.map((doc) => (
                            <button
                                key={doc.value}
                                className={`px-5 py-2.5 rounded-xl border shadow-sm text-sm font-bold transition-all transform active:scale-95 ${requirements.requiredDocuments?.includes(doc.value)
                                    ? 'bg-[#36335e] border-[#36335e] text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
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

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#36335e]/10 transition-all duration-300 overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Requirement Details</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">Enter specific admission criteria for your institution (one per line).</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                </div>
                <div className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Academic Requirements</label>
                        <textarea
                            value={requirements.academicRequirements || ''}
                            onChange={(e) => setRequirements({ ...requirements, academicRequirements: e.target.value })}
                            placeholder="Example: Minimumn GPA of 3.0&#10;High school diploma&#10;SAT/ACT scores"
                            className="w-full h-32 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#d5a22d]/20 focus:bg-white transition-all text-sm font-medium text-[#36335e] resize-none"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Language Proficiency</label>
                        <textarea
                            value={requirements.languageRequirements || ''}
                            onChange={(e) => setRequirements({ ...requirements, languageRequirements: e.target.value })}
                            placeholder="Example: IELTS 6.5 minimum&#10;TOEFL 80 minimum"
                            className="w-full h-32 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#d5a22d]/20 focus:bg-white transition-all text-sm font-medium text-[#36335e] resize-none"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-[#36335e]">Important Note (Displayed at bottom)</label>
                        <textarea
                            value={requirements.additionalNote || ''}
                            onChange={(e) => setRequirements({ ...requirements, additionalNote: e.target.value })}
                            placeholder="Any other important info for students..."
                            className="w-full h-24 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#d5a22d]/20 focus:bg-white transition-all text-sm font-medium text-[#36335e] resize-none"
                        />
                    </div>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-medium shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    <span>{message.text}</span>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-4 bg-[#36335e] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#2a284a] transition-all shadow-lg shadow-[#36335e]/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Requirements
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
