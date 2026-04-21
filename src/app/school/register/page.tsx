import SchoolRegisterPageClient from '@/components/auth/SchoolRegisterPageClient';
import { getActiveQuestions } from '@/lib/actions/questionnaire';

export const dynamic = 'force-dynamic';

export default async function SchoolRegisterPage() {
    const questions = await getActiveQuestions('UNIVERSITY');
    return <SchoolRegisterPageClient questions={questions as any} />;
}
