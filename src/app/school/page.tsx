'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    GraduationCap, ArrowRight, CheckCircle2, Sparkles, Globe2,
    ShieldCheck, TrendingUp, Users, LayoutDashboard, Trophy,
    Building2, Menu, X, MessageSquare
} from 'lucide-react';
import { TenpatenLogo } from '@/components/branding/TenpatenLogo';

export default function SchoolLandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <main className="min-h-screen bg-[#1a1b41] selection:bg-[#d5a22d]/30">
            {/* Navigation Bar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#1a1b41]/90 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${isMenuOpen ? 'h-auto pb-6' : 'h-16 md:h-20'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                    <div className="scale-90 sm:scale-100 origin-left">
                        <TenpatenLogo variant="white" />
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-semibold text-gray-300 hover:text-[#d5a22d] transition-colors">Solutions</Link>
                        <Link href="#partners" className="text-sm font-semibold text-gray-300 hover:text-[#d5a22d] transition-colors">Our Partners</Link>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            href="mailto:sales@tenpaten.com"
                            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#d5a22d] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#b89531] hover:shadow-lg hover:shadow-[#d5a22d]/20 transition-all active:scale-95 whitespace-nowrap"
                        >
                            Inquire Now
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden px-4 pt-2 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300 border-t border-gray-50 mt-2">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="#features"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-semibold text-gray-300 px-2 py-1"
                            >
                                Solutions
                            </Link>
                            <Link
                                href="#partners"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-semibold text-gray-300 px-2 py-1"
                            >
                                Our Partners
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden flex items-center justify-center min-h-[75vh]">
                {/* Background Visuals */}
                <div className="absolute inset-0 -z-10">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756defeec?auto=format&fit=crop&q=80&w=2000"
                        alt="Modern university architecture"
                        className="w-full h-full object-cover opacity-[0.04] select-none"
                    />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#36335e]/40 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-[#d5a22d]/10 rounded-full blur-[100px]" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#36335e]/50 border border-[#36335e] text-white text-sm font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 backdrop-blur-sm">
                        <Building2 className="w-4 h-4 text-[#d5a22d]" />
                        <span>Institutional Partnership Program</span>
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Modernize Your Global <br className="hidden lg:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d5a22d] to-white bg-300% animate-gradient">
                            Recruitment Strategy
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-sm lg:text-base text-gray-400 leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Connect with verified international students, streamline admissions,
                        and build a diverse student body with Tenpaten Apply's data-driven ecosystem
                        designed specifically for global institutions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                        <Link
                            href="mailto:sales@tenpaten.com"
                            className="w-full sm:w-auto px-8 py-3 bg-[#d5a22d] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#b89531] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#d5a22d]/20 text-sm"
                        >
                            Contact Sales
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works: The Institutional Journey */}
            <section id="journey" className="py-20 lg:py-32 bg-[#1a1b41] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 lg:mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36335e] text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            The Roadmap
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-[0.9]">Your Path to <br/> Global Growth</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
                        
                        {[
                            {
                                step: "01",
                                title: "Consultation",
                                desc: "Connect with our sales team to discuss your recruitment targets and institutional requirements.",
                                icon: MessageSquare
                            },
                            {
                                step: "02",
                                title: "Verification",
                                desc: "Our compliance team verifies your credentials to ensure the highest standard of global partnership.",
                                icon: ShieldCheck
                            },
                            {
                                step: "03",
                                title: "Managed Setup",
                                desc: "Our team configures your branding, programs, and admission criteria for you.",
                                icon: LayoutDashboard
                            },
                            {
                                step: "04",
                                title: "Global Launch",
                                desc: "Go live on the Tenpaten ecosystem and start receiving pre-vetted international leads.",
                                icon: Globe2
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-[2rem] bg-[#23244a] border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#d5a22d]/50 transition-all duration-500 shadow-xl group-hover:shadow-[#d5a22d]/10">
                                    <item.icon className="w-10 h-10 text-[#d5a22d]" />
                                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#d5a22d] text-[#1a1b41] text-[10px] font-black flex items-center justify-center">
                                        {item.step}
                                    </span>
                                </div>
                                <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-3">{item.title}</h4>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <Link
                            href="mailto:sales@tenpaten.com"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1a1b41] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#d5a22d] hover:text-white transition-all shadow-2xl"
                        >
                            Inquire for Partnership
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-16 bg-[#1a1b41] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3 tracking-tight">The Institutional Toolkit</h2>
                        <p className="text-gray-400 font-medium text-sm">Powerful features to scale your international presence</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="group p-8 rounded-[2rem] bg-[#23244a] border border-white/5 hover:border-[#d5a22d]/30 hover:bg-[#23244a] transition-all duration-500 hover:shadow-2xl hover:shadow-[#d5a22d]/10">
                            <div className="w-12 h-12 bg-[#1a1b41] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform mb-6 border border-white/10">
                                <Users className="w-7 h-7 text-[#d5a22d]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Verified Student Pool</h3>
                            <p className="text-gray-400 text-[13px] leading-relaxed">
                                Access thousands of pre-screened students with complete digital dossiers and academic transcripts.
                            </p>
                        </div>

                        <div className="group p-8 rounded-[2rem] bg-[#23244a] border border-white/5 hover:border-[#d5a22d]/30 hover:bg-[#23244a] transition-all duration-500 hover:shadow-2xl hover:shadow-[#d5a22d]/10">
                            <div className="w-12 h-12 bg-[#1a1b41] rounded-xl flex items-center justify-center shadow-lg group-hover:-rotate-6 transition-transform mb-6 border border-white/10">
                                <LayoutDashboard className="w-7 h-7 text-[#d5a22d]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Admission Workspace</h3>
                            <p className="text-gray-400 text-[13px] leading-relaxed">
                                Manage the entire student lifecycle from inquiry to enrollment with our unified institutional dashboard.
                            </p>
                        </div>

                        <div className="group p-8 rounded-[2rem] bg-[#23244a] border border-white/5 hover:border-[#d5a22d]/30 hover:bg-[#23244a] transition-all duration-500 hover:shadow-2xl hover:shadow-[#d5a22d]/10">
                            <div className="w-12 h-12 bg-[#1a1b41] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform mb-6 border border-white/10">
                                <Trophy className="w-7 h-7 text-[#d5a22d]" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Performance Data</h3>
                            <p className="text-gray-400 text-[13px] leading-relaxed">
                                Real-time analytics on geographical diversity, conversion rates, and recruitment channel performance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="bg-[#151636] border-t border-white/10 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12">
                        <div className="col-span-2 lg:col-span-2 space-y-6">
                            <TenpatenLogo className="text-white" />
                            <p className="text-gray-400 max-w-sm leading-relaxed text-sm font-medium">
                                Empowering global institutions with Tenpaten Apply's smart recruitment technology,
                                verified student data, and a worldwide network of education partners.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-white">Partner Portal</h4>
                            <ul className="space-y-2 text-sm text-gray-400 font-medium">
                                <li><Link href="/" className="hover:text-[#d5a22d] transition-colors">Prospective Students</Link></li>
                                <li><Link href="mailto:sales@tenpaten.com" className="hover:text-[#d5a22d] transition-colors">Partnership Inquiries</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-white">Resources</h4>
                            <ul className="space-y-2 text-sm text-gray-400 font-medium">
                                <li><Link href="/help" className="hover:text-[#d5a22d] transition-colors">School Help Center</Link></li>
                                <li><Link href="/contact" className="hover:text-[#d5a22d] transition-colors">Contact Support</Link></li>
                                <li><Link href="/privacy" className="hover:text-[#d5a22d] transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-[#d5a22d] transition-colors">Partner Terms</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/10 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            &copy; {new Date().getFullYear()} Tenpaten Apply Institutional Network. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
