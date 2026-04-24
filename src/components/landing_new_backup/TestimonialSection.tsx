import { Star, Quote } from 'lucide-react';

const Testimonials = [
    {
        name: "Sarah M.",
        role: "International Student",
        content: "Tenpaten Apply transformed my dream of studying abroad into reality. The application process was seamless, and I received my offer letter in record time.",
        rating: 5,
        avatar: "S"
    },
    {
        name: "Dr. James K.",
        role: "Admissions Director",
        content: "Partnering with Tenpaten has drastically improved our international recruitment. We now receive highly qualified, pre-vetted applicants, saving us hundreds of hours.",
        rating: 5,
        avatar: "J"
    },
    {
        name: "Elena R.",
        role: "Education Consultant",
        content: "The partner dashboard is incredibly intuitive. It allows my agency to track dozens of student applications simultaneously with complete transparency.",
        rating: 5,
        avatar: "E"
    }
];

export function TestimonialSection() {
    return (
        <section className="py-24 lg:py-32 bg-white relative overflow-hidden border-t border-gray-100">
            {/* Background artistic elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#d5a22d]/5 to-transparent blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[#d5a22d] text-[10px] font-black tracking-[0.3em] mb-6 uppercase shadow-sm">
                        Success Stories
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black text-[#1a1b41] tracking-tighter uppercase leading-[0.85] mb-6">
                        Trusted by <span className="text-[#d5a22d]">Thousands</span>
                    </h2>
                    <p className="text-[#1a1b41]/60 text-lg font-medium max-w-2xl mx-auto">
                        Hear how our global platform is changing the way students and universities connect.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {Testimonials.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-[0_32px_64px_-20px_rgba(26,27,65,0.08)] hover:shadow-[0_48px_80px_-24px_rgba(26,27,65,0.15)] transition-all duration-500 flex flex-col group hover:-translate-y-3 relative overflow-hidden h-full">
                            {/* Decorative quote mark in background */}
                            <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                                <Quote className="w-40 h-40 text-[#1a1b41]" />
                            </div>

                            <div className="flex gap-1 mb-8">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#d5a22d] text-[#d5a22d]" />
                                ))}
                            </div>
                            
                            <p className="text-[#1a1b41]/70 font-medium leading-relaxed mb-10 flex-1 italic text-lg relative z-10">
                                "{item.content}"
                            </p>
                            
                            <div className="flex items-center gap-5 mt-auto pt-8 border-t border-gray-50 relative z-10">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a1b41] to-[#36335e] flex items-center justify-center text-white font-black text-xl shadow-lg">
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="text-[#1a1b41] font-black tracking-tight text-lg">{item.name}</h4>
                                    <p className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em]">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
