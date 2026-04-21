'use client';

import { useState } from 'react';
import SchoolRegisterForm from '@/components/auth/SchoolRegisterForm';
import { AuthCard } from '@/components/auth/AuthCard';
import SchoolQuestionnaire, { QuestionData } from '@/components/auth/SchoolQuestionnaire';

interface SchoolRegisterPageClientProps {
    questions: QuestionData[];
}

const universityDecorations = [
    { id: 1, src: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=300", class: "top-[12%] -left-32", animation: "animate-[bounce_4s_infinite] delay-100" },
    { id: 2, src: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=300", class: "top-[5%] -right-24", animation: "animate-[bounce_5s_infinite] delay-300" },
    { id: 3, src: "https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80&w=300", class: "bottom-[20%] -left-40", animation: "animate-[pulse_6s_infinite] delay-500" },
    { id: 4, src: "https://images.unsplash.com/photo-1525921429573-06dc73810080?auto=format&fit=crop&q=80&w=300", class: "bottom-[5%] -right-28", animation: "animate-[bounce_4.5s_infinite] delay-700" },
    { id: 5, src: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300", class: "top-[45%] -right-48", animation: "animate-[pulse_7s_infinite]" },
];

export default function SchoolRegisterPageClient({ questions }: SchoolRegisterPageClientProps) {
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);

    const handleQuestionnaireComplete = (data: Record<string, string>) => {
        console.log('School Questionnaire Data:', data);
        setQuestionnaireComplete(true);
    };

    if (!questionnaireComplete) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <SchoolQuestionnaire questions={questions} onComplete={handleQuestionnaireComplete} />
                </div>
            </div>
        );
    }

    return (
        <AuthCard
            title="Register Your Institution"
            description="Create an account to get started"
            footerText="Already a partner?"
            footerLinkText="Log in"
            footerLinkHref="/school/login"
            decorations={universityDecorations}
        >
            <SchoolRegisterForm />
        </AuthCard>
    );
}
