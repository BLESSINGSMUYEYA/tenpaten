import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect('/login');
    }

    return (
        <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-10rem)] w-full max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
            {children}
        </div>
    );
}
