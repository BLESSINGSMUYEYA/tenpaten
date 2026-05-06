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
            <div className="w-full max-w-md mx-auto p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-center">
                <p className="text-gray-400 text-sm mb-6">No discovery path configured yet.</p>
                <Button onClick={() => onComplete({})} className="w-full h-14 rounded-2xl bg-[#d5a22d] text-white font-black uppercase tracking-widest">
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
                <h2 className="text-2xl font-black text-[#1a1b41] uppercase tracking-tight mb-4">Finding Your Matches</h2>
                <p className="text-gray-400 text-lg">Analysing Malawian universities for your profile...</p>
            </div>
        );
    }

    if (showSummary) {
        return (
            <div className="w-full max-w-2xl mx-auto min-h-[60vh] flex flex-col items-center justify-center py-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-10 text-center"
                >
                    <div className="w-24 h-24 bg-[#d5a22d] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-[#d5a22d]/30 rotate-6">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl sm:text-6xl font-black text-[#1a1b41] uppercase tracking-tight leading-tight">
                            Path Discovered!
                        </h2>
                        <p className="text-gray-500 text-lg sm:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                            We&apos;ve analyzed Malawian universities and found several programs that match your goals perfectly.
                        </p>
                    </div>
                    <Button
                        onClick={() => onComplete(answers)}
                        className="w-full sm:w-auto h-20 px-12 rounded-3xl bg-[#d5a22d] hover:bg-[#b89531] text-white font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-[#d5a22d]/30 transition-all active:scale-[0.98]"
                    >
                        See My Matches <ArrowRight className="w-8 h-8 ml-3" />
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto min-h-[60vh] flex flex-col justify-between py-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col justify-center space-y-12"
                >
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl sm:text-5xl font-black text-[#1a1b41] uppercase tracking-tight leading-tight">
                            {currentQuestion.title}
                        </h2>
                        {currentQuestion.description && (
                            <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                {currentQuestion.description}
                            </p>
                        )}
                    </div>

                    <div className="w-full">
                        {currentQuestion.type === 'grid' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`group relative p-6 sm:p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 text-center ${
                                            answers[currentQuestion.key] === option.value
                                            ? 'bg-[#d5a22d] border-[#d5a22d] shadow-xl shadow-[#d5a22d]/30'
                                            : 'bg-gray-50 border-gray-50 hover:border-gray-200 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-5xl mb-2 grayscale group-hover:grayscale-0 transition-all">
                                            {ICON_MAP[option.value] || option.icon || ICON_MAP.default}
                                        </span>
                                        <span className={`text-xs font-black uppercase tracking-widest leading-tight ${
                                            answers[currentQuestion.key] === option.value ? 'text-white' : 'text-gray-500'
                                        }`}>
                                            {option.label}
                                        </span>
                                        {answers[currentQuestion.key] === option.value && (
                                            <motion.div layoutId="active-ring" className="absolute inset-0 border-2 border-white/20 rounded-[2.5rem]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : currentQuestion.type === 'searchable-select' || currentQuestion.type === 'select' ? (
                            <div className="max-w-md mx-auto w-full space-y-4">
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full h-20 px-8 text-left bg-gray-50 border border-gray-100 rounded-3xl text-[#1a1b41] text-lg font-bold flex items-center justify-between hover:bg-gray-100 transition-all shadow-sm"
                                    >
                                        <span className={answers[currentQuestion.key] ? 'text-[#1a1b41]' : 'text-gray-300'}>
                                            {options.find(o => o.value === answers[currentQuestion.key])?.label || currentQuestion.placeholder || 'Select an option...'}
                                        </span>
                                        <ChevronRight className={`w-6 h-6 transition-transform text-gray-400 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute z-50 w-full mt-3 p-3 bg-white border border-gray-100 rounded-3xl shadow-2xl max-h-72 overflow-y-auto"
                                            >
                                                {options.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => { handleSelect(option.value); setIsDropdownOpen(false); }}
                                                        className={`w-full text-left px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                                                            answers[currentQuestion.key] === option.value 
                                                            ? 'bg-[#d5a22d] text-white' 
                                                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a1b41]'
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
                            <div className="max-w-md mx-auto w-full">
                                <input
                                    type="text"
                                    value={answers[currentQuestion.key] || ''}
                                    onChange={e => handleSelect(e.target.value)}
                                    placeholder={currentQuestion.placeholder || 'Type your answer...'}
                                    className="w-full h-20 px-8 bg-gray-50 border border-gray-100 rounded-3xl text-[#1a1b41] text-lg font-bold placeholder:text-gray-300 focus:outline-none focus:border-[#d5a22d] transition-all shadow-sm"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="w-full sm:w-auto h-16 px-10 rounded-2xl border border-gray-100 text-gray-400 font-black uppercase tracking-widest text-xs hover:bg-gray-50 disabled:opacity-0 transition-all flex items-center justify-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" /> Back
                        </button>
                        <Button
                            onClick={handleNext}
                            disabled={!canContinue}
                            className="h-16 flex-1 w-full rounded-2xl bg-[#d5a22d] hover:bg-[#b89531] text-white font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-[#d5a22d]/20"
                        >
                            {isLastStep ? 'Discover My Path' : 'Continue'} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Footer with Progress */}
            <div className="mt-12 space-y-6">
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="absolute inset-y-0 left-0 bg-[#d5a22d] rounded-full shadow-sm"
                    />
                </div>
                <div className="text-center">
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.5em]">
                        Step {currentStep + 1} of {questions.length}
                    </p>
                </div>
            </div>
        </div>
    );
}
