'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Globe, Phone, MapPin, ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles, ImageIcon, UploadCloud, Trash2, Wallet } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { updateUniversityProfileJson, createUniversityInitial } from '@/lib/actions/university';
import { Country } from '@prisma/client';

interface UniversityProfileFormProps {
    university: any;
    countries?: Country[];
    isNew?: boolean;
    universityId?: string;
}

export default function UniversityProfileForm({ university, countries = [], isNew = false, universityId }: UniversityProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [transitionText, setTransitionText] = useState('Securing your institutional profile...');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Orchestrate transition text changes
    useEffect(() => {
        if (isRedirecting) {
            const timer = setTimeout(() => {
                setTransitionText('Calibrating your dashboard...');
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isRedirecting]);

    const [formData, setFormData] = useState({
        name: university?.name || '',
        description: university?.description || '',
        website: university?.website || '',
        logo: university?.logo || '',
        images: university?.images || [],
        tuition: university?.tuition || '',
        phone: university?.phone || '',
        countryId: university?.countryId || '',
        applicationFeeAmount: university?.applicationFeeAmount ?? null,
        applicationFeeCurrency: university?.applicationFeeCurrency || 'MWK',
        bankName: university?.bankName || '',
        accountNumber: university?.accountNumber || '',
        accountName: university?.accountName || '',
        mobileMoneyNumber: university?.mobileMoneyNumber || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            let result;
            if (isNew) {
                // Simplified creation: Name, Country, Website, Phone, Desc
                result = await createUniversityInitial({
                    name: formData.name,
                    countryId: formData.countryId,
                    description: formData.description,
                    website: formData.website,
                    phone: formData.phone,
                    // Logo and images are NOT sent during initial simple registration
                });
            } else {
                result = await updateUniversityProfileJson(formData, universityId);
            }

            if (result.success) {
                setMessage({ type: 'success', text: result.success as string });
                if (isNew) {
                    // Start the smooth transition "bridge"
                    setIsRedirecting(true);
                    
                    // Controlled delay to allow the animation to play before the jump
                    setTimeout(() => {
                        router.push('/dashboard/school');
                    }, 1600);
                } else {
                    router.refresh();
                    setIsLoading(false);
                }
            } else if (result.error) {
                setMessage({ type: 'error', text: result.error as string });
                setIsLoading(false);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
            setIsLoading(false);
        }
    };

    const removeImage = (url: string) => {
        setFormData({ ...formData, images: formData.images.filter((img: string) => img !== url) });
    };


    return (
        <>
            <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
            {/* Brand accent bar */}
            <div className="h-1 w-full bg-linear-to-r from-brand-primary via-brand-accent to-brand-primary" />

            {/* Form header */}
            <div className="px-8 pt-7 pb-6 md:px-10 md:pt-8 bg-white">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-linear-to-br from-brand-primary to-[#4f4b8a] flex items-center justify-center shadow-lg shadow-brand-primary/20">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base font-black text-[#1a1b41] tracking-tight leading-tight">
                            {isNew ? 'Institutional Registration' : 'Edit Profile'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
                            {isNew
                                ? "Enter your institution's core details to apply for verification."
                                : "Manage and update your institution's public profile and gallery."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-10 bg-white">
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="space-y-3 md:col-span-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">University Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Tenpaten Apply University"
                                className="h-14 text-lg border-slate-100 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-bold placeholder:text-slate-300 text-brand-primary"
                            />
                        </div>

                        {isNew && (
                            <div className="space-y-3 md:col-span-2">
                                <Label htmlFor="countryId" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Country of Origin</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-accent">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        id="countryId"
                                        required
                                        value={formData.countryId}
                                        onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
                                        className="h-14 w-full pl-14 pr-4 border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-bold text-slate-700 appearance-none cursor-pointer outline-none hover:bg-white"
                                    >
                                        <option value="">Select institution country...</option>
                                        {countries.map((country: Country) => (
                                            <option key={country.id} value={country.id}>{country.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <Label htmlFor="website" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Official Website</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-brand-accent">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <Input
                                    id="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://www.university.edu"
                                    className="h-14 pl-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Phone</Label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 transition-colors group-focus-within:text-brand-accent">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (234) 567-8900"
                                    className="h-14 pl-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-bold text-slate-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-3 md:col-span-2">
                            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mission Statement / About</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your university's history, values, and academic excellence..."
                                className="min-h-[160px] border-slate-100 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-medium py-5 px-6 leading-relaxed text-slate-700 resize-none"
                            />
                        </div>

                        {!isNew && (
                            <>
                                {/* Extended fields only shown when editing an EXISTING profile (post-approval) */}
                                <div className="space-y-3">
                                    <Label htmlFor="tuition" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">General Tuition Range</Label>
                                    <Input
                                        id="tuition"
                                        value={formData.tuition}
                                        onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                                        placeholder="e.g., $10,000 - $25,000 per academic year"
                                        className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-bold text-slate-700"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="applicationFeeAmount" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Application Fee</Label>
                                    <div className="flex gap-2">
                                        <div className="relative group w-28 shrink-0">
                                            <select
                                                id="applicationFeeCurrency"
                                                value={formData.applicationFeeCurrency}
                                                onChange={(e) => setFormData({ ...formData, applicationFeeCurrency: e.target.value })}
                                                className="h-14 w-full pl-4 pr-6 border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-bold text-slate-700 appearance-none cursor-pointer outline-none hover:bg-white"
                                            >
                                                <option value="MWK">MWK</option>
                                                <option value="USD">USD</option>
                                                <option value="ZAR">ZAR</option>
                                                <option value="GBP">GBP</option>
                                            </select>
                                        </div>
                                        <Input
                                            id="applicationFeeAmount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.applicationFeeAmount ?? ''}
                                            onChange={(e) => setFormData({ ...formData, applicationFeeAmount: e.target.value === '' ? null : Number(e.target.value) })}
                                            placeholder="Fee amount (e.g., 50.00)"
                                            className="h-14 flex-1 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10 rounded-2xl transition-all font-bold text-slate-700"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium ml-1">Leave empty or 0 for free applications. Note: Standard platform fees may apply to transactions.</p>
                                </div>

                                <div className="md:col-span-2 pt-8 border-t border-slate-100 space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-brand-primary">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider">Payout Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100">
                                        <div className="space-y-3">
                                            <Label htmlFor="bankName" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Bank Name</Label>
                                            <Input
                                                id="bankName"
                                                value={formData.bankName}
                                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                                placeholder="e.g., National Bank of Malawi"
                                                className="h-12 border-slate-100 bg-white focus:border-brand-accent rounded-xl font-bold text-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="accountName" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Holder Name</Label>
                                            <Input
                                                id="accountName"
                                                value={formData.accountName}
                                                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                                                placeholder="Official Institution Name"
                                                className="h-12 border-slate-100 bg-white focus:border-brand-accent rounded-xl font-bold text-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="accountNumber" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Number</Label>
                                            <Input
                                                id="accountNumber"
                                                value={formData.accountNumber}
                                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                placeholder="Enter full account number"
                                                className="h-12 border-slate-100 bg-white focus:border-brand-accent rounded-xl font-bold text-slate-700"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="mobileMoneyNumber" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mobile Money Number (Optional)</Label>
                                            <Input
                                                id="mobileMoneyNumber"
                                                value={formData.mobileMoneyNumber}
                                                onChange={(e) => setFormData({ ...formData, mobileMoneyNumber: e.target.value })}
                                                placeholder="e.g., 265999000000"
                                                className="h-12 border-slate-100 bg-white focus:border-brand-accent rounded-xl font-bold text-slate-700"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="p-4 bg-indigo-50/50 rounded-2xl flex items-start gap-4">
                                                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                                    Tenpaten processes payouts to the details provided above. Please ensure these match your official financial documentation to avoid delays.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 md:col-span-2 pt-8 border-t border-slate-100">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Institutional Branding</Label>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-brand-primary/20 hover:bg-brand-primary/5 transition-colors">
                                        <div className="h-28 w-28 rounded-3xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                                            {formData.logo ? (
                                                <img src={formData.logo} alt="Logo" className="h-full w-full object-contain p-4" />
                                            ) : (
                                                <Building2 className="w-10 h-10 text-slate-300" />
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">University Logo</h4>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">SQUARE PNG OR JPG, MIN 400X400PX</p>
                                            </div>
                                            <CldUploadWidget
                                                uploadPreset="tenpaten_uploads"
                                                options={{ maxFiles: 1, folder: `tenpaten/universities/${university?.id}/branding` }}
                                                onSuccess={(result: any) => {
                                                    if (result?.info?.secure_url) setFormData(prev => ({ ...prev, logo: result.info.secure_url }));
                                                }}
                                            >
                                                {({ open }) => (
                                                    <Button type="button" onClick={() => open()} variant="outline" className="font-bold rounded-xl h-10 border-slate-300 hover:border-brand-primary hover:text-brand-primary">
                                                        <UploadCloud className="w-4 h-4 mr-2" />
                                                        Upload New Logo
                                                    </Button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 md:col-span-2 pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Campus Gallery</Label>
                                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{formData.images.length} photos</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.images.map((url: string, index: number) => (
                                            <div key={index} className="relative aspect-video rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-all">
                                                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(url)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <CldUploadWidget
                                            uploadPreset="tenpaten_uploads"
                                            options={{ multiple: true, folder: `tenpaten/universities/${university?.id}/gallery` }}
                                            onSuccess={(result: any) => {
                                                if (result?.info?.secure_url) setFormData(prev => ({ ...prev, images: [...prev.images, result.info.secure_url] }));
                                            }}
                                        >
                                            {({ open }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => open()}
                                                    className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-brand-primary/5 hover:border-brand-accent hover:text-brand-primary flex flex-col items-center justify-center text-slate-400 transition-all group"
                                                >
                                                    <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                                        <ImageIcon className="w-5 h-5 text-brand-accent" />
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-brand-primary">Add Photo</span>
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-50/60 backdrop-blur-xl border-t border-slate-100">
                {message && (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold mb-4 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'} animate-in slide-in-from-bottom-2`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                        {message.text}
                    </div>
                )}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-13 px-8 bg-linear-to-r from-brand-accent to-[#b88e24] hover:from-[#b88e24] hover:to-[#9c781e] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-accent/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-sm"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white flex-shrink-0" />
                    ) : (
                        <span className="flex items-center justify-center gap-3">
                            {isNew ? 'Submit Application' : 'Save Changes'}
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                        </span>
                    )}
                </Button>
            </div>
        </form>

        {/* High-Fidelity Transition Overlay */}
        <AnimatePresence>
            {isRedirecting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1b41]/80 backdrop-blur-xl"
                >
                    <div className="max-w-md w-full px-6 text-center space-y-8">
                        {/* Animated Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ 
                                scale: [0.8, 1.1, 1],
                                opacity: 1,
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                duration: 1,
                                times: [0, 0.4, 0.7, 1],
                                repeat: Infinity,
                                repeatDelay: 0.5
                            }}
                            className="w-24 h-24 bg-linear-to-br from-brand-accent to-[#f0c84e] rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-brand-accent/30"
                        >
                            <Building2 className="w-12 h-12 text-[#1a1b41]" />
                        </motion.div>

                        {/* Animated Text */}
                        <div className="space-y-4">
                            <motion.h3
                                key={transitionText}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-2xl font-black text-white tracking-tight"
                            >
                                {transitionText}
                            </motion.h3>
                            
                            <div className="flex justify-center gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ 
                                            scale: [1, 1.5, 1],
                                            opacity: [0.3, 1, 0.3]
                                        }}
                                        transition={{ 
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                        className="w-1.5 h-1.5 rounded-full bg-brand-accent"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Bottom Brand */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="pt-12"
                        >
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent/60">
                                Tenpaten Apply · Global Network
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
);
}
