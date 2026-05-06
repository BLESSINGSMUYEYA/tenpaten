'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RegisterForm from '@/components/register-form';
import StudentQuestionnaire from '@/components/auth/StudentQuestionnaire';
import type { QuestionData } from '@/components/auth/StudentQuestionnaire';
import { RoleGateway, RoleType } from '@/components/auth/RoleGateway';
import { motion } from 'framer-motion';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

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
            <div className="min-h-screen bg-white flex flex-col selection:bg-[#d5a22d]/20">
                {/* Minimal top bar */}
                <header className="flex items-center px-6 sm:px-12 py-6 border-b border-gray-100">
                    <TenpatenLogo variant="navy" />
                </header>

                <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
                    <div className="w-full max-w-2xl">
                        <div className="mb-10 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: -12 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#d5a22d]/25 bg-[#d5a22d]/8 mb-6"
                            >
                                <span className="w-2 h-2 rounded-full bg-[#d5a22d] animate-pulse" />
                                <span className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.35em]">
                                    Future Path Discovery
                                </span>
                            </motion.div>
                            <h1 className="text-4xl sm:text-5xl font-black text-[#1a1b41] leading-tight tracking-tight uppercase mb-4">
                                Let&apos;s get to <span className="text-[#d5a22d]">know you</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-medium max-w-md mx-auto">
                                Answer a few questions to help us personalise your university journey in Malawi.
                            </p>
                        </div>
                        <StudentQuestionnaire questions={questions} onComplete={handleQuestionnaireComplete} />
                    </div>
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
