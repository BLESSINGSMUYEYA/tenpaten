'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, MessageCircle, FileText, Search, GraduationCap, DollarSign, User, Share2, ClipboardList, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
    icon: React.ReactNode;
}



const faqs: FAQItem[] = [
    {
        question: "How do I start an application?",
        answer: "Go to 'Browse Universities', find your preferred institution, and click 'Apply Now' on the program that interests you. You can save your progress at any time.",
        category: "Application",
        icon: <Sparkles className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "How do I track my application status?",
        answer: "Navigate to the 'Applications' tab on your dashboard. Here you can see all your submitted, drafted, and accepted applications in real-time.",
        category: "Application",
        icon: <ClipboardList className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "How long does the review process take?",
        answer: "Initial review usually takes 3-5 business days. Universities may take 2-4 weeks for a final decision. You'll receive email notifications as your status progresses.",
        category: "Application",
        icon: <Clock className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "What documents are required?",
        answer: "Typically, you'll need academic transcripts, a personal statement, and identification (passport/ID). Check specific program requirements for extras like recommendation letters.",
        category: "Documents",
        icon: <FileText className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "Where can I find helpful guides and templates?",
        answer: "Check out the 'Resources' tab in your sidebar! We've provided comprehensive guides, document checklists, and templates to help you build a strong application.",
        category: "Documents",
        icon: <BookOpen className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "Can I edit my profile after submission?",
        answer: "Once an application is submitted, you cannot edit that specific application. However, you can update your master profile for future applications in the 'Settings' page.",
        category: "Account",
        icon: <User className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "How do I reset my password?",
        answer: "Go to Settings > Security and click on 'Change Password'. If you're locked out, use the 'Forgot Password' link on the login screen.",
        category: "Account",
        icon: <User className="w-4 h-4 text-[#36335e]" />
    },

    {
        question: "Are there scholarship opportunities?",
        answer: "Yes! Many universities offer scholarships. Look for the 'Scholarship Available' tag on programs or reach out directly to the institution.",
        category: "Colleges",
        icon: <DollarSign className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "What is the Affiliate Program?",
        answer: "Our Affiliate Program allows you to refer other students to the platform. You can apply via the 'Affiliate' tab on your dashboard to receive a referral link and track your rewards.",
        category: "Affiliate",
        icon: <Share2 className="w-4 h-4 text-[#36335e]" />
    },
    {
        question: "How do I contact a university directly?",
        answer: "Use the 'Messages' tab to send inquiries to university admissions teams once you have started an application or if they have accepted your connection request.",
        category: "Support",
        icon: <MessageCircle className="w-4 h-4 text-[#36335e]" />
    }
];

export default function DashboardFAQs() {
    const pathname = usePathname();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState('');

    const activeCategories = useMemo(() => {
        if (!pathname) return ["All"];
        if (pathname.includes('/applications')) return ["Application", "Documents"];
        if (pathname.includes('/colleges') || pathname.includes('/programs') || pathname.includes('/schools') || pathname.includes('/my-colleges')) return ["Colleges"];
        if (pathname.includes('/student-settings')) return ["Account"];
        if (pathname.includes('/affiliate') || pathname.includes('/student-rewards')) return ["Affiliate"];
        if (pathname === '/dashboard') return ["Application", "Colleges"]; // General dashboard
        return ["Support", "Application"]; // Default fallback
    }, [pathname]);

    const filteredFAQs = useMemo(() => {
        return faqs.filter(faq => {
            if (searchQuery.trim() !== '') {
                return faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            } else {
                return activeCategories.includes("All") || activeCategories.includes(faq.category) || faq.category === "Support";
            }
        });
    }, [searchQuery, activeCategories]);

    return (
        <div className="w-full min-w-0 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden h-full flex flex-col group/container hover:border-[#d5a22d]/30 transition-all duration-500">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-gray-50/80 to-white/80 flex-shrink-0 space-y-5 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d5a22d]/5 rounded-full blur-3xl group-hover/container:bg-[#d5a22d]/10 transition-colors duration-700" />
                
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#36335e] border border-[#d5a22d]/30 shadow-lg shadow-[#36335e]/20">
                            <Sparkles className="w-5 h-5 text-[#d5a22d] animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Smart Help</h3>
                            <p className="text-[10px] text-[#d5a22d] font-bold uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-[#d5a22d]" />
                                Context: {activeCategories[0] !== "All" ? activeCategories.join(' & ') : 'Dashboard'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Premium Style */}
                <div className="relative group/search z-10">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within/search:text-[#d5a22d] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for help..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 h-11 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#d5a22d]/10 focus:border-[#d5a22d] transition-all placeholder:text-gray-400 shadow-sm"
                    />
                </div>


            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/30">
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl transition-all duration-500 border overflow-hidden ${isOpen
                                    ? 'bg-white border-[#d5a22d]/20 shadow-xl shadow-gray-200/50 scale-[1.02]'
                                    : 'bg-white/60 border-gray-100 hover:border-gray-200 hover:bg-white'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full text-left p-4 sm:p-5 flex items-start gap-4 group/faq"
                                >
                                    <span className={`mt-0.5 flex-shrink-0 p-2 rounded-lg transition-colors duration-300 ${isOpen ? 'bg-[#36335e] text-[#d5a22d]' : 'bg-gray-100 text-[#36335e] group-hover/faq:bg-[#36335e]/5'}`}>
                                        {faq.icon}
                                    </span>
                                    <span className="flex-1 text-[15px] font-bold text-gray-800 leading-snug pt-1">
                                        {faq.question}
                                    </span>
                                    <span className={`mt-1 flex-shrink-0 p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#d5a22d] text-white' : 'text-gray-400'}`}>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5 pt-0 ml-[52px]">
                                        <div className="h-px bg-gradient-to-r from-gray-100 to-transparent mb-4" />
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2 duration-500">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 px-4">
                        <div className="bg-white w-16 h-16 rounded-2xl shadow-inner border border-gray-100 flex items-center justify-center mx-auto mb-4 group/empty">
                            <Search className="w-6 h-6 text-gray-300 group-hover/empty:scale-110 transition-transform duration-500" />
                        </div>
                        <h4 className="text-base font-black text-gray-900">No results found</h4>
                        <p className="text-xs text-gray-500 mt-1.5 font-medium max-w-[200px] mx-auto">Try searching for keywords like "application" or "documents"</p>
                    </div>
                )}
            </div>

            <div className="p-5 bg-white border-t border-gray-100 flex-shrink-0 flex items-center gap-3">
                <a
                    href="/dashboard/resources"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-700 hover:border-[#d5a22d] hover:text-[#d5a22d] transition-all duration-300 shadow-sm"
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    RESOURCES
                </a>
                <a
                    href="/dashboard/messages"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#36335e] border border-transparent rounded-xl text-xs font-black text-white hover:bg-[#2e2f5d] transition-all duration-300 shadow-lg shadow-[#36335e]/20 group/contact"
                >
                    <MessageCircle className="w-3.5 h-3.5 text-[#d5a22d] group-hover:rotate-12 transition-transform" />
                    CONTACT US
                </a>
            </div>
        </div>
    );
}
