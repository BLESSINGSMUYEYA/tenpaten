import { getStudentApplications } from '@/lib/data';
import Link from 'next/link';

import ApplicationsList from '@/components/student/ApplicationsList';
import { Plus, TrendingUp, Building2 } from 'lucide-react';
import { HowItWorksSection, TrustSection } from '@/components/student/BrowseUniversitySections';
import InfoBanner from '@/components/ui/InfoBanner';

export default async function ApplicationsPage() {
    const applications = await getStudentApplications();

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            {/* Applications Content */}
            <div className="w-full">
                {applications.length === 0 ? (
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-200 p-8 sm:p-12 lg:p-16 text-center">
                        <div className="max-w-2xl mx-auto">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg mb-6">
                                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-black text-[#1d1b41] mb-3">
                                No Applications Yet
                            </h3>
                            <p className="text-sm font-medium text-slate-500 mb-8 max-w-md mx-auto">
                                Start your educational journey by submitting your first application to your dream university!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                                <Link
                                    href="/dashboard/apply"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1d1b41] hover:bg-[#2a284a] text-white font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Create Application</span>
                                </Link>
                                <Link
                                    href="/dashboard/colleges"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-black text-xs uppercase tracking-widest border border-gray-300 hover:border-gray-400 transition-all"
                                >
                                    <Building2 className="w-5 h-5" />
                                    <span>Browse Universities</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Minimal Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-gray-100 pb-6">
                            <div>
                                <h1 className="text-2xl font-black text-[#1d1b41] tracking-tight">
                                    My Applications
                                </h1>
                                <p className="text-sm font-medium text-slate-500 mt-1">
                                    Track and manage your university applications.
                                </p>
                            </div>
                            <Link
                                href="/dashboard/apply"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#1d1b41] text-white hover:bg-[#2a284a] font-black text-[11px] uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                <Plus className="w-4 h-4 text-[#d5a22d]" />
                                <span>New Application</span>
                            </Link>
                        </div>
                        <InfoBanner 
                            type="tip"
                            title="Pro-Tip: Track Success"
                            message="Use the status pipeline below each application to track exactly where you are in the journey. From 'Country Review' to 'Enrolled', every step is updated in real-time."
                        />
                        <ApplicationsList applications={applications} />
                    </div>
                )}
            </div>

            {/* Global Sections for Consistency */}
            <div className="pt-16 border-t border-gray-100 space-y-16">
                <HowItWorksSection />
                <TrustSection />
            </div>
        </div>
    );
}
