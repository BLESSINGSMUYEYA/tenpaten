import CreateUserForm from '@/components/admin/create-user-form';
import { getAllCountries } from '@/lib/data/countries';
import Link from 'next/link';

export default async function Page() {
    const countries = await getAllCountries();

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Create New User</h1>
                <Link href="/dashboard/admin/users" className="text-sm text-blue-600 hover:underline">
                    &larr; Back to Users
                </Link>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
                <CreateUserForm countries={countries} />
            </div>
        </div>
    );
}
