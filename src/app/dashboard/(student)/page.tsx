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
                redirect('/dashboard/admin/users');
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
            
            {/* 1. Integrated Hero Greeting */}
            <div className="relative overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#36335e]/5 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-[#d5a22d]" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{greeting}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-[#36335e] tracking-tight">
                            Welcome back, <span className="text-[#d5a22d]">
                                {user?.fullName?.split(' ')[0] || 'Scholar'}
                            </span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium max-w-md">
                            Your global educational journey continue here. Track your progress and find new opportunities.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/colleges"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[#36335e] text-[10px] font-black uppercase tracking-widest hover:border-[#d5a22d] hover:text-[#d5a22d] transition-all shadow-sm"
                        >
                            <Building2 className="w-3.5 h-3.5" />
                            Universities
                        </Link>
                        <Link
                            href="/dashboard/applications"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#36335e] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#2a284a] transition-all shadow-md shadow-[#36335e]/10"
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Apply Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Global Search Bar - Clean & Prominent */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#36335e]/5 to-[#d5a22d]/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white border border-slate-100 rounded-[2rem] p-2 shadow-sm focus-within:shadow-xl focus-within:border-[#d5a22d]/30 transition-all duration-300">
                    <form action="/dashboard/colleges" method="GET" className="flex items-center">
                        <div className="flex-1 flex items-center px-4">
                            <Search className="w-5 h-5 text-slate-300 group-focus-within:text-[#d5a22d] transition-colors" />
                            <input
                                type="text"
                                name="query"
                                placeholder="Search for programs, universities or countries..."
                                className="w-full bg-transparent border-none outline-none py-4 px-4 text-[#36335e] font-bold text-sm sm:text-base placeholder:text-slate-300 placeholder:font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#36335e] text-[#d5a22d] px-8 py-4 rounded-[1.75rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2a284a] transition-all active:scale-95 shadow-lg"
                        >
                            Search
                        </button>
                    </form>
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
