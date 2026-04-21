import { Building2, GraduationCap, School, BookOpen, Globe, Award, ShieldCheck, Zap } from 'lucide-react';

const KeyBenefits = [
    { name: "Direct Admissions", icon: GraduationCap },
    { name: "Global Scholarships", icon: Award },
    { name: "Application Tracking", icon: BookOpen },
    { name: "Verified Documents", icon: ShieldCheck },
    { name: "Global Network", icon: Globe },
    { name: "Fast Approvals", icon: Zap },
];

export function UniversityShowcase() {
    return (
        <section className="py-24 bg-white relative overflow-hidden border-y border-gray-100">
            <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#d5a22d_1px,transparent_1px)] [background-size:48px_48px]" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
                    <div className="text-center md:text-left max-w-lg">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black tracking-[0.3em] mb-6 uppercase">
                            Premium Platform Benefits
                        </div>
                        <h2 className="text-[#36335e] text-4xl sm:text-5xl font-black font-outfit uppercase tracking-tighter leading-none">
                            Your Fast-Track to <br className="hidden lg:block" /> <span className="text-[#d5a22d]">Global Education</span>
                        </h2>
                    </div>
                    
                    <div className="flex gap-12 border-l border-gray-200 pl-12 hidden md:flex items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-[#d5a22d]" />
                            </div>
                            <div>
                                <p className="text-[#36335e] font-black text-3xl leading-none">98%</p>
                                <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mt-1">Acceptance Rate</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-[#d5a22d]" />
                            </div>
                            <div>
                                <p className="text-[#36335e] font-black text-3xl leading-none">24/7</p>
                                <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mt-1">Application Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 transition-all duration-700 select-none">
                    {KeyBenefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4 group cursor-default bg-white border border-gray-100 px-6 py-4 rounded-3xl hover:bg-gray-50 transition-all hover:-translate-y-2 duration-500 hover:border-[#d5a22d]/30 shadow-xl shadow-gray-200/50">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-2xl group-hover:bg-[#d5a22d] transition-colors duration-500">
                                <benefit.icon className="w-5 h-5 text-[#d5a22d] group-hover:text-white transition-colors duration-500" />
                            </div>
                            <span className="text-xs text-[#36335e]/60 font-black uppercase tracking-widest group-hover:text-[#36335e] transition-colors">{benefit.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
