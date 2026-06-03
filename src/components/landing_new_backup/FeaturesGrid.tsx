import { ShieldCheck, Globe2, Building2, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: Globe2,
        title: "Global Reach",
        desc: "Access thousands of programs across the globe. Find the perfect match for your career.",
        tag: "Worldwide"
    },
    {
        icon: ShieldCheck,
        title: "Unified Profile",
        desc: "Apply to multiple universities with a single profile. We handle the complexity for you.",
        tag: "Seamless"
    },
    {
        icon: Building2,
        title: "Verified Partners",
        desc: "Expert guidance from verified advisors. We're with you from search to campus arrival.",
        tag: "Trusted"
    }
];

export function FeaturesGrid() {
    return (
        <section id="features" className="py-24 lg:py-32 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-brand-accent text-[10px] font-black tracking-[0.3em] mb-6 uppercase">
                            Creative Approach
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black text-[#1a1b41] tracking-tighter uppercase leading-[0.85] mb-6">
                            Features <span className="text-brand-accent">Section</span>
                        </h2>
                        <p className="text-[#1a1b41]/60 text-lg font-medium">
                            Learn more about how Tenpaten Apply streamlines your global education journey through innovative tools and expert support.
                        </p>
                    </div>

                    <Link
                        href="/register?type=student"
                        className="bg-[#1a1b41] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-xl shadow-[#1a1b41]/10 active:scale-95 self-start lg:self-auto"
                    >
                        <Sparkles className="w-4 h-4 text-brand-accent" />
                        Explore Smart Portal
                    </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {features.map((feature, i) => (
                        <div key={i} className="group p-10 lg:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_32px_64px_-16px_rgba(26,27,65,0.05)] hover:shadow-[0_48px_80px_-24px_rgba(26,27,65,0.12)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-150">
                                <feature.icon className="w-32 h-32 text-[#1a1b41]" />
                            </div>
                            
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-[#1a1b41] group-hover:text-white transition-all duration-500 shadow-sm border border-gray-100 relative z-10">
                                    <feature.icon className="w-8 h-8 text-brand-accent" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent/40 group-hover:text-brand-accent transition-colors">
                                    {feature.tag}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-[#1a1b41] mb-4 uppercase tracking-tighter relative z-10 leading-[0.9]">
                                {feature.title}
                            </h3>
                            <p className="text-[#1a1b41]/60 leading-relaxed font-medium relative z-10 mb-8 flex-1">
                                {feature.desc}
                            </p>

                            <div className="relative z-10 pt-8 border-t border-gray-50 mt-auto">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1b41] group-hover:text-brand-accent transition-colors cursor-pointer">
                                    Learn More <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
