import { Star, Quote } from 'lucide-react';

const Testimonials = [
    {
        name: "Blessings Muyeya",
        role: "Founder",
        content: "Tenpaten was born out of a vision to democratize global education. We are building the bridge that empowers every student to reach their full potential, regardless of their background.",
        rating: 5,
        avatar: "BM"
    },
    {
        name: "Jairos Phiri",
        role: "Founder",
        content: "Our platform is more than just an application tool; it's a commitment to transparency and excellence. We are redefining how universities and students interact on a global scale.",
        rating: 5,
        avatar: "JP"
    },
    {
        name: "Davie Chilembo",
        role: "National Director",
        content: "We've seen the life-changing impact this platform has on students every day. It's rewarding to lead the effort in making world-class education accessible and achievable.",
        rating: 5,
        avatar: "DC"
    }
];

export function TestimonialSection() {
    return (
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden border-t border-gray-100">
            <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#d5a22d_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 lg:mb-20">
                    <span className="text-[#d5a22d] text-[10px] font-black tracking-[0.3em] uppercase">Success Stories</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a1b41] mt-4 tracking-tighter uppercase leading-[0.9]">Trusted by Thousands</h2>
                    <p className="text-gray-500 font-bold text-base lg:text-lg mt-4 max-w-2xl mx-auto">Hear how our global platform is changing the way students and universities connect.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {Testimonials.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-100 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col group hover:-translate-y-2">
                            <Quote className="w-10 h-10 text-[#d5a22d]/20 mb-6 group-hover:text-[#d5a22d] transition-colors duration-500" />
                            
                            <p className="text-gray-600 font-medium leading-relaxed mb-8 flex-1 italic">
                                "{item.content}"
                            </p>
                            
                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
                                <div className="w-12 h-12 rounded-full bg-[#1a1b41] flex items-center justify-center text-white font-black text-lg">
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="text-[#1a1b41] font-black tracking-tight">{item.name}</h4>
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
