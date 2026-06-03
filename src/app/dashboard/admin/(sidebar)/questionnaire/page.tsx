import prisma from '@/lib/prisma';
import { ClipboardList } from 'lucide-react';
import QuestionnaireManager from '@/components/admin/QuestionnaireManager';

export const metadata = { title: 'Questionnaire Management' };
export const dynamic = 'force-dynamic';

export default async function QuestionnairePage() {
    const questions = await prisma.questionnaireQuestion.findMany({
        orderBy: { order: 'asc' },
    });

    const activeCount = questions.filter(q => q.active).length;

    return (
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-brand-accent" />
                        </div>
                        <h1 className="text-2xl font-black text-brand-primary">Questionnaire</h1>
                    </div>
                    <p className="text-sm text-gray-500 pl-[52px]">
                        Manage the questions shown to users during registration.
                    </p>
                </div>
                <div className="flex items-center gap-4 pl-[52px] sm:pl-0">
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-primary">{activeCount}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="text-center">
                        <p className="text-2xl font-black text-brand-primary">{questions.length}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="w-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                <div>
                    <p className="text-sm font-black text-brand-primary mb-0.5">How this works</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        These questions appear during <strong>Student</strong> or <strong>University</strong> sign-up flows.
                        Use the tabs to switch between categories. Changes go live immediately.
                    </p>
                </div>
            </div>

            {/* Manager */}
            <QuestionnaireManager initialQuestions={questions as any} />
        </main>
    );
}
