import { auth } from '@/auth';
import Link from 'next/link';
import { Sparkles, Users, HandCoins, ArrowRight, Building2, MessageCircle, FileText, Bell, AlertCircle, TrendingUp } from 'lucide-react';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { getStudentApplications } from '@/lib/data';
import { getProfileCompletion } from '@/lib/data';
import ApplicationCard from '@/components/student/ApplicationCard';

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

    // Fetch data
    const applications = await getStudentApplications();
    const profileData = await getProfileCompletion();

    // Sort applications by updatedAt desc
    const sortedApps = [...applications].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const mostRecentApp = sortedApps[0];

    // Check if any app needs action
    const actionRequiredApp = sortedApps.find(app => ['DRAFT', 'PAYMENT_PENDING', 'OFFER_ISSUED'].includes(app.status));

    return (
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-24 px-4 sm:px-6 lg:px-8">
            
            {/* 1. Hero Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1d1b41] via-[#221f4c] to-[#1d1b41] p-8 lg:p-12 shadow-2xl border border-white/5">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#d5a22d 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d5a22d]/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-6 lg:mb-8">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 backdrop-blur-sm">
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.25em]">{greeting}</p>
                                </div>
                                <h2 className="text-white text-4xl lg:text-5xl font-black tracking-tight mb-3">
                                    {user?.fullName?.split(' ')[0] || 'Student'}<span className="text-[#d5a22d]">.</span>
                                </h2>
                                <h1 className="text-xl lg:text-2xl font-medium text-white/60 leading-relaxed max-w-lg">
                                    Where will you study today?
                                </h1>
                            </div>
                            
                            {/* Mobile profile badge */}
                            <div className="flex lg:hidden flex-col items-end gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Profile</span>
                                <div className="bg-white/5 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                                        <div className="h-full bg-gradient-to-r from-[#b89531] to-[#d5a22d] rounded-full" style={{ width: `${profileData.completionPercentage}%` }} />
                                    </div>
                                    <span className="text-base font-black text-white">{profileData.completionPercentage}<span className="text-[#d5a22d] text-xs">%</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop profile badge */}
                    <div className="hidden lg:flex">
                        <div className="bg-white/5 backdrop-blur-md p-7 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500 min-w-[280px]">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#d5a22d]/20 rounded-full blur-[50px] transition-transform duration-700 group-hover:scale-150 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-end justify-between gap-8 mb-2">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Profile Strength</span>
                                    <span className="text-4xl font-black text-white leading-none">{profileData.completionPercentage}<span className="text-[#d5a22d] text-2xl">%</span></span>
                                </div>
                                <div className="w-full h-2.5 bg-[#0a0a1a] rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[#b89531] via-[#d5a22d] to-[#fde08b] rounded-full relative"
                                        style={{ width: `${profileData.completionPercentage}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                                    </div>
                                </div>
                                {profileData.completionPercentage < 100 && (
                                    <Link href="/dashboard/student-settings" className="text-[10px] font-bold text-white/40 hover:text-[#d5a22d] transition-colors mt-2 uppercase tracking-wider flex items-center justify-end gap-1">
                                        Complete Profile <ArrowRight className="w-3 h-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Action Required Alert */}
            {actionRequiredApp && (
                <Link 
                    href={actionRequiredApp.status === 'DRAFT' 
                        ? `/dashboard/apply?programId=${actionRequiredApp.programId}&draftId=${actionRequiredApp.id}` 
                        : `/dashboard/applications/${actionRequiredApp.id}`
                    }
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 lg:p-5 border border-gray-100 shadow-sm border-l-4 border-l-[#d5a22d] hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#d5a22d]/10 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-[#d5a22d]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm lg:text-base font-black text-[#1d1b41] truncate">Action Required</h4>
                        <p className="text-[11px] lg:text-xs text-slate-500 font-medium truncate">
                            Your application to {actionRequiredApp.program.university.name} needs attention.
                        </p>
                    </div>
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" />
                </Link>
            )}

            {/* 4. Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-4 gap-3 lg:gap-6">
                    <Link href="/dashboard/colleges" className="flex flex-col items-center gap-2 lg:gap-4 p-3 lg:p-6 rounded-2xl lg:rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:border-[#d5a22d]/30 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#1d1b41]/5 flex items-center justify-center group-hover:bg-[#d5a22d]/10 transition-colors">
                            <Building2 className="w-5 h-5 lg:w-7 lg:h-7 text-[#1d1b41] group-hover:text-[#d5a22d]" />
                        </div>
                        <span className="text-[9px] lg:text-[11px] font-black text-[#1d1b41] uppercase tracking-widest text-center">Browse</span>
                    </Link>
                    <Link href="/dashboard/apply" className="flex flex-col items-center gap-2 lg:gap-4 p-3 lg:p-6 rounded-2xl lg:rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:border-[#d5a22d]/30 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#1d1b41]/5 flex items-center justify-center group-hover:bg-[#d5a22d]/10 transition-colors">
                            <Sparkles className="w-5 h-5 lg:w-7 lg:h-7 text-[#1d1b41] group-hover:text-[#d5a22d]" />
                        </div>
                        <span className="text-[9px] lg:text-[11px] font-black text-[#1d1b41] uppercase tracking-widest text-center">Apply</span>
                    </Link>
                    <Link href="/dashboard/applications" className="flex flex-col items-center gap-2 lg:gap-4 p-3 lg:p-6 rounded-2xl lg:rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:border-[#d5a22d]/30 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#1d1b41]/5 flex items-center justify-center group-hover:bg-[#d5a22d]/10 transition-colors">
                            <FileText className="w-5 h-5 lg:w-7 lg:h-7 text-[#1d1b41] group-hover:text-[#d5a22d]" />
                        </div>
                        <span className="text-[9px] lg:text-[11px] font-black text-[#1d1b41] uppercase tracking-widest text-center">Track</span>
                    </Link>
                    <Link href="/dashboard/messages" className="flex flex-col items-center gap-2 lg:gap-4 p-3 lg:p-6 rounded-2xl lg:rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:border-[#d5a22d]/30 hover:shadow-lg transition-all active:scale-95 group">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#1d1b41]/5 flex items-center justify-center group-hover:bg-[#d5a22d]/10 transition-colors">
                            <MessageCircle className="w-5 h-5 lg:w-7 lg:h-7 text-[#1d1b41] group-hover:text-[#d5a22d]" />
                        </div>
                        <span className="text-[9px] lg:text-[11px] font-black text-[#1d1b41] uppercase tracking-widest text-center">Chat</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Main Content Column (Left on Desktop) */}
                <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                    {/* 3. Most Recent Application / Current Journey */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current Journey</h3>
                        </div>
                        {mostRecentApp ? (
                            <ApplicationCard application={mostRecentApp} showProgress={true} />
                        ) : (
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 text-center shadow-sm">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6">
                                    <TrendingUp className="w-8 h-8 lg:w-10 lg:h-10 text-gray-300" />
                                </div>
                                <h4 className="text-base lg:text-xl font-black text-[#1d1b41] mb-2">No Applications Yet</h4>
                                <p className="text-xs lg:text-sm text-slate-500 font-medium mb-6 lg:mb-8">Start your educational journey by browsing universities.</p>
                                <Link href="/dashboard/colleges" className="inline-flex items-center justify-center gap-2 w-full lg:w-auto px-8 py-3.5 rounded-xl lg:rounded-2xl bg-[#1d1b41] text-white text-[10px] lg:text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#2a284a] transition-all">
                                    Browse Universities
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 6. Recent Applications List */}
                    {sortedApps.length > 1 && (
                        <div>
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h3 className="text-[10px] lg:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recent Applications</h3>
                                <Link href="/dashboard/applications" className="text-[10px] lg:text-xs font-black text-[#d5a22d] uppercase tracking-[0.2em] hover:text-[#b89531] transition-colors flex items-center gap-1">
                                    View All <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                                </Link>
                            </div>
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                {sortedApps.slice(1, 4).map((app, index) => (
                                    <Link 
                                        key={app.id} 
                                        href={app.status === 'DRAFT' ? `/dashboard/apply?programId=${app.programId}&draftId=${app.id}` : `/dashboard/applications/${app.id}`}
                                        className={`flex items-center gap-4 p-4 lg:p-5 hover:bg-gray-50 transition-colors ${index !== 0 ? 'border-t border-gray-50' : ''}`}
                                    >
                                        <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full ${app.status === 'REJECTED' ? 'bg-red-500' : app.status === 'ENROLLED' ? 'bg-[#d5a22d]' : ['OFFER_ISSUED', 'OFFER_ACCEPTED'].includes(app.status) ? 'bg-emerald-500' : 'bg-[#1d1b41]'}`} />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs lg:text-sm font-black text-[#1d1b41] truncate">{app.program.name}</h4>
                                            <p className="text-[10px] lg:text-xs text-slate-500 font-bold truncate">{app.program.university.name}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(app.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-slate-300 ml-auto mt-0.5 lg:mt-1" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Column (Right on Desktop) */}
                <div className="lg:col-span-4 space-y-6 lg:space-y-8">
                    {/* 5. Promote Banner */}
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#d5a22d] to-[#b89531] p-6 lg:p-8 shadow-xl shadow-[#d5a22d]/20 flex flex-col items-start gap-4 group">
                        <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 lg:-mr-24 lg:-mt-24 transition-transform duration-700 group-hover:scale-150"></div>
                        
                        <div className="relative z-10 pr-4">
                            <h3 className="text-white font-black text-lg lg:text-xl leading-tight mb-1 lg:mb-2">Earn while you study</h3>
                            <p className="text-white/80 text-xs lg:text-sm font-medium">Get rewarded for inviting friends.</p>
                        </div>
                        
                        <Link 
                            href={affiliateStatus === 'APPROVED' ? "/dashboard/affiliate" : "/dashboard/apply-affiliate"}
                            className="relative z-10 inline-flex bg-[#1d1b41] text-white px-6 py-3.5 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest hover:bg-[#2a284a] shadow-lg active:scale-95 transition-all w-full justify-center"
                        >
                            Explore Program
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
