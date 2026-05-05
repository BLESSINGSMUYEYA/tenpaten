'use client';

import { useState } from 'react';
import { Copy, CheckCircle2, Share2, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AffiliateQRCode from '@/components/affiliate/AffiliateQRCode';

export default function CopyReferralLink({ referralCode }: { referralCode: string }) {
    const [copied, setCopied] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);

    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://tenpaten.com'}/register?ref=${referralCode}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`Join Tenpaten using my referral link and start your journey to your dream university! ${referralLink}`)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Start your university journey with Tenpaten!`)}&url=${encodeURIComponent(referralLink)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
        email: `mailto:?subject=${encodeURIComponent('Join Tenpaten – University Applications Made Easy')}&body=${encodeURIComponent(`Hi!\n\nI'd like to invite you to join Tenpaten, the best platform for university applications.\n\nUse my referral link to sign up: ${referralLink}\n\nLet's achieve our educational goals together!`)}`,
    };

    return (
        <div className="space-y-4">
            {/* Referral link input + copy */}
            <div className="flex items-center gap-2 bg-white/10 rounded-2xl p-1.5 border border-white/20">
                <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white/90 font-mono outline-none truncate"
                />
                <div className="flex items-center gap-1.5 pr-1">
                    <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                        <DialogTrigger asChild>
                            <button
                                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                                title="Show QR Code"
                            >
                                <QrCode className="w-5 h-5" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] p-6 rounded-[2.5rem] bg-white border-none shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-[#1a1b4d] tracking-tight">Your Referral QR Code</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                                <AffiliateQRCode referralCode={referralCode} />
                            </div>
                        </DialogContent>
                    </Dialog>

                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-[#d5a22d] hover:bg-[#c49228] text-white'
                            }`}
                    >
                        {copied ? (
                            <><CheckCircle2 className="w-4 h-4" /><span>Copied!</span></>
                        ) : (
                            <><Copy className="w-4 h-4" /><span>Copy</span></>
                        )}
                    </button>
                </div>
            </div>

            {/* Social share */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Share2 className="w-3 h-3" /> Share via
                </span>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs font-bold transition-colors border border-green-500/20">
                    WhatsApp
                </a>
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold transition-colors border border-sky-500/20">
                    Twitter / X
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold transition-colors border border-blue-600/20">
                    Facebook
                </a>
                <a href={shareLinks.email}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs font-bold transition-colors border border-white/10">
                    Email
                </a>
            </div>
        </div>
    );
}
