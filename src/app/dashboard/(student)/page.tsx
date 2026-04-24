import { auth } from '@/auth';
import Link from 'next/link';
import { Sparkles, Users, HandCoins, ArrowRight, Clock, Search, Building2, HelpCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';
import { StatsWrapper, ApplicationsWrapper } from '@/components/student/DashboardData';
import { StatsSkeleton, RecentApplicationsSkeleton } from '@/components/student/DashboardSkeleton';
import { ProfileCompletion, UpcomingDeadlines, SidebarSkeletons } from '@/components/student/DashboardSidebar';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export default async function Page() {
    const session = await auth();

    if (!session?.user) return null;

    const role = (session.user as any).role as Role;

    // Handle redirects for non-student roles
    if (role !== 'PROSPECT') {
        switch (role) {
            case 'AFFILIATE':
                redirect('/dashboard/affiliate');
            case 'COUNTRY_DIRECTOR':
                redirect('/dashboard/country-director');
            case 'SCHOOL_ADMIN':
                redirect('/dashboard/school');
            case 'SUPER_ADMIN':
                redirect('/dashboard/admin');
            default:
                break;
        }
    }

    // Role is PROSPECT (or undefined fallback) - Show the Student Dashboard
    let user = null;
    let affiliateStatus: string | null = null;
    
    if (session?.user?.email) {
        const getUserData = unstable_cache(
            async (email: string) => {
                try {
                    return await prisma.user.findUnique({
                        where: { email },
                        select: {
                            fullName: true,
                            affiliateProfile: { select: { status: true } }
                        }
                    });
                } catch (error) {
                    console.error('Dashboard user fetching error:', error);
                    return null;
                }
            },
            ['dashboard-user-data'],
            { revalidate: 3600, tags: ['user-data'] }
        );
        
        user = await getUserData(session.user.email);
        affiliateStatus = user?.affiliateProfile?.status ?? null;
    }

    // Greeting logic
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-12">
            
            {/* 1. Integrated Hero Greeting - Centered Hero Discovery Layout */}
            <div className="relative overflow-hidden group py-4">
                <div className="flex flex-col items-center text-center gap-10 px-4">


                    {/* Decorative Striped Banner - Centered & Wide */}
                    <div className="flex w-full max-w-5xl min-h-[140px] rounded-[2.5rem] overflow-hidden relative group border border-slate-100 shadow-2xl shadow-[#1d1b41]/5 transition-all hover:shadow-3xl hover:border-[#d5a22d]/30 bg-white">
                        {/* High-Clarity Background Image */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundImage: "url('/images/dashboard/banner_bg.png')" }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-0" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-8 h-full w-full">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#d5a22d] to-[#b89531] flex items-center justify-center shadow-xl shadow-[#d5a22d]/20 group-hover:rotate-6 transition-all duration-500">
                                    <Sparkles className="w-8 h-8 text-[#1d1b41]" />
                                </div>
                                <div className="text-left bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 shadow-xl shadow-black/5">
                                    <p className="text-xs font-black text-[#d5a22d] uppercase tracking-[0.3em] leading-none mb-2">{greeting}, {user?.fullName?.split(' ')[0] || 'Student'}</p>
                                    <h2 className="text-2xl sm:text-3xl font-black text-[#1d1b41] tracking-tight uppercase leading-none">Your Future <br /> Starts Here</h2>
                                </div>
                            </div>
                            
                            <div className="hidden lg:flex items-center gap-4 bg-white/40 backdrop-blur-md px-8 py-5 rounded-[2rem] border border-white/50 shadow-sm">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black text-[#1d1b41]/40 uppercase tracking-[0.2em]">
                                        <span>Portal Ready</span>
                                        <span className="text-[#d5a22d]">100%</span>
                                    </div>
                                    <div className="h-2 w-40 rounded-full bg-slate-100 overflow-hidden">
                                        <div className="h-full w-full bg-gradient-to-r from-[#1d1b41] to-[#d5a22d] rounded-full shadow-[0_0_10px_rgba(213,162,45,0.3)]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Forced Side-by-Side with Responsive Scaling */}
                    <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-lg mx-auto">
                        <Link
                            href="/dashboard/colleges"
                            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-[#36335e] text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:border-[#d5a22d] hover:text-[#d5a22d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                        >
                            <Building2 className="w-3.5 h-3.5 sm:w-4 h-4" />
                            Universities
                        </Link>
                        <Link
                            href="/dashboard/applications"
                            className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#36335e] text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] hover:bg-[#2a284a] transition-all shadow-xl shadow-[#36335e]/20 hover:shadow-2xl hover:shadow-[#36335e]/30 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                        >
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 h-4 text-[#d5a22d]" />
                            Apply Now
                        </Link>
                    </div>
                </div>
            </div>



            {/* 4. Main Command Center Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Content (Active Applications) */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-2">
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-[#36335e] tracking-tight">Active Applications</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live progress & updates</p>
                            </div>
                            <Link 
                                href="/dashboard/applications" 
                                className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.2em] hover:text-[#b89531] transition-colors flex items-center gap-1.5"
                            >
                                View All <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="grid gap-6">
                            <Suspense fallback={<RecentApplicationsSkeleton />}>
                                <ApplicationsWrapper />
                            </Suspense>
                        </div>
                    </div>

                    {/* Rewards Referral Section */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 p-8 group transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d5a22d]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <HandCoins className="w-8 h-8 text-[#d5a22d]" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-black text-[#36335e] tracking-tight">Affiliate Program</h3>
                                <p className="text-sm text-slate-500 font-medium mt-1">
                                    Invite friends to join Tenpaten and earn rewards for every successful enrollment.
                                </p>
                            </div>
                            <Link
                                href={affiliateStatus === 'APPROVED' ? "/dashboard/affiliate" : "/dashboard/apply-affiliate"}
                                className="px-8 py-3.5 rounded-xl bg-[#36335e] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2a284a] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#36335e]/10 whitespace-nowrap"
                            >
                                Start Earning
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Support & Profile) */}
                <div className="lg:col-span-4 space-y-8">
                    <Suspense fallback={<SidebarSkeletons />}>
                        <div className="space-y-8">
                            <ProfileCompletion />
                            <UpcomingDeadlines />
                        </div>
                    </Suspense>

                    {/* Modern Help Surface */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#36335e] p-8 text-white group shadow-2xl transition-all hover:scale-[1.02]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d5a22d]/20 rounded-full blur-3xl -mr-24 -mt-24 transition-opacity group-hover:opacity-100 opacity-60" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
                                    <HelpCircle className="w-6 h-6 text-[#d5a22d]" />
                                </div>
                                <div>
                                    <h4 className="text-base font-black tracking-tight leading-tight">Global Support</h4>
                                    <p className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.3em]">24/7 Assistance</p>
                                </div>
                            </div>
                            <p className="text-sm text-white/70 font-medium leading-relaxed mb-8">
                                Need more help? Get immediate assistance from our global support team or local country director.
                            </p>
                            <Link 
                                href="/dashboard/resources"
                                className="w-full inline-flex items-center justify-center py-4 rounded-xl bg-[#d5a22d] text-[#36335e] text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-[#d5a22d]/20 active:scale-95"
                            >
                                Help Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
