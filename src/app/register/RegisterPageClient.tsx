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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#d5a22d]/20">
                <div className="w-full max-w-2xl">
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
