'use client';

import { Share2, Copy, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface AffiliateClientProps {
    referralLink: string;
}

export default function AffiliateClient({ referralLink }: AffiliateClientProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#1a1b41] to-brand-primary flex items-center justify-center shadow-lg shadow-indigo-900/20">
                    <Share2 className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Your Referral Link</h2>
                    <p className="text-sm text-gray-600">Share this link to start earning</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 font-mono text-sm text-[#1a1b41] overflow-x-auto select-all">
                    {referralLink}
                </div>
                <button
                    onClick={copyToClipboard}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg ${copied
                        ? 'bg-green-600 text-white shadow-green-600/20'
                        : 'bg-brand-accent hover:bg-[#b89531] text-white shadow-brand-accent/20'
                        }`}
                >
                    {copied ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-5 h-5" />
                            <span>Copy Link</span>
                        </>
                    )}
                </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Share on:</span>
                <button className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors">
                    Facebook
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors">
                    Twitter
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold transition-colors">
                    WhatsApp
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-brand-accent/10 hover:bg-brand-accent/20 text-brand-accent text-xs font-bold transition-colors">
                    Email
                </button>
            </div>
        </div>
    );
}
