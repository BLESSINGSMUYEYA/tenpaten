'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, GraduationCap, Coins, ShieldAlert, Cpu, Heart, Palette, TrendingUp, RefreshCw, X, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartMatchWizardProps {
    onApplyFilters: (filters: { query?: string; level?: string; hasScholarship?: boolean }) => void;
    onReset: () => void;
}

export default function SmartMatchWizard({ onApplyFilters, onReset }: SmartMatchWizardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedField, setSelectedField] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [scholarshipOnly, setScholarshipOnly] = useState<boolean | null>(null);

    const fields = [
        { id: 'Engineering', label: 'Engineering & Tech', icon: Cpu, desc: 'CS, IT, Mechanical, Civil, Electrical' },
        { id: 'Medicine', label: 'Health & Medicine', icon: Heart, desc: 'Nursing, Pharmacy, Clinical, Public Health' },
        { id: 'Business', label: 'Business & Finance', icon: TrendingUp, desc: 'Accounting, Management, Marketing, Econ' },
        { id: 'Arts', label: 'Arts & Humanities', icon: Palette, desc: 'Education, Journalism, Languages, Law' }
    ];

    const levels = [
        { id: 'Undergraduate', label: 'Undergraduate', desc: 'Bachelors degrees & professional courses' },
        { id: 'Postgraduate', label: 'Postgraduate', desc: 'Masters, Postgrad diplomas & specializations' },
        { id: 'Diploma', label: 'Diploma', desc: 'Practical, skill-focused 2-3 year programs' },
        { id: 'Certificate', label: 'Certificate', desc: 'Short-term foundational career programs' }
    ];

    const budgetOptions = [
        { id: 'true', label: 'Scholarships Only', desc: 'Show universities offering tuition waivers or discounts', value: true },
        { id: 'false', label: 'Show All Options', desc: 'Browse all verified accredited institutions', value: false }
    ];

    const handleApply = () => {
        onApplyFilters({
            query: selectedField || undefined,
            level: selectedLevel || undefined,
            hasScholarship: scholarshipOnly === true ? true : undefined
        });
        setIsOpen(false);
    };

    const handleReset = () => {
        setSelectedField(null);
        setSelectedLevel(null);
        setScholarshipOnly(null);
        setStep(1);
        onReset();
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Toggle Card */}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-[#1d1b41] to-brand-primary border border-white/10 hover:border-brand-accent/40 shadow-2xl p-6 sm:p-8 cursor-pointer group transition-all duration-500 ${isOpen ? 'shadow-inner hover:scale-100' : 'hover:-translate-y-1'}`}
            >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                    <Sparkles className="w-32 h-32 text-white" />
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-black uppercase tracking-[0.25em]">
                            <Sparkles className="w-3 h-3 text-brand-accent" />
                            Smart Discovery
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Find Your Perfect Program</h2>
                        <p className="text-white/60 text-sm font-medium">Answer 3 simple questions to discover matching universities instantly.</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-accent text-[#1d1b41] hover:bg-[#b89531] text-xs font-black uppercase tracking-widest transition-all shrink-0">
                        {isOpen ? 'Close Finder' : 'Launch Finder'}
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Expandable Wizard Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl relative"
                    >
                        <div className="p-6 sm:p-10 space-y-8">
                            {/* Step Indicators */}
                            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary font-black text-sm">
                                        {step}
                                    </div>
                                    <span className="text-xs font-black text-brand-primary uppercase tracking-widest">Step {step} of 3</span>
                                </div>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map((s) => (
                                        <div 
                                            key={s}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-brand-accent' : s < step ? 'w-3 bg-brand-primary' : 'w-3 bg-gray-100'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Wizard Body */}
                            <div className="min-h-[220px]">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-left">
                                                <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight">What field excites you most?</h3>
                                                <p className="text-slate-400 text-xs font-medium">Select a primary focus area to filter academic pathways.</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {fields.map((f) => {
                                                    const Icon = f.icon;
                                                    const isSelected = selectedField === f.id;
                                                    return (
                                                        <div
                                                            key={f.id}
                                                            onClick={() => setSelectedField(f.id)}
                                                            className={`p-5 rounded-2xl border text-left cursor-pointer group transition-all duration-300 ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'bg-gray-50/50 border-gray-100 hover:border-brand-accent/30 hover:bg-white'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/10 text-brand-accent' : 'bg-brand-primary/5 text-brand-primary'}`}>
                                                                    <Icon className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-white' : 'text-brand-primary'}`}>{f.label}</h4>
                                                                    <p className={`text-[10px] font-medium leading-tight ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{f.desc}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-left">
                                                <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight">What academic level are you seeking?</h3>
                                                <p className="text-slate-400 text-xs font-medium">Choose your targets to find the appropriate depth of curriculum.</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {levels.map((l) => {
                                                    const isSelected = selectedLevel === l.id;
                                                    return (
                                                        <div
                                                            key={l.id}
                                                            onClick={() => setSelectedLevel(l.id)}
                                                            className={`p-5 rounded-2xl border text-left cursor-pointer group transition-all duration-300 ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'bg-gray-50/50 border-gray-100 hover:border-brand-accent/30 hover:bg-white'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/10 text-brand-accent' : 'bg-brand-primary/5 text-brand-primary'}`}>
                                                                    <GraduationCap className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <h4 className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-white' : 'text-brand-primary'}`}>{l.label}</h4>
                                                                    <p className={`text-[10px] font-medium leading-tight ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{l.desc}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-left">
                                                <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight">Do you require a scholarship?</h3>
                                                <p className="text-slate-400 text-xs font-medium">Filter for programs and schools offering financial waivers.</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {budgetOptions.map((b) => {
                                                    const isSelected = scholarshipOnly === b.value;
                                                    return (
                                                        <div
                                                            key={b.id}
                                                            onClick={() => setScholarshipOnly(b.value)}
                                                            className={`p-5 rounded-2xl border text-left cursor-pointer group transition-all duration-300 ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'bg-gray-50/50 border-gray-100 hover:border-brand-accent/30 hover:bg-white'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/10 text-brand-accent' : 'bg-brand-primary/5 text-brand-primary'}`}>
                                                                    {b.value ? <Coins className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                                                </div>
                                                                <div>
                                                                    <h4 className={`font-black text-sm uppercase tracking-tight ${isSelected ? 'text-white' : 'text-brand-primary'}`}>{b.label}</h4>
                                                                    <p className={`text-[10px] font-medium leading-tight ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>{b.desc}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Wizard Footer Controls */}
                            <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-brand-primary transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Reset Discovery
                                </button>
                                
                                <div className="flex gap-3">
                                    {step > 1 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="px-5 py-3 rounded-xl border border-gray-200 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-gray-50 transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                    {step < 3 ? (
                                        <button
                                            onClick={() => setStep(step + 1)}
                                            disabled={step === 1 ? !selectedField : step === 2 ? !selectedLevel : false}
                                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
                                                (step === 1 && !selectedField) || (step === 2 && !selectedLevel)
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-brand-primary text-brand-accent hover:bg-brand-primary-hover'
                                            }`}
                                        >
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleApply}
                                            disabled={scholarshipOnly === null}
                                            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
                                                scholarshipOnly === null
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-brand-accent text-[#1d1b41] hover:bg-[#b89531]'
                                            }`}
                                        >
                                            Find Match
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
