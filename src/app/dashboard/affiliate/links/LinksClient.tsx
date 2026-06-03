'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, Share2, Link2, MessageCircle, Mail, Globe } from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tenpaten.com';

interface LinksPageClientProps {
    referralCode: string;
}

function LinksTool({ referralCode }: LinksPageClientProps) {
    const [copied, setCopied] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : APP_URL);
    const referralLink = `${BASE_URL}/register?ref=${referralCode}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { /* noop */ }
    };

    const shareLinks = [
        {
            label: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
            iconCls: 'text-green-600',
            href: `https://wa.me/?text=${encodeURIComponent(`Hey! Join Tenpaten and start your university journey. Sign up with my link: ${referralLink}`)}`,
        },
        {
            label: 'Twitter / X',
            icon: Globe,
            color: 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100',
            iconCls: 'text-sky-500',
            href: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Start your university journey with Tenpaten!')}&url=${encodeURIComponent(referralLink)}`,
        },
        {
            label: 'Facebook',
            icon: Share2,
            color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
            iconCls: 'text-blue-600',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
        },
        {
            label: 'Email',
            icon: Mail,
            color: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
            iconCls: 'text-gray-500',
            href: `mailto:?subject=${encodeURIComponent('Join Tenpaten – University Applications Made Easy')}&body=${encodeURIComponent(`Hi!\n\nI'd like to invite you to join Tenpaten.\n\nSign up with my link: ${referralLink}`)}`,
        },
    ];

    const tips = [
        { title: 'Share in Study Groups', body: 'Post your link in WhatsApp, Telegram, or Facebook study groups where students are looking for university opportunities.' },
        { title: 'Use Social Media', body: 'Create a short post on Instagram, Twitter or TikTok about your experience with Tenpaten and include your referral link in the bio.' },
        { title: 'Word of Mouth', body: "Tell friends and family directly. Personal recommendations have the highest conversion rates — don't underestimate them." },
        { title: 'Blog or Newsletter', body: 'If you write a blog or send newsletters, include your referral link with a short description of Tenpaten\'s benefits.' },
    ];

    return (
        <div className="space-y-6">
            {/* Referral Link Card */}
            <div className="bg-linear-to-br from-brand-primary to-brand-primary-hover rounded-2xl p-6 text-white space-y-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                        <Link2 className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div>
                        <h3 className="text-base font-black">Your Referral Link</h3>
                        <p className="text-xs text-white/50">Share this link anywhere</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1.5 border border-white/10">
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-white/80 font-mono outline-none truncate"
                    />
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white' : 'bg-brand-accent hover:bg-[#c49228] text-white'
                            }`}
                    >
                        {copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                    </button>
                </div>
            </div>

            {/* Social Share Buttons */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Share On</h4>
                <div className="grid grid-cols-2 gap-3">
                    {shareLinks.map(s => {
                        const Icon = s.icon;
                        return (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border font-bold text-sm transition-all ${s.color}`}
                            >
                                <Icon className={`w-5 h-5 ${s.iconCls}`} />
                                {s.label}
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tips for Sharing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tips.map(tip => (
                        <div key={tip.title} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="text-sm font-black text-brand-primary mb-1">{tip.title}</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{tip.body}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LinksTool;
