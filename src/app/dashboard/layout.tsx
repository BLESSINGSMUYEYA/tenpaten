import { signOut, auth } from '@/auth';
import Link from 'next/link';
import { LogOut, Users, Settings } from 'lucide-react';

import StudentSidebar from '@/components/dashboard/nav/StudentSidebar';
import SchoolSidebar from '@/components/dashboard/nav/SchoolSidebar';
import SuperAgentSidebar from '@/components/dashboard/nav/SuperAgentSidebar';
import CountryDirectorSidebar from '@/components/dashboard/nav/CountryDirectorSidebar';
import AffiliateSidebar from '@/components/dashboard/nav/AffiliateSidebar';
import AdminSidebar from '@/components/dashboard/nav/AdminSidebar';
import { getActiveSchoolId } from '@/lib/getActiveSchool';

import DashboardNav from '@/components/dashboard/nav/DashboardNav';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import DynamicBreadcrumbs from '@/components/dashboard/DynamicBreadcrumbs';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';
import { getHomeUrl } from '@/lib/navigation';
import { ChatbotProvider } from '@/components/chatbot/ChatbotContext';
import HelpChatbot from '@/components/chatbot/HelpChatbot';
import prisma from '@/lib/prisma';
import { PerformanceProvider } from '@/components/providers/PerformanceProvider';

export const dynamic = 'force-dynamic';

const getEnrollmentStatus = unstable_cache(
    async (userId: string) => {
        try {
            const application = await prisma.application.findFirst({
                where: { prospectId: userId, status: 'ENROLLED' },
            });
            return !!application;
        } catch (error) {
            console.error('Failed to check enrollment status:', error);
            return false;
        }
    },
    ['user-enrollment-status'],
    { revalidate: 3600, tags: ['enrollment'] }
);

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const role = session?.user?.role;

    let isEnrolled = false;
    const hasAffiliateAccess = !!(session?.user?.affiliateApproved) && role !== 'AFFILIATE';

    if (role === 'PROSPECT' && session?.user?.id) {
        isEnrolled = await getEnrollmentStatus(session.user.id);
    }

    let assignedSchools: any[] = [];
    let activeSchoolId: string | null = null;

    if (role === 'SCHOOL_SUPER_AGENT' && session?.user?.id) {
        const assignments = await prisma.schoolSuperAgentUniversity.findMany({
            where: { userId: session.user.id },
            include: {
                university: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        assignedSchools = assignments.map((a) => a.university);
        activeSchoolId = await getActiveSchoolId();
    }

    return (
        <PerformanceProvider>
            <ChatbotProvider>
                <div className="flex h-screen overflow-hidden bg-background">
                    {/* Sidebar — Midnight Navy brand color, hidden on mobile */}
                    <div className="hidden lg:flex lg:w-72 flex-none flex-col bg-[#1d1b41] border-r border-white/5 shadow-2xl">
                        {/* Logo/Brand */}
                        <Link
                            className="flex items-center px-6 h-14 border-b border-white/10 border-t-2 border-t-transparent hover:bg-white/5 transition-colors"
                            href={getHomeUrl(role)}
                        >
                            <TenpatenLogo variant="white" className="text-white" disableLink />
                            {/* Gold accent dot on logo */}
                            <span className="ml-auto w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        </Link>

                        {/* Navigation Links */}
                        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                            {role === 'PROSPECT' && <StudentSidebar isEnrolled={isEnrolled} hasAffiliateAccess={hasAffiliateAccess} />}
                            {role === 'SCHOOL_ADMIN' && <SchoolSidebar />}
                            {role === 'SCHOOL_SUPER_AGENT' && <SuperAgentSidebar assignedSchools={assignedSchools} activeSchoolId={activeSchoolId} />}
                            {role === 'COUNTRY_DIRECTOR' && <CountryDirectorSidebar />}
                            {role === 'AFFILIATE' && <AffiliateSidebar />}
                            {role === 'SUPER_ADMIN' && <AdminSidebar />}
                        </nav>

                        {/* Bottom Section — Settings + Sign Out */}
                        <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
                            <Link
                                href={
                                    role === 'PROSPECT' ? '/dashboard/student-settings' :
                                        role === 'SCHOOL_ADMIN' ? '/dashboard/school/settings' :
                                            role === 'SCHOOL_SUPER_AGENT' ? '/dashboard/school/settings' :
                                                '/dashboard/student-settings'
                                }
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center">
                                    <Settings className="w-4 h-4 text-white/60 group-hover:text-white group-hover:rotate-90 transition-transform duration-300" />
                                </div>
                                <span className="font-semibold text-sm">Settings</span>
                            </Link>
                            <form
                                action={async () => {
                                    'use server';
                                    await signOut({ redirectTo: '/' });
                                }}
                            >
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:bg-red-500/10 hover:text-red-400 border-l-2 border-transparent transition-all group">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center">
                                        <LogOut className="w-4 h-4 text-white/60 group-hover:text-red-400 group-hover:-translate-x-0.5 transition-transform" />
                                    </div>
                                    <span className="font-semibold text-sm">Sign Out</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="grow flex flex-col min-w-0 overflow-hidden">
                        {/* Top header — White with bottom border for clear separation from navy sidebar */}
                        <DashboardNav user={session?.user} isEnrolled={isEnrolled} hasAffiliateAccess={hasAffiliateAccess} />
                        <DynamicBreadcrumbs />
                        <div className="flex-1 bg-background p-3 sm:p-4 lg:p-5 overflow-y-auto custom-scrollbar">
                            <Suspense fallback={null}>
                                <WelcomeBanner />
                            </Suspense>
                            {children}
                        </div>
                    </div>

                    <HelpChatbot />
                </div>
            </ChatbotProvider>
        </PerformanceProvider>
    );
}
