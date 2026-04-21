import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Country } from '@prisma/client';
import Link from 'next/link';
import { Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';
import UniversityProfileForm from '@/components/school/UniversityProfileForm';

export const dynamic = 'force-dynamic';

export default async function SchoolSetupPage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role;

    // Must be a school admin
    if (userRole !== 'SCHOOL_ADMIN') {
        redirect('/login');
    }

    // If they already have a university, send them to the dashboard
    let universityId = (session?.user as any)?.managedUniversityId;
    if (!universityId && session?.user?.id) {
        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { managedUniversityId: true },
        });
        universityId = dbUser?.managedUniversityId;
    }
    if (universityId) {
        redirect('/dashboard/school');
    }

    let countries: Country[] = [];
    try {
        countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });
    } catch (error) {
        console.error('Database error fetching countries:', error);
    }

    return (
        <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a1b41] via-[#22204f] to-[#12132e]">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-[#d5a22d]/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#36335e]/40 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-[#4a4785]/20 rounded-full blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* Left — Branded Hero Panel */}
                <div className="hidden lg:flex flex-col justify-between w-[420px] xl:w-[480px] shrink-0 p-12 border-r border-white/5 relative overflow-hidden">
                    {/* University image overlay */}
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1541339907198-e08756defeec?auto=format&fit=crop&q=80&w=1200"
                            alt="University"
                            className="w-full h-full object-cover opacity-[0.08] select-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b41]/60 via-transparent to-[#1a1b41]/80" />
                    </div>

                    {/* Top: Logo + Tag */}
                    <div className="relative z-10">
                        <TenpatenLogo variant="white" />
                        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d5a22d]/15 border border-[#d5a22d]/30 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.25em]">
                            <Building2 className="w-3 h-3" />
                            Tenpaten Apply
                        </div>
                    </div>

                    {/* Middle: Headline */}
                    <div className="relative z-10 space-y-6">
                        <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.1]">
                            Join the Global
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#d5a22d] to-[#f0c84e]">
                                Education Network
                            </span>
                        </h1>
                        <p className="text-white/50 text-sm font-medium leading-relaxed">
                            Connect with thousands of verified international students. Our team reviews every application within 24–48 hours.
                        </p>
                        <div className="space-y-3">
                            {[
                                'Verified student pipeline',
                                'Data-driven recruitment tools',
                                'Dedicated institutional dashboard',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#d5a22d]/20 border border-[#d5a22d]/40 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3 h-3 text-[#d5a22d]" />
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom: Back link */}
                    <div className="relative z-10">
                        <Link
                            href="/school/login"
                            className="text-sm font-medium text-white/40 hover:text-white/80 transition-colors inline-flex items-center gap-2 group"
                        >
                            <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Right — Form Panel */}
                <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-8 lg:px-12 overflow-y-auto">
                    {/* Mobile-only header */}
                    <div className="flex flex-col items-center text-center mb-8 space-y-4 lg:hidden">
                        <TenpatenLogo variant="white" />
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d5a22d]/15 border border-[#d5a22d]/30 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.25em]">
                            <Building2 className="w-3 h-3" />
                            Institutional Setup
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Register Your Institution
                        </h1>
                        <p className="text-white/50 text-sm font-medium leading-relaxed max-w-md mx-auto">
                            Fill in your institution&apos;s details below. Our team reviews applications within 24–48 hours.
                        </p>
                    </div>

                    {/* Desktop sub-header above form */}
                    <div className="hidden lg:block w-full max-w-xl mb-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d5a22d]">
                                Education Platform · Institutional Setup
                            </p>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                Register Your Institution
                            </h2>
                            <p className="text-white/40 text-sm font-medium">
                                Fill in your institution&apos;s details below. Our team reviews applications within 24–48 hours.
                            </p>
                        </div>
                    </div>

                    {/* Form card */}
                    <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl shadow-black/40 ring-1 ring-white/10 overflow-hidden">
                        <UniversityProfileForm
                            university={null}
                            countries={countries}
                            isNew={true}
                        />
                    </div>

                    <div className="text-center mt-6 lg:hidden">
                        <Link
                            href="/school/login"
                            className="text-sm font-medium text-white/40 hover:text-white/80 transition-colors inline-flex items-center gap-2 group"
                        >
                            <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
