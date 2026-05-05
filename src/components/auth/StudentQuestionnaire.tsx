'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles, ArrowRight, BookOpen, GraduationCap, Building2, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mapping icons for common categories (if using grid type)
const ICON_MAP: Record<string, any> = {
    medicine: '🩺',
    engineering: '🏗️',
    tech: '💻',
    business: '💼',
    arts: '🎨',
    law: '⚖️',
    science: '🧪',
    default: '📚'
};

export type QuestionOption = { value: string; label: string; icon?: string };

export type QuestionData = {
    id: string;
    key: string;
    title: string;
    description: string | null;
    type: string;
    placeholder: string | null;
    options: unknown;
};

interface StudentQuestionnaireProps {
    questions: QuestionData[];
    onComplete: (data: Record<string, string>) => void;
}

export default function StudentQuestionnaire({ questions, onComplete }: StudentQuestionnaireProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isMatching, setIsMatching] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!questions || questions.length === 0) {
        return (
            <div className="w-full max-w-md mx-auto p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 text-center">
                <p className="text-white/40 text-sm mb-6">No discovery path configured yet.</p>
                <Button onClick={() => onComplete({})} className="w-full h-14 rounded-2xl bg-[#d5a22d] text-[#1a1b41] font-black uppercase tracking-widest">
                    Continue to Register
                </Button>
            </div>
        );
    }

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsMatching(true);
            setTimeout(() => {
                setIsMatching(false);
                setShowSummary(true);
            }, 2000);
        }
    };

    const handleBack = () => {
        if (showSummary) setShowSummary(false);
        else if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [questions[currentStep].key]: value }));
        // Auto-advance for grid type if desired, or let them click continue
    };

    const currentQuestion = questions[currentStep];
    const options = (currentQuestion?.options as QuestionOption[] | null) ?? [];
    const isLastStep = currentStep === questions.length - 1;
    const canContinue = !!answers[currentQuestion?.key];
    const progress = ((currentStep + 1) / questions.length) * 100;

    if (isMatching) {
        return (
            <div className="w-full max-w-lg mx-auto py-20 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 rounded-full border-4 border-[#d5a22d]/20 border-t-[#d5a22d] mx-auto mb-8 flex items-center justify-center"
                >
                    <Sparkles className="w-10 h-10 text-[#d5a22d]" />
                </motion.div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Finding Your Matches</h2>
                <p className="text-white/40 text-lg">Analysing Malawian universities for your profile...</p>
            </div>
        );
    }

    if (showSummary) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg mx-auto space-y-8 p-8 sm:p-12 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 text-center shadow-2xl"
            >
                <div className="w-20 h-20 bg-[#d5a22d] rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-[#d5a22d]/20 rotate-3">
                    <CheckCircle2 className="w-10 h-10 text-[#1a1b41]" />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Path Discovered!</h2>
                    <p className="text-white/60 text-lg leading-relaxed">
                        We&apos;ve found several universities and programs that match your goals. Create your account to see your personalized recommendations.
                    </p>
                </div>
                <Button
                    onClick={() => onComplete(answers)}
                    className="w-full h-16 rounded-[1.25rem] bg-[#d5a22d] hover:bg-white text-[#1a1b41] font-black text-lg uppercase tracking-[0.2em] shadow-xl shadow-[#d5a22d]/20 transition-all active:scale-95"
                >
                    See My Matches <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-10">
            {/* Minimal Progress Bar */}
            <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="absolute inset-y-0 left-0 bg-[#d5a22d] rounded-full shadow-[0_0_15px_rgba(213,162,45,0.5)]"
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <div className="text-center">
                        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
                            {currentQuestion.title}
                        </h2>
                        {currentQuestion.description && (
                            <p className="text-white/40 text-lg">
                                {currentQuestion.description}
                            </p>
                        )}
                    </div>

                    <div className="min-h-[300px]">
                        {currentQuestion.type === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`group relative p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 text-center ${
                                            answers[currentQuestion.key] === option.value
                                            ? 'bg-[#d5a22d] border-[#d5a22d] shadow-lg shadow-[#d5a22d]/20'
                                            : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-4xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                                            {ICON_MAP[option.value] || option.icon || ICON_MAP.default}
                                        </span>
                                        <span className={`text-[11px] font-black uppercase tracking-widest leading-tight ${
                                            answers[currentQuestion.key] === option.value ? 'text-[#1a1b41]' : 'text-white/60'
                                        }`}>
                                            {option.label}
                                        </span>
                                        {answers[currentQuestion.key] === option.value && (
                                            <motion.div layoutId="active-ring" className="absolute inset-0 border-2 border-white/20 rounded-[2rem]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : currentQuestion.type === 'searchable-select' || currentQuestion.type === 'select' ? (
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full h-16 px-6 text-left bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-between hover:bg-white/10 transition-all"
                                    >
                                        <span className={answers[currentQuestion.key] ? 'text-white' : 'text-white/30'}>
                                            {options.find(o => o.value === answers[currentQuestion.key])?.label || currentQuestion.placeholder || 'Select an option...'}
                                        </span>
                                        <ChevronRight className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute z-50 w-full mt-2 p-2 bg-[#1a1b41] border border-white/10 rounded-2xl shadow-2xl max-h-64 overflow-y-auto"
                                            >
                                                {options.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => { handleSelect(option.value); setIsDropdownOpen(false); }}
                                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                                            answers[currentQuestion.key] === option.value 
                                                            ? 'bg-[#d5a22d] text-[#1a1b41]' 
                                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={answers[currentQuestion.key] || ''}
                                    onChange={e => handleSelect(e.target.value)}
                                    placeholder={currentQuestion.placeholder || 'Type your answer...'}
                                    className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder:text-white/20 focus:outline-none focus:border-[#d5a22d] transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-6">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="h-14 px-8 rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 disabled:opacity-0 transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <Button
                            onClick={handleNext}
                            disabled={!canContinue}
                            className="h-14 flex-1 rounded-2xl bg-[#d5a22d] hover:bg-white text-[#1a1b41] font-black uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#d5a22d]/10"
                        >
                            {isLastStep ? 'Discover My Path' : 'Continue'} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="text-center">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                    Step {currentStep + 1} of {questions.length}
                </p>
            </div>
        </div>
    );
}
