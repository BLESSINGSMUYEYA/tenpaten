import Link from 'next/link';
import Image from 'next/image';
import { Building2, Globe2, Users2, ArrowRight, CheckCircle } from 'lucide-react';

export function UniversitySection() {
    return (
        <section id="universities" className="py-20 lg:py-32 bg-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="order-2 lg:order-1 relative mt-12 lg:mt-0">
                        <div className="relative rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl border border-gray-100 group">
                            <Image
                                src="/images/landing/university-hall.png"
                                alt="University Hall"
                                width={1200}
                                height={800}
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority
                            />
                        </div>

                        {/* stats card */}
                        <div className="absolute -bottom-6 -right-4 sm:-bottom-10 sm:-right-10 bg-[#d5a22d] p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl group hover:scale-105 transition-transform duration-500 border-[6px] sm:border-8 border-white z-20">
                            <div className="text-[#1a1b41] relative">
                                <p className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-1 sm:mb-2">500+</p>
                                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-80">Global Institutions</p>
                                <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-16 h-16 bg-white/30 rounded-full blur-xl sm:blur-2xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[#d5a22d] text-[10px] font-black tracking-[0.3em] mb-6 lg:mb-8 uppercase shadow-sm">
                            University Partnership
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1b41] mb-6 lg:mb-8 leading-[0.9] tracking-tighter uppercase text-balance">
                            Scale Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d5a22d] to-[#1a1b41]">Recruitment</span>
                        </h2>
                        <p className="text-gray-500 text-base lg:text-lg mb-8 lg:mb-12 font-bold leading-relaxed max-w-xl">
                            Connect with highly qualified, pre-vetted students globally. Our platform streamlines the entire application lifecycle safely and efficiently.
                        </p>

                        <div className="space-y-5 sm:space-y-6 mb-10 lg:mb-12">
                            {[
                                {
                                    icon: Globe2,
                                    title: "Global Visibility",
                                    desc: "Showcase your programs to a worldwide audience of prospective students."
                                },
                                {
                                    icon: Users2,
                                    title: "Verified Leads",
                                    desc: "Receive applications from pre-screened, qualified candidates ready to enroll."
                                },
                                {
                                    icon: Building2,
                                    title: "Easy Management",
                                    desc: "Automated workflows to track and process multi-student applications effortlessly."
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 sm:gap-5 group">
                                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#1a1b41] transition-all shadow-sm border border-gray-100">
                                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#d5a22d]" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-lg lg:text-xl font-black text-[#1a1b41] uppercase tracking-tighter mb-0.5">{item.title}</h4>
                                        <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-12 lg:mt-16">
                            <Link
                                href="/register?type=school"
                                className="w-full sm:w-fit inline-flex items-center justify-center gap-3 px-8 py-5 sm:px-12 sm:py-6 rounded-2xl bg-[#1a1b41] text-white font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all hover:bg-[#d5a22d] hover:scale-[1.02] active:scale-95 shadow-2xl shadow-[#1a1b41]/10"
                            >
                                School Dashboard
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full sm:w-fit inline-flex items-center justify-center gap-3 px-8 py-5 sm:px-12 sm:py-6 rounded-2xl border-2 border-gray-100 text-[#1a1b41] font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all hover:bg-gray-50 active:scale-95"
                            >
                                Contact Partner Team
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
