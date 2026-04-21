import { getActiveQuestions } from '@/lib/actions/questionnaire';
import { getAllCountries } from '@/lib/data';
import RegisterPageClient from './RegisterPageClient';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
    const [questions, countries] = await Promise.all([
        getActiveQuestions('PROSPECT'),
        getAllCountries()
    ]);

    return <RegisterPageClient questions={questions as any} countries={countries as any} />;
}
