'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Image map: question key → Unsplash image URL ───────────────────────────
const QUESTION_IMAGE_MAP: Record<string, string> = {
    career_goal:     'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=700&q=80',
    field_of_study:  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=700&q=80',
    study_level:     'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=700&q=80',
    country:         'https://images.unsplash.com/photo-1589824547857-82bca25ef3a4?auto=format&fit=crop&w=700&q=80',
    location:        'https://images.unsplash.com/photo-1589824547857-82bca25ef3a4?auto=format&fit=crop&w=700&q=80',
    budget:          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80',
    funding:         'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=700&q=80',
    timeline:        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=700&q=80',
    default:         'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=700&q=80',
};

function getQuestionImage(key: string): string {
    return QUESTION_IMAGE_MAP[key] ?? QUESTION_IMAGE_MAP.default;
}

// ─── Icon map for grid-type options ─────────────────────────────────────────
const ICON_MAP: Record<string, string> = {
    medicine:    '🩺',
    engineering: '🏗️',
    tech:        '💻',
    business:    '💼',
    arts:        '🎨',
    law:         '⚖️',
    science:     '🧪',
    default:     '📚',
};

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Introduction Screen ─────────────────────────────────────────────────────
function IntroScreen({ onStart }: { onStart: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
            {/* Hero image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=700&q=80"
                    alt="Students in a classroom"
                    className="w-full h-full object-cover object-center"
                />
                {/* subtle bottom fade only — keeps image clearly visible */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white to-transparent" />
            </div>

            {/* Content */}
            <div className="px-6 pb-6 -mt-2 text-center space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 bg-brand-accent/10 text-brand-accent text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" /> Discovery Quiz
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-[#1a1b41] tracking-tight leading-tight">
                        Let's Find Your Path
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                        Answer a few quick questions so we can match you with the right programmes and universities in Malawi.
                    </p>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-6 py-2">
                    {[
                        { value: '2 min', label: 'Takes about' },
                        { value: '100%', label: 'Free forever' },
                        { value: 'Personalised', label: 'Results' },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-sm font-black text-[#1a1b41]">{s.value}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onStart}
                    className="w-full h-11 rounded-xl bg-brand-accent hover:bg-[#b89531] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentQuestionnaire({ questions, onComplete }: StudentQuestionnaireProps) {
    const [phase, setPhase] = useState<'intro' | 'questions' | 'matching' | 'summary'>('intro');
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
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

    // Reset dropdown when step changes
    useEffect(() => { setIsDropdownOpen(false); }, [currentStep]);

    // ── Empty state ──
    if (!questions || questions.length === 0) {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center space-y-4">
                <p className="text-gray-400 text-sm">No discovery path configured yet.</p>
                <button
                    onClick={() => onComplete({})}
                    className="w-full h-11 rounded-xl bg-brand-accent text-white font-bold text-sm"
                >
                    Continue to Register
                </button>
            </div>
        );
    }

    // ── Derived state ──
    const currentQuestion = questions[currentStep];
    const options = (currentQuestion?.options as QuestionOption[] | null) ?? [];
    const isLastStep = currentStep === questions.length - 1;
    const canContinue = !!answers[currentQuestion?.key];
    const progress = ((currentStep + 1) / questions.length) * 100;
    const questionImage = getQuestionImage(currentQuestion?.key ?? 'default');

    // ── Handlers ──
    const handleStart = () => setPhase('questions');

    const handleNext = () => {
        if (!isLastStep) {
            setCurrentStep(prev => prev + 1);
        } else {
            setPhase('matching');
            setTimeout(() => setPhase('summary'), 2000);
        }
    };

    const handleBack = () => {
        if (phase === 'summary') {
            setPhase('questions');
        } else if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            setPhase('intro');
        }
    };

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.key]: value }));
    };

    // ─── INTRO ────────────────────────────────────────────────────────────────
    if (phase === 'intro') {
        return (
            <AnimatePresence mode="wait">
                <IntroScreen key="intro" onStart={handleStart} />
            </AnimatePresence>
        );
    }

    // ─── MATCHING ─────────────────────────────────────────────────────────────
    if (phase === 'matching') {
        return (
            <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                    className="w-14 h-14 rounded-full border-4 border-brand-accent/20 border-t-brand-accent mx-auto flex items-center justify-center"
                >
                    <Sparkles className="w-6 h-6 text-brand-accent" />
                </motion.div>
                <div>
                    <h2 className="text-lg font-black text-[#1a1b41] uppercase tracking-tight">Finding Your Matches</h2>
                    <p className="text-sm text-gray-400 mt-1">Analysing Malawian universities for your profile…</p>
                </div>
            </div>
        );
    }

    // ─── SUMMARY ──────────────────────────────────────────────────────────────
    if (phase === 'summary') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-5"
            >
                <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-accent/30 rotate-6">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                </div>

                <div className="space-y-1.5">
                    <h2 className="text-2xl font-black text-[#1a1b41] uppercase tracking-tight">
                        Path Discovered!
                    </h2>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
                        We've analysed Malawian universities and found programmes that match your goals.
                    </p>
                </div>

                {/* Answer recap */}
                <div className="space-y-2 text-left">
                    {questions.map((q) => {
                        const opts = (q.options as QuestionOption[] | null) ?? [];
                        const ans = answers[q.key];
                        const label = opts.find(o => o.value === ans)?.label ?? ans ?? '—';
                        return (
                            <div key={q.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{q.title}</p>
                                    <p className="text-sm font-bold text-[#1a1b41] truncate">{label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={() => onComplete(answers)}
                    className="w-full h-11 rounded-xl bg-brand-accent hover:bg-[#b89531] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-brand-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    See My Matches <ArrowRight className="w-4 h-4" />
                </button>

                <button
                    onClick={handleBack}
                    className="w-full h-9 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ← Edit my answers
                </button>
            </motion.div>
        );
    }

    // ─── QUESTIONS ────────────────────────────────────────────────────────────
    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Contextual image header */}
            <div className="relative h-28 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentStep}
                        src={questionImage}
                        alt=""
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-cover absolute inset-0"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-white" />
            </div>

            <div className="px-5 pb-5 space-y-4">

                {/* Progress bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>Step {currentStep + 1} of {questions.length}</span>
                        <span className="text-brand-accent">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                            className="h-full bg-linear-to-r from-[#1a1b41] to-brand-accent rounded-full"
                        />
                    </div>
                </div>

                {/* Question */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-bold text-[#1a1b41] leading-snug">
                                {currentQuestion.title}
                            </h2>
                            {currentQuestion.description && (
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {currentQuestion.description}
                                </p>
                            )}
                        </div>

                        {/* ── GRID type ── */}
                        {currentQuestion.type === 'grid' && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {options.map((option) => {
                                    const selected = answers[currentQuestion.key] === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSelect(option.value)}
                                            className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                                                selected
                                                    ? 'bg-brand-accent border-brand-accent shadow-md shadow-brand-accent/25'
                                                    : 'bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="text-2xl">
                                                {ICON_MAP[option.value] || option.icon || ICON_MAP.default}
                                            </span>
                                            <span className={`text-[11px] font-bold leading-tight ${
                                                selected ? 'text-white' : 'text-gray-500'
                                            }`}>
                                                {option.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* ── SELECT / SEARCHABLE-SELECT type ── */}
                        {(currentQuestion.type === 'select' || currentQuestion.type === 'searchable-select') && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full h-11 px-4 text-left bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold flex items-center justify-between hover:bg-gray-100 transition-all"
                                >
                                    <span className={answers[currentQuestion.key] ? 'text-[#1a1b41]' : 'text-gray-400'}>
                                        {options.find(o => o.value === answers[currentQuestion.key])?.label
                                            || currentQuestion.placeholder
                                            || 'Select an option…'}
                                    </span>
                                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            className="absolute z-50 w-full mt-2 p-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-52 overflow-y-auto"
                                        >
                                            {options.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => { handleSelect(option.value); setIsDropdownOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                                        answers[currentQuestion.key] === option.value
                                                            ? 'bg-brand-accent text-white'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#1a1b41]'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* ── TEXT type ── */}
                        {currentQuestion.type === 'text' && (
                            <input
                                type="text"
                                value={answers[currentQuestion.key] || ''}
                                onChange={e => handleSelect(e.target.value)}
                                placeholder={currentQuestion.placeholder || 'Type your answer…'}
                                className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-semibold text-[#1a1b41] placeholder:text-gray-300 focus:outline-none focus:border-brand-accent transition-all"
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex gap-3 pt-1 border-t border-gray-100">
                    <button
                        onClick={handleBack}
                        className="h-10 px-4 rounded-xl border border-gray-100 text-gray-400 font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-1.5 disabled:opacity-0"
                        disabled={currentStep === 0 && phase === 'questions'}
                    >
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canContinue}
                        className="flex-1 h-10 rounded-xl bg-brand-accent hover:bg-[#b89531] text-white font-bold text-sm uppercase tracking-wide transition-all active:scale-[0.98] disabled:opacity-40 shadow-md shadow-brand-accent/20 flex items-center justify-center gap-2"
                    >
                        {isLastStep ? 'Discover My Path' : 'Continue'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
