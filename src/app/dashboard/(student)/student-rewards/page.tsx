import { getAffiliateStats } from '@/lib/data';
import Link from 'next/link';
import { Users, DollarSign, TrendingUp, Gift, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import AffiliateClient from './AffiliateClient'; // Client component for interactivity
import { auth } from '@/auth';

export default async function AffiliatePage() {
    const affiliate = await getAffiliateStats();

    // Default values if no affiliate profile exists
    const referralCode = affiliate?.referralCode || 'N/A';
    // If user is logged in, link includes their code. If not (shouldn't happen on this page), generic link.
    const referralLink = referralCode !== 'N/A'
        ? `${process.env.NEXT_PUBLIC_APP_URL || 'https://tenpaten.com'}/register?ref=${referralCode}`
        : 'Processing...';

    // Calculate stats dynamicallly
    const totalReferrals = affiliate?.referrals?.length || 0;

    // Active applications: Not rejected, not enrolled (assuming active means in progress)
    const activeApplications = affiliate?.referrals?.filter(app =>
        app.status !== 'REJECTED' && app.status !== 'ENROLLED' && app.status !== 'DRAFT'
    ).length || 0;

    const successfulEnrollments = affiliate?.referrals?.filter(app =>
        app.status === 'ENROLLED'
    ).length || 0;

    // Commission calc: 10% (or specific rate) of tuition. 
    // Since we don't have tuition payments tracked yet, we'll placeholder this based on enrollments * estimated commission
    // Or just 0 for now until payment system is online.
    // Let's assume a fixed commission per enrollment for estimation if rate is percentage
    // For now, simpler to show 0 or "Calculate"
    const totalEarnings = successfulEnrollments * 100; // Mock calculation: $100 per enrollment

    const stats = [
        { label: 'Total Referrals', value: totalReferrals.toString(), color: 'gold' },
        { label: 'Active Applications', value: activeApplications.toString(), color: 'gold' },
        { label: 'Successful Enrollments', value: successfulEnrollments.toString(), color: 'gold' },
        { label: 'Total Earnings', value: `$${totalEarnings}`, color: 'gold' },
    ];

    const benefits = [
        {
            icon: <DollarSign className="w-6 h-6" />,
            title: 'Earn Commissions',
            description: `Get ${affiliate?.commissionRate || 10}% commission for every successful referral who enrolls`,
            color: 'gold',
        },
        {
            icon: <Gift className="w-6 h-6" />,
            title: 'Exclusive Rewards',
            description: 'Unlock special bonuses and perks as you refer more students',
            color: 'gold',
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: 'Passive Income',
            description: 'Build a steady income stream by helping others achieve their dreams',
            color: 'gold',
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Help Others',
            description: 'Make a difference by connecting students with opportunities',
            color: 'gold',
        },
    ];

    const steps = [
        {
            number: '1',
            title: 'Share Your Link',
            description: 'Copy your unique referral link and share it with friends, family, or on social media',
        },
        {
            number: '2',
            title: 'They Sign Up',
            description: 'When someone registers using your link, they become your referral',
        },
        {
            number: '3',
            title: 'They Apply & Enroll',
            description: 'Your referral submits an application and gets accepted to a university',
        },
        {
            number: '4',
            title: 'You Earn Rewards',
            description: 'Receive your commission once your referral successfully enrolls',
        },
    ];

    return (
        <>
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#1a1b41] via-brand-primary to-[#1a1b41] p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-brand-accent/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-white/80" />
                                <span className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wide">
                                    Affiliate Program
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
                                Refer & Earn
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl">
                                Help your friends achieve their educational goals and earn rewards for every successful referral
                            </p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/20">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center lg:text-left">
                                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-white/80">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Referral Link Section - Client Component to handle copy interaction */}
            <AffiliateClient referralLink={referralLink} />

            {/* Benefits Grid */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Join Our Affiliate Program?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {benefits.map((benefit, index) => {
                        const colorClasses = {
                            gold: 'bg-brand-accent/10 text-brand-accent',
                        };
                        return (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-xl bg-white border-2 border-gray-100 hover:border-brand-accent/30 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 rounded-xl ${colorClasses[benefit.color as keyof typeof colorClasses]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-linear-to-br from-[#1a1b41]/5 to-transparent rounded-2xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-black text-[#1a1b41] mb-6 text-center tracking-tight">How It Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-brand-accent to-[#b89531] flex items-center justify-center text-white text-2xl font-black mb-4 shadow-lg shadow-brand-accent/20">
                                    {step.number}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-linear-to-r from-brand-accent/30 to-transparent -translate-x-1/2" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section — changes based on affiliate status */}
            {affiliate?.status === 'APPROVED' ? (
                /* ✅ Approved: Link to Affiliate Dashboard */
                <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-brand-primary via-brand-primary-hover to-[#1e1d36] p-6 sm:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-brand-accent/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-accent/20 backdrop-blur-sm mb-4 border border-brand-accent/30">
                            <CheckCircle2 className="w-8 h-8 text-brand-accent" />
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 text-xs font-black uppercase tracking-widest border border-green-500/20 mb-3">
                            ✓ Affiliate Approved
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                            Your Affiliate Account is Active!
                        </h2>
                        <p className="text-white/60 mb-6 text-sm sm:text-base">
                            Head to your Affiliate Dashboard to copy your referral link, track referrals, and view your earnings.
                        </p>
                        <Link
                            href="/dashboard/affiliate"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-accent text-white hover:bg-[#c49228] font-black text-sm shadow-lg shadow-brand-accent/30 hover:shadow-brand-accent/50 transition-all hover:scale-105"
                        >
                            <span>Go to Affiliate Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            ) : affiliate?.status === 'PENDING' ? (
                /* ⏳ Pending: Application under review */
                <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 p-6 sm:p-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-4">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-yellow-800 mb-2">Application Under Review</h2>
                        <p className="text-yellow-700 text-sm sm:text-base">
                            Our team is reviewing your affiliate application. You&apos;ll receive a notification once it&apos;s approved — usually within 24–48 hours.
                        </p>
                    </div>
                </div>
            ) : (
                /* 🔲 No affiliate: Apply CTA */
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#1a1b41] via-brand-primary to-[#1a1b41] p-6 sm:p-8 shadow-xl">
                    <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-brand-accent/10 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 border border-white/20">
                            <Gift className="w-8 h-8 text-brand-accent" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                            Ready to Become an Official Affiliate?
                        </h2>
                        <p className="text-white/70 mb-6 text-sm sm:text-base">
                            Upgrade to our official affiliate program for higher commissions, exclusive perks, and dedicated support
                        </p>
                        <Link
                            href="/dashboard/apply-affiliate"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-accent text-white hover:bg-[#c49228] font-black text-sm shadow-xl shadow-brand-accent/20 transition-all hover:scale-105"
                        >
                            <span>Apply for Official Affiliate Status</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
