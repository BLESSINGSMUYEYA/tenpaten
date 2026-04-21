'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RegisterForm from '@/components/register-form';
import StudentQuestionnaire from '@/components/auth/StudentQuestionnaire';
import type { QuestionData } from '@/components/auth/StudentQuestionnaire';
import { RoleGateway, RoleType } from '@/components/auth/RoleGateway';

function RegisterContent({ questions, countries }: { questions: QuestionData[], countries: any[] }) {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);

    // If ?type=student is in the URL, treat it as student directly selected
    const [selectedRole, setSelectedRole] = useState<RoleType>(
        type === 'student' ? 'student' : null
    );

    const showQuestionnaire = selectedRole === 'student' && !questionnaireComplete;

    const handleQuestionnaireComplete = (data: Record<string, string>) => {
        console.log('Questionnaire Data:', data);
        setQuestionnaireComplete(true);
    };

    // Questionnaire step (before the registration form)
    if (showQuestionnaire) {
        return (
            <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#1a1b4d] to-[#12132e] p-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#d5a22d]/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#36335e]/30 rounded-full blur-[120px]" />
                </div>
                <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-0">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-[#d5a22d] bg-clip-text text-transparent mb-2">
                            Let&apos;s get to know you
                        </h1>
                        <p className="text-white/50">
                            Answer a few questions to help us personalise your experience.
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
            <RegisterForm countries={countries} />
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
