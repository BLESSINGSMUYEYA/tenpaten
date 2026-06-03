import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { getAllCountries } from '@/lib/data';
import StudentSettingsTabs from '@/components/settings/StudentSettingsTabs';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
                <p className="text-gray-600 mt-2">Please log in to access settings.</p>
            </div>
        );
    }

    let user;
    let countries;

    try {
        user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (user) {
            countries = await getAllCountries();
        }
    } catch (error) {
        console.error('Settings page error:', error);
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Error loading settings</h1>
                <p className="text-gray-600 mt-2">
                    There was an error loading your settings. Please try refreshing the page.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Error: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">User not found</h1>
                <p className="text-gray-600 mt-2">Email: {session.user.email}</p>
                <p className="text-sm text-gray-500 mt-4">
                    This might be a database sync issue. Try logging out and back in.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-brand-primary tracking-tight">
                    Profile <span className="text-brand-accent">Settings</span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage your account, personal information, and application documents.
                </p>
            </div>

            <StudentSettingsTabs user={user} countries={countries || []} />
        </div>
    );
}
