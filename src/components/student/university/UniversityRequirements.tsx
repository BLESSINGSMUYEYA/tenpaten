'use client';

import React from 'react';
import { ClipboardCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface UniversityRequirementsProps {
    requirements: any;
}

export function UniversityRequirements({ requirements }: UniversityRequirementsProps) {
    // If requirements is a string, try to parse it, otherwise use it as is
    const data = typeof requirements === 'string' ? JSON.parse(requirements) : requirements;

    const sections = [
        {
            title: "Academic Requirements",
            icon: ClipboardCheck,
            items: data?.academicRequirements 
                ? data.academicRequirements.split('\n').filter((i: string) => i.trim())
                : [
                    "Minimum GPA of 3.0 or equivalent",
                    "Official high school or college transcripts",
                    "Standardized test scores (optional for some programs)"
                ]
        },
        {
            title: "Language Proficiency",
            icon: FileText,
            items: data?.languageRequirements
                ? data.languageRequirements.split('\n').filter((i: string) => i.trim())
                : [
                    "IELTS: 6.5 minimum (no band under 6.0)",
                    "TOEFL iBT: 80 minimum",
                    "Duolingo: 110 minimum"
                ]
        },
        {
            title: "Required Documents",
            icon: CheckCircle2,
            items: data?.documents || [
                "Valid Passport copy",
                "Statement of Purpose (SOP)",
                "Letters of Recommendation (LOR)",
                "Updated Resume/CV"
            ]
        }
    ];

    const additionalNote = data?.additionalNote || "Admission criteria can vary by department. We strongly advise candidates to verify specific prerequisite courses with the institution's global admissions office.";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-[#d5a22d] rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admission <span className="text-[#d5a22d]">Requirements</span></h2>
                </div>
                <p className="text-white/40 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] ml-5">Standard global criteria for international enrollment</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-10">
                {sections.map((section, i) => (
                    <div key={i} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <section.icon className="w-5 h-5 text-[#d5a22d]" />
                            </div>
                            <h3 className="text-base font-black text-white/90 tracking-tight uppercase tracking-widest">{section.title}</h3>
                        </div>
                        
                        <div className="space-y-3 pl-2">
                            {section.items.map((item: string, j: number) => (
                                <div key={j} className="flex items-start gap-4 group/item py-2 border-l border-white/5 pl-4 transition-all hover:border-[#d5a22d]/50">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#d5a22d]/30 group-hover/item:bg-[#d5a22d] transition-colors shrink-0" />
                                    <span className="text-white/60 text-sm font-medium tracking-tight leading-relaxed group-hover:text-white transition-colors">{item}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row items-center gap-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/5 rounded-full blur-2xl" />
                <div className="w-16 h-16 bg-[#d5a22d]/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-md border border-[#d5a22d]/20">
                    <AlertCircle className="w-8 h-8 text-[#d5a22d]" />
                </div>
                <div className="space-y-2 relative z-10 text-center sm:text-left">
                    <h4 className="font-black text-sm tracking-[0.2em] uppercase text-[#d5a22d]">Important Note</h4>
                    <p className="text-white/50 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                        {additionalNote}
                    </p>
                </div>
            </div>
        </div>
    );
}
