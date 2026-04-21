'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export type QuestionOption = { value: string; label: string };

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
    const [showSummary, setShowSummary] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
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

    // Reset search and dropdown when currentStep changes
    const [prevStep, setPrevStep] = useState(currentStep);
    if (currentStep !== prevStep) {
        setPrevStep(currentStep);
        setSearchQuery('');
        setIsDropdownOpen(false);
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-sm">No questions configured yet. Please contact support.</p>
                <Button onClick={() => onComplete({})} className="w-full rounded-xl bg-[#36335e] text-white">
                    Continue to Register
                </Button>
            </div>
        );
    }

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowSummary(true);
        }
    };

    const handleBack = () => {
        if (showSummary) setShowSummary(false);
        else if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [questions[currentStep].key]: value }));
    };

    const currentQuestion = questions[currentStep];
    const options = (currentQuestion?.options as QuestionOption[] | null) ?? [];
    const isLastStep = currentStep === questions.length - 1;
    const canContinue = !!answers[currentQuestion?.key];

    const totalSteps = questions.length + 1;
    const progress = showSummary ? 100 : ((currentStep + 1) / totalSteps) * 100;

    if (showSummary) {
        return (
            <div className="w-full max-w-md mx-auto space-y-6 p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="p-4 bg-[#36335e]/10 rounded-full inline-flex">
                    <Sparkles className="w-8 h-8 text-[#d5a22d]" />
                </div>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
                    <p className="text-sm text-gray-500">We've got everything we need. Create your account to start exploring universities and programs tailored for you.</p>
                </div>
                <Button
                    onClick={() => onComplete(answers)}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#36335e] to-[#2a284a] hover:bg-[#2a284a] text-white font-bold text-base shadow-lg shadow-[#36335e]/20 hover:shadow-xl transition-all"
                >
                    Create My Account <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        );
    }

    const filteredOptions = options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()));
    const selectedLabel = options.find(o => o.value === answers[currentQuestion.key])?.label;

    return (
        <div className="w-full max-w-md mx-auto space-y-6 sm:space-y-8 p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Image Decoration */}
            <div className="relative h-24 sm:h-32 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-6 sm:mb-8 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
                    alt="Students collaborating"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>Step {currentStep + 1} of {totalSteps}</span>
                    <span className="text-[#36335e]">{Math.round(progress)}% Completed</span>
                </div>
                <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-[#36335e] to-[#d5a22d] h-full rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="min-h-[220px] sm:min-h-[300px] flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-300" key={currentStep}>
                <h2 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-2">
                    {currentQuestion.title}
                </h2>
                {currentQuestion.description && (
                    <p className="text-center text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
                        {currentQuestion.description}
                    </p>
                )}

                <div className="space-y-4">
                    {currentQuestion.type === 'searchable-select' && (
                        <div ref={dropdownRef} className="relative">
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery || (answers[currentQuestion.key] ? selectedLabel || '' : '')}
                                onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
                                onFocus={() => { setSearchQuery(''); setIsDropdownOpen(true); }}
                                placeholder={currentQuestion.placeholder || 'Type to search...'}
                                className="w-full h-11 px-4 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#36335e]/20 focus:border-[#36335e] transition-all placeholder:text-gray-400"
                            />
                            {isDropdownOpen && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => { handleSelect(option.value); setSearchQuery(''); setIsDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#36335e]/10 transition-colors ${answers[currentQuestion.key] === option.value ? 'bg-[#36335e]/10 text-[#36335e] font-semibold' : 'text-gray-700'}`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                    {filteredOptions.length === 0 && (
                                        <div className="px-4 py-3 text-sm text-gray-400 text-center">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {currentQuestion.type === 'select' && (
                        <Select onValueChange={handleSelect} value={answers[currentQuestion.key]}>
                            <SelectTrigger className="w-full h-11 text-base">
                                <SelectValue placeholder={currentQuestion.placeholder || 'Select...'} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-sm sm:text-base py-2.5">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {currentQuestion.type === 'text' && (
                        <input
                            type="text"
                            value={answers[currentQuestion.key] || ''}
                            onChange={e => handleSelect(e.target.value)}
                            placeholder={currentQuestion.placeholder || 'Type your answer...'}
                            className="w-full h-11 px-4 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#36335e]/20 focus:border-[#36335e] transition-all"
                        />
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex-1 h-11 rounded-xl"
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!canContinue}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#36335e] to-[#2a284a] hover:bg-[#2a284a] text-white"
                >
                    {isLastStep ? (
                        <>Finish <CheckCircle2 className="w-4 h-4 ml-2" /></>
                    ) : (
                        <>Continue <ChevronRight className="w-4 h-4 ml-2" /></>
                    )}
                </Button>
            </div>
        </div>
    );
}
