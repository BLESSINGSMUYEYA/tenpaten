'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Circle, Star, AlertCircle, Save, Check } from 'lucide-react';
import { updateReviewData } from '@/lib/actions/review';
import { useRouter } from 'next/navigation';

interface ReviewToolkitProps {
    applicationId: string;
    initialReviewData: any;
    personalInfo: any;
    academicInfo: any;
    documents?: any[];
}

export default function ReviewToolkit({ applicationId, initialReviewData, personalInfo, academicInfo, documents }: ReviewToolkitProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [reviewData, setReviewData] = useState(initialReviewData || {
        checkedSections: [],
        verifiedDocuments: [],
        score: 0,
        notes: ''
    });

    const sections = [
        { id: 'personal', label: 'Personal Information' },
        { id: 'family', label: 'Family Information' },
        { id: 'academic', label: 'Academic Background' },
        { id: 'activities', label: 'Activities & Achievements' },
    ];

    const toggleSection = (sectionId: string) => {
        const checkedSections = [...(reviewData.checkedSections || [])];
        const index = checkedSections.indexOf(sectionId);
        if (index > -1) {
            checkedSections.splice(index, 1);
        } else {
            checkedSections.push(sectionId);
        }
        updateData({ checkedSections });
    };

    const toggleDocument = (docUrl: string) => {
        const verifiedDocuments = [...(reviewData.verifiedDocuments || [])];
        const index = verifiedDocuments.indexOf(docUrl);
        if (index > -1) {
            verifiedDocuments.splice(index, 1);
        } else {
            verifiedDocuments.push(docUrl);
        }
        updateData({ verifiedDocuments });
    };

    const setScore = (score: number) => {
        updateData({ score });
    };

    const updateData = (newData: any) => {
        const updated = { ...reviewData, ...newData };
        setReviewData(updated);
        saveData(updated);
    };

    const saveData = async (data: any) => {
        setIsSaving(true);
        const result = await updateReviewData(applicationId, data);
        if (result.success) {
            router.refresh();
        }
        setIsSaving(false);
    };

    const gpa = academicInfo?.gpa || academicInfo?.cgpa || academicInfo?.averageGrade || 'N/A';
    const latestQualification = academicInfo?.latestQualification || academicInfo?.qualification || 'N/A';

    return (
        <Card className="border border-slate-100 shadow-sm overflow-hidden bg-white rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-6 sm:px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Review Toolkit</CardTitle>
                        <CardDescription className="text-slate-500 text-sm font-medium mt-1">Internal assessment tools</CardDescription>
                    </div>
                    {isSaving ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#36335e] uppercase tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-slate-200">
                            <div className="w-3 h-3 border-2 border-[#36335e]/30 border-t-[#36335e] rounded-full animate-spin" />
                            Saving...
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 animate-in fade-in transition-all shadow-sm">
                            <Check className="w-3.5 h-3.5" />
                            Saved
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-10 px-6 sm:px-8 pb-8">
                {/* Academic Quick View */}
                <div className="bg-white rounded-xl p-0">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Academic Snapshot</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-colors">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">GPA / Grade</p>
                            <p className="text-xl font-black text-[#36335e] tracking-tight">{gpa}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-colors">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Qualification</p>
                            <p className="text-sm font-bold text-slate-900 tracking-tight truncate" title={latestQualification}>{latestQualification}</p>
                        </div>
                    </div>
                </div>

                {/* Section Checklist */}
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Verification</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {sections.map((section) => {
                            const isChecked = reviewData.checkedSections?.includes(section.id);
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => toggleSection(section.id)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group ${isChecked
                                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                                        }`}
                                >
                                    <span className="text-sm font-bold">{section.label}</span>
                                    {isChecked ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-slate-200 group-hover:text-slate-400" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Document Verification */}
                {documents && documents.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Verification</h4>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{reviewData.verifiedDocuments?.length || 0}/{documents.length}</span>
                        </div>
                        <div className="space-y-3">
                            {documents.map((doc, idx) => {
                                const isVerified = reviewData.verifiedDocuments?.includes(doc.url);
                                return (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white group hover:border-[#36335e]/30 hover:shadow-sm hover:shadow-[#36335e]/5 transition-all">
                                        <div className="flex flex-col min-w-0 pr-4">
                                            <span className="text-sm font-bold text-slate-900 tracking-tight truncate" title={doc.name}>{doc.name}</span>
                                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{doc.type || 'Document'}</span>
                                        </div>
                                        <button
                                            onClick={() => toggleDocument(doc.url)}
                                            className={`p-2.5 rounded-lg transition-all shadow-sm ${isVerified
                                                ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                                : 'bg-slate-50 text-slate-300 border border-slate-100 hover:text-slate-500 hover:bg-slate-100'
                                                }`}
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Star Rating */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-t border-slate-100 pt-8">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Score</h4>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${(reviewData.score || 0) >= 4 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            (reviewData.score || 0) >= 3 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                            {reviewData.score || 0}/5
                        </span>
                    </div>
                    <div className="flex items-center justify-between px-2 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                onClick={() => setScore(s)}
                                className="transition-all hover:-translate-y-1 active:scale-90 focus:outline-none"
                            >
                                <Star
                                    className={`w-10 h-10 transition-colors duration-300 ${s <= (reviewData.score || 0)
                                        ? 'fill-[#d5a22d] text-[#d5a22d] drop-shadow-md'
                                        : 'text-slate-200 hover:text-slate-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
