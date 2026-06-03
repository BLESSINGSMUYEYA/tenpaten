'use client';

import { useState } from 'react';
import { Copy, Check, QrCode, Share2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SchoolQRCode from './SchoolQRCode';
import { toast } from 'sonner';

interface CopySchoolLinkProps {
    universityId: string;
    universityName: string;
    slug: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tenpaten.com';

export default function CopySchoolLink({ universityId, universityName, slug }: CopySchoolLinkProps) {
    const [copied, setCopied] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [modalEditMode, setModalEditMode] = useState(false);

    const shortUrl = slug ? `${BASE_URL}/s/${slug}` : null;
    const displayUrl = slug ? `tenpaten.com/s/${slug}` : 'No short URL set';

    const handleOpenQR = (editMode = false) => {
        setModalEditMode(editMode);
        setQrOpen(true);
    };

    const handleCopy = async () => {
        if (!shortUrl) {
            toast.error('Please set a short URL first');
            return;
        }
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            toast.success('Link copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Marketing Link</h4>
                <p className="text-xs text-slate-500 font-medium">Share this link or QR code to drive applications.</p>
            </div>

            <div className="space-y-3">
                {/* Link Area */}
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-100 focus-within:border-brand-primary/30 transition-all">
                    <div className="flex-1 px-4 py-2 text-sm font-bold text-brand-primary truncate font-mono bg-white/50 rounded-xl border border-slate-100/50">
                        {displayUrl}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                            <DialogTrigger asChild>
                                <button
                                    onClick={() => handleOpenQR(false)}
                                    className="p-2.5 rounded-xl bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary transition-all border border-brand-primary/10 group"
                                    title="Show QR Code"
                                >
                                    <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-none shadow-none overflow-visible">
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Marketing QR Code</DialogTitle>
                                    <DialogDescription>
                                        Scan or download the marketing QR code for {universityName}.
                                    </DialogDescription>
                                </DialogHeader>
                                <SchoolQRCode 
                                    universityId={universityId} 
                                    universityName={universityName} 
                                    slug={slug} 
                                    initialEditMode={modalEditMode}
                                />
                            </DialogContent>
                        </Dialog>

                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap shadow-sm ${
                                copied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-brand-accent hover:bg-[#b89531] text-white hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                        >
                            {copied ? (
                                <><Check className="w-3.5 h-3.5" /><span>Done</span></>
                            ) : (
                                <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => handleOpenQR(true)}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:text-[#b89531] transition-colors"
                        >
                            Customize Link
                        </button>
                        <div className="w-[1px] h-3 bg-slate-100" />
                        <button 
                            onClick={() => {
                                if (!shortUrl) return;
                                window.open(`https://wa.me/?text=${encodeURIComponent(`Check out ${universityName} on Tenpaten! ${shortUrl}`)}`, '_blank');
                            }}
                            className="text-slate-400 hover:text-emerald-500 transition-colors"
                            title="Share on WhatsApp"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                        </button>
                        {shortUrl && (
                            <a 
                                href={shortUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-brand-accent transition-colors"
                                title="Open Link"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                    {!slug && (
                        <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest animate-pulse">
                            Setup Required
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
