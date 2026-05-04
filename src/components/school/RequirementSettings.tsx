'use client';

import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, FileText, User, GraduationCap, Sparkles, Upload, Briefcase, CircleDollarSign, Clock, Info, ChevronRight, Settings2 } from 'lucide-react';
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
        setRequirements({ ...requirements, [section]: !requirements[section] });
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
        } catch {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { id: 'personalInfo',   label: 'Personal Information',    icon: User,              description: 'Basic student details, contact info, and identity.' },
        { id: 'academicInfo',   label: 'Academic Background',     icon: GraduationCap,     description: 'Education history, grades, and qualifications.' },
        { id: 'familyInfo',     label: 'Family Information',      icon: FileText,          description: 'Parent details and emergency contacts.' },
        { id: 'activitiesInfo', label: 'Activities & Achievements', icon: Sparkles,        description: 'Extracurriculars, awards, and community involvement.' },
        { id: 'financialInfo',  label: 'Financial Information',   icon: CircleDollarSign,  description: 'Funding sources and financial aid requests.' },
        { id: 'workExperience', label: 'Work Experience',         icon: Briefcase,         description: 'Previous employment history and resume.' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">

            {/* ── Section Group 1: Application Window ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#d5a22d]/10 border border-[#d5a22d]/20 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Clock className="w-3.5 h-3.5" />
                        Timeframe Control
                    </div>
                    <h3 className="text-2xl font-black text-[#36335e] tracking-tight">Global Application Window</h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                        Define the operational period for admissions across all programmes. The portal will automatically lock outside these dates.
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Admissions Start Date</label>
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={openDate}
                                        onChange={(e) => setOpenDate(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all text-sm font-bold text-[#36335e] shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Final Submission Deadline</label>
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={closeDate}
                                        onChange={(e) => setCloseDate(e.target.value)}
                                        className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all text-sm font-bold text-[#36335e] shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex items-start gap-4 p-5 bg-[#36335e]/5 rounded-[1.5rem] border border-[#36335e]/10">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                <Info className="w-5 h-5 text-[#d5a22d]" />
                            </div>
                            <p className="text-xs font-bold text-[#36335e]/70 leading-relaxed uppercase tracking-wide py-1">
                                Ensure these dates match your institutional calendar. System automation handles locking and unlocking.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section Group 2: Data Collection ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#36335e]/10 border border-[#36335e]/20 text-[#36335e] text-[10px] font-black uppercase tracking-[0.2em]">
                        <Settings2 className="w-3.5 h-3.5" />
                        Strategy Engine
                    </div>
                    <h3 className="text-2xl font-black text-[#36335e] tracking-tight">Data Collection Strategy</h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                        Configure the student profile data required for a complete application. Essential fields ensure high-quality candidate filtering.
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {sections.map((section) => (
                                <div key={section.id} className="p-6 flex items-center justify-between gap-6 hover:bg-slate-50/50 transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all duration-300 shadow-sm">
                                            <section.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#36335e] text-lg tracking-tight leading-tight mb-1">{section.label}</h4>
                                            <p className="text-sm font-bold text-slate-400">{section.description}</p>
                                        </div>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={requirements[section.id]}
                                            onChange={() => toggleSection(section.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#36335e] shadow-inner"></div>
                                        <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline w-24 text-right">
                                            {requirements[section.id]
                                                ? <span className="text-[#d5a22d]">Required</span>
                                                : <span className="text-slate-300">Optional</span>
                                            }
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section Group 3: Documentation ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Upload className="w-3.5 h-3.5" />
                        Verification Hub
                    </div>
                    <h3 className="text-2xl font-black text-[#36335e] tracking-tight">Verifiable Documentation</h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                        Toggle the essential digital documents students must provide for proof of eligibility.
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-10">
                        <div className="flex flex-wrap gap-3">
                            {APPLICATION_DOCUMENTS.map((doc) => (
                                <button
                                    key={doc.value}
                                    onClick={() => {
                                        const slug = doc.value;
                                        const current = requirements.requiredDocuments || [];
                                        const next = current.includes(slug)
                                            ? current.filter((s: string) => s !== slug)
                                            : [...current, slug];
                                        setRequirements({ ...requirements, requiredDocuments: next });
                                    }}
                                    className={`px-6 py-3 rounded-2xl border-2 text-[11px] font-black uppercase tracking-[0.15em] transition-all transform active:scale-95 ${
                                        requirements.requiredDocuments?.includes(doc.value)
                                            ? 'bg-[#36335e] border-[#36335e] text-[#d5a22d] shadow-xl shadow-[#36335e]/20'
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-[#36335e]/30 hover:text-[#36335e]'
                                    }`}
                                >
                                    {doc.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section Group 4: Institutional Criteria ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        <FileText className="w-3.5 h-3.5" />
                        Admission Policy
                    </div>
                    <h3 className="text-2xl font-black text-[#36335e] tracking-tight">Institutional Criteria</h3>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed">
                        Specify admission standards, academic prerequisites, and language proficiency expectations.
                    </p>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-10 space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Admissions Standards</label>
                            <textarea
                                value={requirements.academicRequirements || ''}
                                onChange={(e) => setRequirements({ ...requirements, academicRequirements: e.target.value })}
                                placeholder={"Minimum GPA of 3.0\nHigh school diploma\nSAT/ACT scores"}
                                rows={4}
                                className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all text-sm font-bold text-[#36335e] resize-none placeholder:text-slate-300 shadow-sm"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Language Proficiency Framework</label>
                            <textarea
                                value={requirements.languageRequirements || ''}
                                onChange={(e) => setRequirements({ ...requirements, languageRequirements: e.target.value })}
                                placeholder={"IELTS 6.5 minimum\nTOEFL 80 minimum"}
                                rows={3}
                                className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all text-sm font-bold text-[#36335e] resize-none placeholder:text-slate-300 shadow-sm"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Candidate Advisor Note</label>
                            <textarea
                                value={requirements.additionalNote || ''}
                                onChange={(e) => setRequirements({ ...requirements, additionalNote: e.target.value })}
                                placeholder="Any other important information for applicants..."
                                rows={3}
                                className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-[#36335e]/10 focus:bg-white transition-all text-sm font-bold text-[#36335e] resize-none placeholder:text-slate-300 shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Status Message & Save ── */}
            <div className="sticky bottom-8 z-30">
                <div className="max-w-4xl mx-auto">
                    {message && (
                        <div className={`mb-4 px-6 py-4 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest border shadow-xl animate-in slide-in-from-bottom-4 duration-500 ${
                            message.type === 'success'
                                ? 'bg-[#36335e] text-[#d5a22d] border-[#d5a22d]/20'
                                : 'bg-rose-600 text-white border-rose-500'
                        }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="bg-white/80 backdrop-blur-xl border border-slate-100 p-4 rounded-3xl shadow-2xl flex justify-between items-center gap-4">
                        <div className="hidden md:flex items-center gap-4 text-slate-400">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                <Save className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Configuration Engine</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 bg-[#36335e] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#2a284a] transition-all shadow-xl shadow-[#36335e]/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-[#d5a22d] group-hover:scale-125 transition-transform" />
                                    Deploy Requirements
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
