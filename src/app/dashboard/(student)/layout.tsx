import StudentLayoutClient from '@/components/dashboard/StudentLayoutClient';
import PageTransition from '@/components/dashboard/PageTransition';

export default function SidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageTransition>
            <main className="w-full space-y-6 sm:space-y-8">
                <StudentLayoutClient>
                    {children}
                </StudentLayoutClient>
            </main>
        </PageTransition>
    );
}
