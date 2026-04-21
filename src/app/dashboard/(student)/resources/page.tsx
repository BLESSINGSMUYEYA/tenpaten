import Link from 'next/link';
import { Mail, MessageCircle, Phone, BookOpen, Video, Download, GraduationCap, Clock } from 'lucide-react';

export default function ResourcesPage() {
    const contactMethods = [
        {
            icon: <Mail className="w-5 h-5" />,
            title: 'Email Support',
            description: 'support@tenpaten.com',
            href: 'mailto:support@tenpaten.com',
        },
        {
            icon: <MessageCircle className="w-5 h-5" />,
            title: 'Live Chat',
            description: 'Chat with our team',
            href: '#',
        },
        {
            icon: <Phone className="w-5 h-5" />,
            title: 'Phone Support',
            description: '+1 (555) 123-4567',
            href: 'tel:+15551234567',
        },
    ];

    const comingSoon = [
        { icon: <BookOpen className="w-5 h-5" />, title: 'Application Guide', description: 'Step-by-step application walkthrough' },
        { icon: <Video className="w-5 h-5" />, title: 'Video Tutorials', description: 'Visual platform walkthroughs' },
        { icon: <Download className="w-5 h-5" />, title: 'Document Templates', description: 'Ready-to-use application templates' },
        { icon: <GraduationCap className="w-5 h-5" />, title: 'Study Guides', description: 'Exam and interview preparation' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-12">

            {/* Page Header */}
            <div className="px-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Support & Resources</p>
                <h1 className="text-3xl sm:text-4xl font-black text-[#36335e] tracking-tight">
                    How can we <span className="text-[#d5a22d]">help you?</span>
                </h1>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-5 gap-8 items-start">

                {/* LEFT: Coming Soon Resources — wider */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div>
                            <h2 className="text-lg font-black text-[#36335e] tracking-tight">Resources</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guides, templates & more</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#d5a22d]/10 border border-[#d5a22d]/20">
                            <Clock className="w-3 h-3 text-[#d5a22d]" />
                            <span className="text-[9px] font-black text-[#d5a22d] uppercase tracking-widest">Coming Soon</span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {comingSoon.map((item, index) => (
                            <div
                                key={index}
                                className="relative overflow-hidden group rounded-[2rem] bg-white border border-gray-100 p-8 shadow-sm"
                            >
                                {/* Subtle locked overlay */}
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-[2rem] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border border-slate-200 px-4 py-2 rounded-full bg-white shadow-sm">
                                        Coming Soon
                                    </span>
                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-[#36335e]/5 text-[#36335e]/40 flex items-center justify-center mb-5">
                                    {item.icon}
                                </div>
                                <h3 className="text-base font-black text-[#36335e]/60 tracking-tight mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Direct Help Card — narrower */}
                <div className="lg:col-span-2">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#36335e] p-8 shadow-2xl border border-white/5 sticky top-6">
                        {/* Decorative glows */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#d5a22d]/20 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#d5a22d]/10 rounded-full blur-[40px] -ml-18 -mb-18 pointer-events-none" />

                        <div className="relative z-10 space-y-8">
                            {/* Heading */}
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
                                    Need direct help?
                                </h2>
                                <p className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.25em]">
                                    Our expert team is standing by
                                </p>
                            </div>

                            {/* Contact Methods */}
                            <div className="space-y-3">
                                {contactMethods.map((method, index) => (
                                    <Link
                                        key={index}
                                        href={method.href}
                                        className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-[#d5a22d]/40 transition-all duration-300 group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#d5a22d]/20 text-[#d5a22d] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                            {method.icon}
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-sm tracking-tight">{method.title}</p>
                                            <p className="text-[#d5a22d] text-xs font-bold mt-0.5">{method.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* CTA */}
                            <Link
                                href="mailto:support@tenpaten.com"
                                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#d5a22d] text-[#36335e] font-black text-xs uppercase tracking-widest shadow-xl shadow-[#d5a22d]/20 hover:bg-white hover:scale-[1.02] transition-all active:scale-[0.98]"
                            >
                                <Mail className="w-4 h-4" />
                                Get in touch
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
