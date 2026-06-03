import Link from 'next/link';
import Image from 'next/image';
import { Building2, Globe2, Users2, ArrowRight, CheckCircle } from 'lucide-react';

export function UniversitySection() {
    return (
        <section id="universities" className="py-24 lg:py-32 bg-white relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="relative rounded-[3rem] lg:rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(26,27,65,0.15)] border border-gray-100 group">
                            <Image
                                src="/images/landing/university-hall.png"
                                alt="University Hall"
                                width={1200}
                                height={800}
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#1a1b41]/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        </div>

                        {/* Enhanced stats card */}
                        <div className="absolute -bottom-8 -right-4 sm:-bottom-12 sm:-right-8 bg-brand-accent p-8 sm:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_30px_60px_-10px_rgba(213,162,45,0.4)] group hover:scale-105 transition-all duration-500 border-[8px] sm:border-[12px] border-white z-20">
                            <div className="text-[#1a1b41] relative text-center">
                                <p className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-2">500+</p>
                                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] opacity-80 whitespace-nowrap">Global Institutions</p>
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/40 rounded-full blur-3xl animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-brand-accent text-[10px] font-black tracking-[0.3em] mb-8 uppercase shadow-sm">
                            Partnership Focus
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-[#1a1b41] mb-8 leading-[0.85] tracking-tighter uppercase text-balance">
                            Scale Your <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-accent via-[#1a1b41] to-brand-accent bg-[length:200%_auto] animate-gradient-x">Recruitment</span>
                        </h2>
                        <p className="text-[#1a1b41]/60 text-lg lg:text-xl mb-12 font-medium leading-relaxed max-w-xl">
                            Connect with highly qualified, pre-vetted students globally. Our platform streamlines the entire application lifecycle with AI-driven efficiency.
                        </p>

                        <div className="space-y-8 mb-16">
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
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#1a1b41] group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100">
                                        <item.icon className="w-7 h-7 text-brand-accent" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="text-xl lg:text-2xl font-black text-[#1a1b41] uppercase tracking-tighter mb-1 group-hover:text-brand-accent transition-colors">{item.title}</h4>
                                        <p className="text-[#1a1b41]/50 text-sm lg:text-base font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-[#1a1b41] text-white font-black uppercase tracking-widest text-[10px] transition-all hover:bg-brand-accent hover:shadow-xl hover:shadow-brand-accent/30 active:scale-95 shadow-2xl shadow-[#1a1b41]/10"
                            >
                                Partner Portal Access
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl border-2 border-gray-100 text-[#1a1b41] font-black uppercase tracking-widest text-[10px] transition-all hover:bg-gray-50 active:scale-95"
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
