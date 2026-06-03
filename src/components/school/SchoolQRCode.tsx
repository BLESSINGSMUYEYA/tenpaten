'use client';

import { useRef, useState, useTransition, useCallback } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Copy, Check, Edit2, X, Loader2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { updateUniversitySlug, checkSlugAvailability } from '@/lib/actions/university';

interface SchoolQRCodeProps {
    universityId: string;
    universityName: string;
    slug: string | null;
    initialEditMode?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tenpaten.com';

export default function SchoolQRCode({ universityId, universityName, slug: initialSlug, initialEditMode = false }: SchoolQRCodeProps) {
    const [slug, setSlug] = useState(initialSlug);
    const [editMode, setEditMode] = useState(initialEditMode);
    const [draftSlug, setDraftSlug] = useState(initialSlug ?? '');
    const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const checkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const shortUrl = slug ? `${BASE_URL}/s/${slug}` : null;
    const displayUrl = slug ? `tenpaten.com/s/${slug}` : null;

    // ── Slug availability check (debounced) ──────────────────────────────────
    const handleDraftChange = useCallback((value: string) => {
        const v = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setDraftSlug(v);
        setSaveError(null);

        if (checkTimeout.current) clearTimeout(checkTimeout.current);
        if (v.length < 3) { setSlugStatus('idle'); return; }

        setSlugStatus('checking');
        checkTimeout.current = setTimeout(async () => {
            const res = await checkSlugAvailability(v, universityId);
            if (!res.available && res.reason === 'Invalid format') {
                setSlugStatus('invalid');
            } else {
                setSlugStatus(res.available ? 'available' : 'taken');
            }
        }, 450);
    }, [universityId]);

    // ── Save slug ─────────────────────────────────────────────────────────────
    const handleSave = () => {
        setSaveError(null);
        startTransition(async () => {
            const res = await updateUniversitySlug(draftSlug, universityId);
            if (res.error) {
                setSaveError(res.error);
            } else {
                setSlug(draftSlug);
                setEditMode(false);
                setSlugStatus('idle');
            }
        });
    };

    const cancelEdit = () => {
        setDraftSlug(slug ?? '');
        setSlugStatus('idle');
        setSaveError(null);
        setEditMode(false);
    };

    // ── Download QR (High Resolution) ──────────────────────────────────────────
    const handleDownload = () => {
        if (!shortUrl) return;

        // Create a hidden canvas for high-res generation
        const canvas = document.createElement('canvas');
        const size = 1024; // 4x scale for print quality
        canvas.width = size;
        canvas.height = size;
        
        // We use the QRCodeCanvas component's internal logic manually or just 
        // find a way to render a hidden one.
        // Easiest reliable way: grab the hidden canvas we'll add to the DOM briefly
        const hiddenContainer = document.createElement('div');
        hiddenContainer.style.display = 'none';
        document.body.appendChild(hiddenContainer);

        // We can't easily "render" a React component to a canvas synchronously here 
        // without complex setup, but qrcode.react exposes its canvas.
        // Alternative: Use the existing canvas approach but ensure it's rendered high-res.
        const liveCanvas = document.querySelector<HTMLCanvasElement>('#school-qr-canvas-hidden');
        if (!liveCanvas) return;

        const link = document.createElement('a');
        link.download = `${slug ?? universityId}-qr-highres.png`;
        link.href = liveCanvas.toDataURL('image/png', 1.0);
        link.click();
    };

    // ── Copy link ─────────────────────────────────────────────────────────────
    const handleCopy = async () => {
        if (!shortUrl) return;
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Slug status colours ───────────────────────────────────────────────────
    const statusColour = {
        idle: '',
        checking: 'text-gray-400',
        available: 'text-emerald-500',
        taken: 'text-rose-400',
        invalid: 'text-amber-400',
    }[slugStatus];

    const statusLabel = {
        idle: '',
        checking: 'Checking…',
        available: '✓ Available',
        taken: '✗ Already taken',
        invalid: '✗ Invalid format',
    }[slugStatus];

    return (
        <div className="rounded-[2.5rem] bg-[#23244a] border border-white/8 p-8 space-y-7 shadow-2xl">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-accent">Marketing Kit</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Your QR Code & Short URL</h2>
                <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                    Share on posters, Instagram, and your prospectus — it leads students directly to your programs page.
                </p>
            </div>

            {!slug ? (
                <div className="flex flex-col items-center gap-5 py-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-brand-accent/60" />
                    </div>
                    <div className="text-center">
                        <p className="text-white font-bold mb-1">No short URL yet</p>
                        <p className="text-xs text-gray-400 max-w-xs">
                            Set a short URL below to generate your branded QR code.
                        </p>
                    </div>
                    <button
                        onClick={() => setEditMode(true)}
                        className="px-6 py-3 bg-brand-accent text-white rounded-xl text-sm font-black hover:bg-[#b89531] transition-all"
                    >
                        Set Short URL
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-8">
                    {/* Premium QR Container with Tilt Effect and Scanning Animation */}
                    <motion.div 
                        whileHover={{ scale: 1.02, rotateY: 5, rotateX: 5 }}
                        className="relative group p-1 rounded-[2.5rem] bg-linear-to-br from-brand-accent/40 via-white/5 to-brand-accent/20 shadow-2xl shadow-black/40"
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
                                className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-brand-accent to-transparent z-10 pointer-events-none"
                            />

                            {/* Corner Accents */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-brand-accent/30 rounded-tl-lg" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-brand-accent/30 rounded-tr-lg" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-brand-accent/30 rounded-bl-lg" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-brand-accent/30 rounded-br-lg" />

                            {/* DISPLAY: SVG (Razor sharp on all screens) */}
                            <QRCodeSVG
                                value={shortUrl!}
                                size={200}
                                level="H"
                                bgColor="#ffffff"
                                fgColor="#1a1b41"
                                imageSettings={{
                                    src: '/tenpaten-logo-navy.png',
                                    height: 24,
                                    width: 70,
                                    excavate: true,
                                }}
                            />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-brand-accent rounded-full shadow-lg border border-white/20">
                            <span className="text-[9px] font-black text-white uppercase tracking-tighter flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Official
                            </span>
                        </div>
                    </motion.div>

                    {/* HIDDEN: High-Res Canvas for Downloads */}
                    <div className="hidden">
                        <QRCodeCanvas
                            id="school-qr-canvas-hidden"
                            value={shortUrl!}
                            size={1024} // Native 1024px resolution
                            level="H"
                            bgColor="#ffffff"
                            fgColor="#1a1b41"
                            imageSettings={{
                                src: '/tenpaten-logo-navy.png',
                                height: 112, // Scaled for 1024
                                width: 320,  // Scaled for 1024
                                excavate: true,
                            }}
                        />
                    </div>

                    {/* Short URL display */}
                    <div className="text-center space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Link</p>
                        <a
                            href={shortUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-brand-accent font-black text-lg hover:underline decoration-2 underline-offset-4"
                        >
                            {displayUrl}
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4 w-full">
                        <button
                            onClick={handleDownload}
                            className="flex-[2] flex items-center justify-center gap-2 py-4 bg-linear-to-r from-brand-accent to-[#b89531] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-accent/20 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Download className="w-4 h-4" />
                            Download Kit
                        </button>
                        <button
                            onClick={handleCopy}
                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                        >
                            <AnimatePresence mode="wait">
                                {copied ? (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                    >
                                        <Check className="w-4 h-4 text-emerald-400" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="copy"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {copied ? 'Done!' : 'Copy'}
                        </button>
                    </div>
                </div>
            )}

            {/* Slug editor */}
            <div className="border-t border-white/8 pt-6 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Short URL</span>
                    {!editMode && slug && (
                        <button
                            onClick={() => { setEditMode(true); setDraftSlug(slug); }}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:text-[#b89531] transition-colors"
                        >
                            <Edit2 className="w-3 h-3" />
                            Customize
                        </button>
                    )}
                </div>

                {editMode ? (
                    <div className="space-y-3">
                        <div className="flex items-center bg-[#1a1b41] rounded-2xl border border-white/10 overflow-hidden focus-within:border-brand-accent/50 transition-colors">
                            <span className="pl-4 text-xs text-gray-500 font-bold whitespace-nowrap">tenpaten.com/s/</span>
                            <input
                                type="text"
                                value={draftSlug}
                                onChange={e => handleDraftChange(e.target.value)}
                                placeholder="my-university"
                                maxLength={60}
                                className="flex-1 bg-transparent px-2 py-3.5 text-sm font-bold text-white outline-none placeholder:text-gray-600"
                                autoFocus
                            />
                            {slugStatus !== 'idle' && (
                                <span className={`pr-4 text-[10px] font-black ${statusColour}`}>{statusLabel}</span>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">3–60 characters, lowercase only.</p>

                        {saveError && (
                            <p className="text-xs text-rose-400 font-bold flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5" /> {saveError}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isPending || slugStatus === 'taken' || slugStatus === 'invalid' || slugStatus === 'checking' || draftSlug.length < 3}
                                className="flex-1 py-3 bg-brand-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#b89531] transition-all disabled:opacity-40"
                            >
                                {isPending ? 'Saving…' : 'Save URL'}
                            </button>
                            <button
                                onClick={cancelEdit}
                                disabled={isPending}
                                className="px-5 py-3 bg-white/5 text-gray-400 rounded-xl text-xs font-black hover:bg-white/10 transition-all border border-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="px-4 py-3 bg-[#1a1b41] rounded-2xl border border-white/8 text-sm font-bold text-gray-400">
                        {slug ? (
                            <span className="text-white">tenpaten.com/s/<span className="text-brand-accent">{slug}</span></span>
                        ) : (
                            <span className="text-gray-600 italic">Not set</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
