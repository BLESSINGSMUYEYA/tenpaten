'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RegisterForm from '@/components/register-form';
import StudentQuestionnaire from '@/components/auth/StudentQuestionnaire';
import type { QuestionData } from '@/components/auth/StudentQuestionnaire';
import { RoleGateway, RoleType } from '@/components/auth/RoleGateway';
import { motion } from 'framer-motion';

function RegisterContent({ questions, countries }: { questions: QuestionData[], countries: any[] }) {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const callbackUrl = searchParams.get('callbackUrl') || '';
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);

    // Default to student role to show the form directly, removing the choice step
    const [selectedRole, setSelectedRole] = useState<RoleType>('student');

    const showQuestionnaire = selectedRole === 'student' && !questionnaireComplete;

    const handleQuestionnaireComplete = (data: Record<string, string>) => {
        console.log('Questionnaire Data:', data);
        setQuestionnaireComplete(true);
    };

    // Questionnaire step (before the registration form)
    if (showQuestionnaire) {
        return (
            <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden selection:bg-[#d5a22d]/30">
                {/* Gradient mesh background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#0f1030]" />
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1a1b41] opacity-80 blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#2a1a60] opacity-60 blur-[120px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#d5a22d] opacity-[0.04] blur-[80px]" />
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '48px 48px' }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-12">
                    <div className="mb-12 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#d5a22d]/30 bg-[#d5a22d]/10 mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
                            <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">
                                Future Path Discovery
                            </span>
                        </motion.div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight uppercase mb-4">
                            Let&apos;s get to <span className="text-[#d5a22d]">know you</span>
                        </h1>
                        <p className="text-white/50 text-lg font-medium max-w-md mx-auto">
                            Answer a few questions to help us personalise your university journey in Malawi.
                        </p>
                    </div>
                    <StudentQuestionnaire questions={questions} onComplete={handleQuestionnaireComplete} />
                </div>
            </div>
        );
    }

    // Registration form (after questionnaire, or if type isn't student)
    return (
        <RoleGateway
            mode="register"
            selectedRole={questionnaireComplete ? 'student' : selectedRole}
            onSelectRole={(role) => {
                setSelectedRole(role);
            }}
        >
            <RegisterForm countries={countries} callbackUrl={callbackUrl} />
        </RoleGateway>
    );
}

export default function RegisterPageClient({ questions, countries }: { questions: QuestionData[], countries: any[] }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#1a1b4d] to-[#12132e]" />}>
            <RegisterContent questions={questions} countries={countries} />
        </Suspense>
    );
}
