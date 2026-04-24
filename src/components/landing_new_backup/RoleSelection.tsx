import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, TrendingUp, Building2, ArrowRight } from 'lucide-react';

export function RoleSelection() {
    return (
        <section id="roles" className="py-20 lg:py-32 bg-slate-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">Tailored Experiences</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter uppercase leading-[0.9]">Choose Your Path</h2>
                    <p className="text-gray-500 font-bold text-base lg:text-lg mt-4 px-4 max-w-2xl mx-auto">Join our global network of ambitious students and world-class institutions.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                    {/* Student Card - THE FOCUS */}
                    <div className="lg:col-span-2 group relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-700 flex flex-col md:flex-row shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] min-h-[400px] sm:min-h-[450px]">
                        <div className="md:w-5/12 overflow-hidden relative min-h-[250px] sm:min-h-[300px] md:min-h-full">
                            <Image
                                src="/images/landing/students-collaboration.png"
                                alt="Students collaboration"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                                priority
                            />
                            <div className="absolute inset-0 bg-transparent" />
                            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-14 h-14 sm:w-16 sm:h-16 bg-white/90 backdrop-blur-xl rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform border border-white z-20">
                                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-[#d5a22d]" />
                            </div>
                        </div>
                        <div className="md:w-7/12 p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative z-20">
                            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black tracking-[0.3em] mb-4 sm:mb-6 w-fit uppercase">
                                For Students
                            </div>
                            <h3 className="text-2xl sm:text-2xl lg:text-3xl font-black text-[#1a1b41] mb-4 sm:mb-6 uppercase tracking-tighter leading-none">Find Your <br/>Dream Future</h3>
                            <p className="text-gray-500 mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base lg:text-lg font-bold">
                                Discover thousands of programs at accredited global universities. We guide you from search to acceptance.
                            </p>
                            <Link
                                href="/register?type=student"
                                className="w-full sm:w-fit inline-flex items-center justify-center gap-3 sm:gap-4 px-8 py-5 sm:px-12 sm:py-6 rounded-xl sm:rounded-2xl bg-[#1a1b41] text-white font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs transition-all hover:bg-[#d5a22d] hover:scale-[1.02] active:scale-95 shadow-2xl shadow-[#1a1b41]/10"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Link> 
                        </div>
                    </div>

                    {/* Smaller Side Column for Other Roles */}
                    <div className="flex flex-col gap-6 sm:gap-8">
                        {/* School Card */}
                        <div className="group relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-700 flex flex-col shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] flex-1 p-8">
                            <div className="flex items-center gap-5 mb-6">
                                <div className="p-4 bg-gray-50 rounded-xl text-[#d5a22d] group-hover:scale-110 group-hover:bg-[#1a1b41] group-hover:text-white transition-all shadow-sm">
                                    <Building2 className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl sm:text-xl lg:text-2xl font-black text-[#1a1b41] uppercase tracking-tighter leading-none">Institutions</h3>
                            </div>
                            <p className="text-gray-500 text-sm sm:text-base mb-8 flex-1 font-bold leading-relaxed">
                                Join 500+ universities worldwide. Reach talented students and automate recruitment.
                            </p>
                            <Link
                                href="/login"
                                className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.3em] hover:text-[#1a1b41] flex items-center gap-2 group/link mt-auto"
                            >
                                Institution Log In
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Partner Card */}
                        <div className="group relative overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white hover:bg-gray-50/50 transition-all duration-700 flex flex-col shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] flex-1 p-8">
                            <div className="flex items-center gap-5 mb-6">
                                <div className="p-4 bg-gray-50 rounded-xl text-[#d5a22d] group-hover:scale-110 group-hover:bg-[#1a1b41] group-hover:text-white transition-all shadow-sm">
                                    <TrendingUp className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl sm:text-xl lg:text-2xl font-black text-[#1a1b41] uppercase tracking-tighter leading-none">Partners</h3>
                            </div>
                            <p className="text-gray-500 text-sm sm:text-base mb-8 flex-1 font-bold leading-relaxed">
                                Partner with us to provide seamless academic guidance to students globally.
                            </p>
                            <Link
                                href="/contact"
                                className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.3em] hover:text-[#1a1b41] flex items-center gap-2 group/link mt-auto"
                            >
                                Contact Support
                                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
