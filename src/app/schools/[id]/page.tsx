import { getUniversityBySlug } from '@/lib/data/universities';
import { getUniversityById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { GraduationCap, MapPin, Globe, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
    const { id } = await params;
    const university = await getUniversityById(id);
    if (!university || university.status !== 'APPROVED') {
        return { title: 'Institution Not Found | Tenpaten' };
    }
    return {
        title: `${university.name} | Tenpaten Apply`,
        description: university.description?.substring(0, 160) ??
            `Explore programs and apply to ${university.name} via Tenpaten Apply.`,
        openGraph: {
            title: university.name,
            description: university.description?.substring(0, 160) ?? '',
            images: university.logo ? [university.logo] : university.images?.slice(0, 1) ?? [],
        },
    };
}

export default async function PublicSchoolPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const university = await getUniversityById(id);

    if (!university || university.status !== 'APPROVED') {
        notFound();
    }

    const programCount = university.programs?.length ?? 0;
    const heroImage = university.images?.[0] ?? null;

    return (
        <main className="min-h-screen bg-[#1a1b41] text-white font-sans">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1b41]/90 backdrop-blur-md border-b border-white/10 h-16 flex items-center px-6">
                <Link href="/" className="flex items-center">
                    <TenpatenLogo variant="white" />
                </Link>
                <div className="ml-auto flex items-center gap-4">
                    <Link
                        href={`/login?callbackUrl=/dashboard/schools/${university.id}`}
                        className="text-sm font-bold text-gray-300 hover:text-[#d5a22d] transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href={`/register?callbackUrl=/dashboard/schools/${university.id}`}
                        className="px-5 py-2.5 bg-[#d5a22d] text-white rounded-xl text-sm font-bold hover:bg-[#b89531] transition-all"
                    >
                        Join Free
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-16 min-h-[60vh] flex items-center">
                {/* Background image */}
                {heroImage && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroImage}
                            alt={university.name}
                            className="w-full h-full object-cover opacity-10"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1b41]/60 via-[#1a1b41]/80 to-[#1a1b41]" />
                    </div>
                )}

                {/* Ambient glows */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#d5a22d]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#36335e]/40 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
                    {/* Logo */}
                    {university.logo ? (
                        <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto mb-8 overflow-hidden shadow-2xl flex items-center justify-center p-3">
                            <img src={university.logo} alt={`${university.name} logo`} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className="w-28 h-28 rounded-3xl bg-[#36335e] border border-white/10 mx-auto mb-8 flex items-center justify-center shadow-2xl">
                            <GraduationCap className="w-14 h-14 text-[#d5a22d]" />
                        </div>
                    )}

                    {/* Country badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest mb-5 backdrop-blur-md">
                        <MapPin className="w-3.5 h-3.5 text-[#d5a22d]" />
                        {university.country?.name}
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
                        {university.name}
                    </h1>

                    {university.description && (
                        <p className="text-gray-400 text-base leading-relaxed max-w-2xl mx-auto mb-10">
                            {university.description.substring(0, 280)}
                            {university.description.length > 280 ? '…' : ''}
                        </p>
                    )}

                    {/* Stats row */}
                    <div className="flex items-center justify-center gap-8 mb-10">
                        <div className="text-center">
                            <p className="text-3xl font-black text-[#d5a22d]">{programCount}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Programs</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl font-black text-[#d5a22d]">Open</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Applications</p>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={`/dashboard/schools/${university.id}?tab=programs`}
                            className="w-full sm:w-auto px-10 py-4 bg-[#d5a22d] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#b89531] transition-all hover:scale-105 shadow-xl shadow-[#d5a22d]/20"
                        >
                            <BookOpen className="w-5 h-5" />
                            Explore All Programs
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                        <Link
                            href={`/register?callbackUrl=/dashboard/schools/${university.id}?tab=programs`}
                            className="w-full sm:w-auto px-10 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                        >
                            Create Account to Apply
                        </Link>
                    </div>

                    {university.website && (
                        <a
                            href={university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-6 text-xs text-gray-500 hover:text-[#d5a22d] transition-colors font-bold"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            {university.website.replace(/^https?:\/\//, '')}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8 text-center">
                <p className="text-xs text-gray-600 font-medium">
                    Powered by{' '}
                    <Link href="/" className="text-[#d5a22d] hover:underline font-bold">
                        Tenpaten Apply
                    </Link>{' '}
                    — The Global Student Recruitment Platform
                </p>
            </footer>
        </main>
    );
}
