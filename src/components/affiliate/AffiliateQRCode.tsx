'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Copy, CheckCircle2, Image as ImageIcon, FileText, Loader2, Send, Twitter, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { toPng, toJpeg } from 'html-to-image';

interface AffiliateQRCodeProps {
    referralCode: string;
    affiliateName?: string;
}

export default function AffiliateQRCode({ referralCode, affiliateName }: AffiliateQRCodeProps) {
    const [view, setView] = useState<'qr' | 'flyer'>('qr');
    const [downloading, setDownloading] = useState(false);
    const flyerRef = useRef<HTMLDivElement>(null);

    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://tenpaten.com'}/register?ref=${referralCode}&src=qr`;

    const downloadFlyer = async (format: 'png' | 'jpg') => {
        if (!flyerRef.current) return;
        setDownloading(true);
        try {
            const options = {
                quality: 0.95,
                pixelRatio: 3, // High quality (3x resolution)
                backgroundColor: '#1a1b4d',
            };

            const dataUrl = format === 'png' 
                ? await toPng(flyerRef.current, options)
                : await toJpeg(flyerRef.current, options);

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `tenpaten-flyer-${referralCode}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Flyer downloaded as ${format.toUpperCase()}`);
        } catch (error) {
            console.error('Flyer download error:', error);
            toast.error('Failed to download flyer');
        } finally {
            setDownloading(false);
        }
    };

    const downloadQR = (format: 'png' | 'svg') => {
        if (view === 'flyer') {
            downloadFlyer(format === 'png' ? 'png' : 'jpg');
            return;
        }

        setDownloading(true);
        try {
            if (format === 'svg') {
                const svg = document.getElementById('affiliate-qr-svg');
                if (!svg) return;
                const svgData = new XMLSerializer().serializeToString(svg);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `tenpaten-qr-${referralCode}.svg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                const canvas = document.getElementById('affiliate-qr-canvas') as HTMLCanvasElement;
                if (!canvas) return;
                const url = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = url;
                link.download = `tenpaten-qr-${referralCode}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            toast.success(`QR Code downloaded as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error('Failed to download QR code');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* View Switcher */}
            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl self-center">
                <button
                    onClick={() => setView('qr')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        view === 'qr' 
                        ? 'bg-white dark:bg-[#1a1b4d] text-[#1a1b4d] dark:text-[#d5a22d] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <ImageIcon className="w-4 h-4" /> Simple QR
                </button>
                <button
                    onClick={() => setView('flyer')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        view === 'flyer' 
                        ? 'bg-white dark:bg-[#1a1b4d] text-[#1a1b4d] dark:text-[#d5a22d] shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <FileText className="w-4 h-4" /> Marketing Flyer
                </button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[300px]">
                {/* Hidden export targets (always in DOM so download buttons work) */}
                <div className="hidden">
                    <QRCodeSVG
                        id="affiliate-qr-svg"
                        value={referralLink}
                        size={1024}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                            src: "/favicon.png",
                            x: undefined,
                            y: undefined,
                            height: 220,
                            width: 220,
                            excavate: true,
                        }}
                        fgColor="#1a1b4d"
                    />
                    <QRCodeCanvas
                        id="affiliate-qr-canvas"
                        value={referralLink}
                        size={1024}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                            src: "/favicon.png",
                            x: undefined,
                            y: undefined,
                            height: 220,
                            width: 220,
                            excavate: true,
                        }}
                        fgColor="#1a1b4d"
                    />
                </div>

                {view === 'qr' ? (
                    <div className="flex flex-col items-center gap-6">
                        {/* Premium QR Container with Tilt Effect and Scanning Animation */}
                        <motion.div 
                            whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                            className="relative group p-1 rounded-[2.5rem] bg-gradient-to-br from-[#d5a22d]/40 via-white/5 to-[#d5a22d]/20 shadow-2xl shadow-black/40"
                        >
                            <div className="relative p-6 bg-[#ffffff] rounded-[2.2rem] overflow-hidden">
                                {/* Scanning Line Animation */}
                                <motion.div 
                                    animate={{ 
                                        top: ["0%", "100%", "0%"],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{ 
                                        duration: 3, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d5a22d] to-transparent z-10 pointer-events-none"
                                />

                                {/* Corner Accents */}
                                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#d5a22d]/30 rounded-tl-lg" />
                                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#d5a22d]/30 rounded-tr-lg" />
                                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#d5a22d]/30 rounded-bl-lg" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#d5a22d]/30 rounded-br-lg" />

                                {/* DISPLAY: SVG */}
                                <QRCodeSVG
                                    id="affiliate-qr-main-svg"
                                    value={referralLink}
                                    size={200}
                                    level="H"
                                    includeMargin={false}
                                    imageSettings={{
                                        src: "/favicon.png",
                                        x: undefined,
                                        y: undefined,
                                        height: 35,
                                        width: 35,
                                        excavate: true,
                                    }}
                                    fgColor="#1a1b4d"
                                />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -top-2 -right-2 px-3 py-1 bg-[#d5a22d] rounded-full shadow-lg border border-white/20">
                                <span className="text-[8px] font-black text-white uppercase tracking-tighter flex items-center gap-1">
                                    <Sparkles className="w-2 h-2" /> Affiliate
                                </span>
                            </div>
                        </motion.div>

                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Referral Code</p>
                            <p className="text-2xl font-black text-[#1a1b4d] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-[#1a1b4d] to-[#36335e]">
                                {referralCode}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div ref={flyerRef} className="w-full max-w-[340px] aspect-[1/1.414] bg-[#1a1b4d] rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-2xl border border-white/10">
                        {/* Flyer background elements */}
                        <div className="absolute top-[-10%] right-[-10%] w-[150px] h-[150px] bg-[#d5a22d]/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-[-5%] left-[-5%] w-[100px] h-[100px] bg-[#36335e]/40 rounded-full blur-2xl" />
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <img src="/tenpaten-logo.png" alt="Tenpaten" className="h-8 w-auto self-start mb-6" />
                            
                            <h3 className="text-2xl font-black text-white leading-tight mb-2 italic">
                                Your Global Degree Starts Here.
                            </h3>
                            <p className="text-white/60 text-xs leading-relaxed mb-8">
                                Scan the code below to register and start your university application journey today.
                            </p>

                            <div className="flex-1 flex flex-col items-center justify-center">
                                <div className="bg-white p-3 rounded-2xl shadow-2xl">
                                    <QRCodeSVG
                                        value={referralLink}
                                        size={160}
                                        level="H"
                                        fgColor="#1a1b4d"
                                        imageSettings={{
                                            src: "/favicon.png",
                                            x: undefined,
                                            y: undefined,
                                            height: 35,
                                            width: 35,
                                            excavate: true,
                                        }}
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#d5a22d] mb-1">Referral Code</p>
                                    <p className="text-lg font-black text-white">{referralCode}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                <p className="text-[9px] text-white/40 font-medium">www.tenpaten.com</p>
                                {affiliateName && (
                                    <p className="text-[9px] text-white/70 font-bold">Ref: {affiliateName}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <Button 
                    variant="outline" 
                    onClick={() => downloadQR('png')}
                    disabled={downloading}
                    className="h-12 rounded-2xl font-bold gap-2 border-gray-200"
                >
                    {downloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {view === 'qr' ? 'PNG Image' : 'PNG Flyer'}
                </Button>
                <Button 
                    variant="outline" 
                    onClick={() => downloadQR('svg')}
                    disabled={downloading}
                    className="h-12 rounded-2xl font-bold gap-2 border-gray-200"
                >
                    {downloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {view === 'qr' ? 'SVG Vector' : 'JPG Flyer'}
                </Button>
            </div>

            {/* Social Sharing */}
            <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-2">
                    <div className="h-[1px] flex-1 bg-gray-100" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Share Link</span>
                    <div className="h-[1px] flex-1 bg-gray-100" />
                </div>
                
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={() => {
                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Join Tenpaten using my referral link and start your journey to your dream university! ${referralLink}`)}`;
                            window.open(whatsappUrl, '_blank');
                        }}
                        className="p-3 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="Share on WhatsApp"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={async () => {
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: 'Join Tenpaten',
                                        text: 'Start your university journey with Tenpaten!',
                                        url: referralLink,
                                    });
                                } catch (err) {
                                    console.log('Error sharing:', err);
                                }
                            } else {
                                await navigator.clipboard.writeText(referralLink);
                                toast.success('Link copied to clipboard!');
                            }
                        }}
                        className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="More Sharing Options"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => {
                            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Start your university journey with Tenpaten!`)}&url=${encodeURIComponent(referralLink)}`;
                            window.open(twitterUrl, '_blank');
                        }}
                        className="p-3 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
                        title="Share on X (Twitter)"
                    >
                        <Twitter className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <p className="text-[11px] text-center text-gray-500 font-medium px-8 mt-2">
                {view === 'qr' 
                    ? "Share this QR code for instant, in-person referrals." 
                    : "Screenshot this flyer to post on your status or print as a physical handout."}
            </p>
        </div>
    );
}
