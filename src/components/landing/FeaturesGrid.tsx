import { ShieldCheck, Globe2, Building2 } from 'lucide-react';

export function FeaturesGrid() {
    return (
        <section id="features" className="py-20 lg:py-32 relative overflow-hidden bg-slate-50/50">
            {/* Subtle decorative grid */}
            <div className="absolute inset-0 opacity-[0.05] select-none pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d5a22d 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">Core Platform</span>
                    <h2 className="text-3xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter uppercase leading-[0.9]">Built for Growth</h2>
                    <p className="text-gray-500 font-bold text-base lg:text-lg mt-4 max-w-2xl mx-auto">Powerful tools designed for your recruitment success and student global mobility.</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {[
                        { icon: Globe2, title: "Global Reach", desc: "Access thousands of programs across the globe. Find the perfect match for your career." },
                        { icon: ShieldCheck, title: "Unified Profile", desc: "Apply to multiple universities with a single profile. We handle the complexity for you." },
                        { icon: Building2, title: "Verified Partners", desc: "Expert guidance from verified advisors. We're with you from search to campus arrival." }
                    ].map((feature, i) => (
                        <div key={i} className="group p-10 lg:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                                <feature.icon className="w-24 h-24 text-[#1a1b41]" />
                            </div>
                            <div className="p-5 bg-gray-50 rounded-2xl w-fit mb-8 group-hover:scale-110 group-hover:bg-[#1a1b41] group-hover:text-white transition-all shadow-sm border border-gray-100 relative z-10">
                                <feature.icon className="w-8 h-8 text-[#d5a22d]" />
                            </div>
                            <h3 className="text-xl sm:text-xl lg:text-2xl font-black text-[#1a1b41] mb-4 uppercase tracking-tighter relative z-10 group-hover:text-[#d5a22d] transition-colors leading-none">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed font-bold relative z-10 text-sm sm:text-base">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
