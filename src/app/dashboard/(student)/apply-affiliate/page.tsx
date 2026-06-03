import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAllCountries } from '@/lib/data/countries';
import prisma from '@/lib/prisma';
import ApplyAffiliateForm from './ApplyAffiliateForm';
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Apply to Affiliate Program | Tenpaten',
};

export default async function ApplyAffiliatePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    // Check if the user is already an affiliate
    const userRole = (session.user as any).role;
    if (userRole === 'AFFILIATE') {
        redirect('/dashboard/affiliate');
    }

    // Double-check DB for in-progress or pending profiles just to be safe
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { affiliateProfile: true }
    });

    if (user?.affiliateProfile) {
        // Even if role is not updated, if profile exists, send them to dashboard
        redirect('/dashboard/affiliate');
    }

    const countries = await getAllCountries();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="relative overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                    <div className="space-y-4">
                        <Link 
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-accent transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-brand-accent" />
                            </div>
                            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em]">
                                Partnership Program
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tight">
                            Become an <span className="text-brand-accent">Affiliate Partner</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium max-w-lg leading-relaxed">
                            Join our global network of affiliates. Earn rewards and commissions for every successful student enrollment you refer to Tenpaten.
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-2xl border border-green-100 shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <div className="text-xs font-bold">Secure Application Process</div>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] p-6 lg:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
                
                <div className="relative z-10">
                    <ApplyAffiliateForm countries={countries} />
                </div>
            </div>
        </div>
    );
}
