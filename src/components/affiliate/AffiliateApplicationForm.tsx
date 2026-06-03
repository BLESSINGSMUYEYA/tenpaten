'use client';

import { useActionState, useState } from 'react';
import { joinAffiliateProgram } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CreditCard, User, Globe, FileText, Upload, CheckCircle2, X, Camera, Info, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

interface UploadedImage {
    url: string;
    publicId: string;
    name: string;
}

interface Country {
    id: string;
    name: string;
}

export default function AffiliateApplicationForm({ countries }: { countries: Country[] }) {
    const [state, formAction, isPending] = useActionState(joinAffiliateProgram, undefined);
    const [currentStep, setCurrentStep] = useState(1);

    const [idFront, setIdFront] = useState<UploadedImage | null>(null);
    const [idBack, setIdBack] = useState<UploadedImage | null>(null);
    const [idSelfie, setIdSelfie] = useState<UploadedImage | null>(null);
    const [selectedCountryId, setSelectedCountryId] = useState<string>('');
    const [idNumber, setIdNumber] = useState<string>('');

    const [bankName, setBankName] = useState<string>('');
    const [accountName, setAccountName] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [swiftCode, setSwiftCode] = useState<string>('');
    const [rewardType, setRewardType] = useState<string>('CASH');

    const isStep1Valid = !!selectedCountryId && !!idNumber;
    const isStep2Valid = !!idFront && !!idBack && !!idSelfie;
    const allUploaded = isStep2Valid && !!selectedCountryId;

    const handleUploadSuccess = (setter: (img: UploadedImage) => void) => (result: any) => {
        const info = result?.info;
        if (info) {
            setter({
                url: info.secure_url,
                publicId: info.public_id,
                name: info.original_filename || 'uploaded_image',
            });
        }
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    return (
        <Card className="w-full max-w-5xl mx-auto border-none shadow-2xl shadow-brand-primary/10 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-brand-primary text-white p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <SparkleIcon className="w-3 h-3" />
                        Executive Partnership
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight mb-1">Affiliate Application</CardTitle>
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`h-1.5 rounded-full transition-all duration-500 ${currentStep >= step ? 'w-8 bg-brand-accent' : 'w-4 bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <form action={formAction} className="space-y-6">
                    {/* Hidden Fields for Uploaded Images/Country ID always present */}
                    <input type="hidden" name="idType" value="SCHOOL_ID" />
                    <input type="hidden" name="idFrontUrl" value={idFront?.url || ''} />
                    <input type="hidden" name="idFrontPublicId" value={idFront?.publicId || ''} />
                    <input type="hidden" name="idFrontName" value={idFront?.name || ''} />
                    <input type="hidden" name="idBackUrl" value={idBack?.url || ''} />
                    <input type="hidden" name="idBackPublicId" value={idBack?.publicId || ''} />
                    <input type="hidden" name="idBackName" value={idBack?.name || ''} />
                    <input type="hidden" name="idSelfieUrl" value={idSelfie?.url || ''} />
                    <input type="hidden" name="idSelfiePublicId" value={idSelfie?.publicId || ''} />
                    <input type="hidden" name="idSelfieName" value={idSelfie?.name || ''} />
                    <input type="hidden" name="countryId" value={selectedCountryId} />
                    <input type="hidden" name="idNumber" value={idNumber} />
                    <input type="hidden" name="bankName" value={bankName} />
                    <input type="hidden" name="accountName" value={accountName} />
                    <input type="hidden" name="accountNumber" value={accountNumber} />
                    <input type="hidden" name="swiftCode" value={swiftCode} />
                    <input type="hidden" name="rewardType" value={rewardType} />

                    {/* Step 1: Regional & Basic Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight">Regional Protocol</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 1 of 3</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="idNumberInput" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">School ID Number *</Label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                                    <Input
                                        id="idNumberInput"
                                        value={idNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
                                        placeholder="Enter your School ID number"
                                        className="h-14 pl-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="country" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operating Country *</Label>
                                <Select onValueChange={setSelectedCountryId} value={selectedCountryId}>
                                    <SelectTrigger className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl font-bold text-brand-primary transition-all">
                                        <SelectValue placeholder="Select your operating country" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 p-2">
                                        {countries.map((country) => (
                                            <SelectItem key={country.id} value={country.id} className="rounded-xl font-bold p-3 focus:bg-brand-primary/5 focus:text-brand-primary">
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={!isStep1Valid}
                                className="w-full h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all flex items-center justify-center gap-3"
                            >
                                Continue To Verification
                                <ArrowRight className="w-5 h-5 text-brand-accent" />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Identification Uploads */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight">Identity Authentication</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 2 of 3</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <UploadSlot
                                    label="Front of ID"
                                    description="Clear photo of the front"
                                    image={idFront}
                                    setImage={setIdFront}
                                    handleUploadSuccess={handleUploadSuccess}
                                />
                                <UploadSlot
                                    label="Back of ID"
                                    description="Clear photo of the back"
                                    image={idBack}
                                    setImage={setIdBack}
                                    handleUploadSuccess={handleUploadSuccess}
                                />
                                <UploadSlot
                                    label="Selfie with ID"
                                    description="Face + ID visible"
                                    image={idSelfie}
                                    setImage={setIdSelfie}
                                    handleUploadSuccess={handleUploadSuccess}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="h-12 border-slate-200 text-slate-500 font-bold px-6 rounded-xl"
                                >
                                    Modify Info
                                </Button>
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isStep2Valid}
                                    className="flex-1 h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl transition-all flex items-center justify-center gap-3"
                                >
                                    Proceed To Settlement
                                    <ArrowRight className="w-5 h-5 text-brand-accent" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Banking & Final Submission */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight">Settlement Channel</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 3 of 3</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label htmlFor="bankNameInput" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Name *</Label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                                        <Input
                                            id="bankNameInput"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            placeholder="e.g. Chase Bank"
                                            className="h-14 pl-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="accountNameInput" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder *</Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                                        <Input
                                            id="accountNameInput"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            placeholder="Full Name on Account"
                                            className="h-14 pl-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="accountNumberInput" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number / IBAN *</Label>
                                <div className="relative group">
                                    <CreditCard className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                                    <Input
                                        id="accountNumberInput"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="Account Number or IBAN"
                                        className="h-14 pl-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label htmlFor="swiftCodeInput" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SWIFT / BIC Code</Label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                                        <Input
                                            id="swiftCodeInput"
                                            value={swiftCode}
                                            onChange={(e) => setSwiftCode(e.target.value)}
                                            placeholder="Optional for local"
                                            className="h-14 pl-12 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl transition-all font-bold text-brand-primary placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="rewardTypeInput" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Reward</Label>
                                    <Select onValueChange={setRewardType} value={rewardType}>
                                        <SelectTrigger id="rewardTypeInput" className="h-14 border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-brand-accent focus:border-transparent rounded-2xl font-bold text-brand-primary transition-all">
                                            <SelectValue placeholder="Select reward type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 p-2">
                                            <SelectItem value="CASH" className="rounded-xl font-bold p-3 focus:bg-brand-primary/5 focus:text-brand-primary">Cash Transfer</SelectItem>
                                            <SelectItem value="TUITION_DISCOUNT" className="rounded-xl font-bold p-3 focus:bg-brand-primary/5 focus:text-brand-primary">Tuition Discount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Info className="w-16 h-16 text-brand-primary" />
                                </div>
                                <h4 className="font-black text-brand-primary uppercase tracking-widest text-xs mb-2">Partnership Protocol</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    By submitting this application, you agree to our Affiliate Terms. Your credentials will undergo a formal verification process taking <span className="text-brand-primary font-bold">24-48 business hours</span>.
                                </p>
                            </div>

                            {state && (
                                <div className={`p-5 rounded-2xl border font-bold text-sm animate-in fade-in slide-in-from-top-2 ${state.includes('Success') || state.includes('submitted') ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                                    {state.includes('Success') || state.includes('submitted') ? <CheckCircle2 className="w-4 h-4 inline mr-2" /> : <X className="w-4 h-4 inline mr-2" />}
                                    {state}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="h-12 border-slate-200 text-slate-500 font-bold px-6 rounded-xl"
                                >
                                    Back to Docs
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 h-12 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-xl shadow-brand-primary/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                                    disabled={isPending || !allUploaded}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-3 animate-spin text-brand-accent" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <span className="flex items-center gap-3">
                                            Finalize Application
                                            <ArrowRight className="w-5 h-5 text-brand-accent" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-slate-50 py-4 bg-slate-50/50">
                <Link href="/dashboard/affiliate" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 rotate-180" />
                    Return to Affiliate Hub
                </Link>
            </CardFooter>
        </Card>
    );
}

function UploadSlot({
    label,
    description,
    image,
    setImage,
    handleUploadSuccess
}: {
    label: string;
    description: string;
    image: UploadedImage | null;
    setImage: (img: UploadedImage | null) => void;
    handleUploadSuccess: (setter: (img: UploadedImage) => void) => (result: any) => void;
}) {
    const [isUploading, setIsUploading] = useState(false);

    return (
        <div className="space-y-3">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label} *</Label>
            {image ? (
                <div className="relative group rounded-2xl overflow-hidden border border-emerald-100 bg-emerald-50 aspect-video shadow-sm hover:shadow-md transition-all">
                    <Image
                        src={image.url}
                        alt={label}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 330px"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="p-3 bg-white text-rose-600 rounded-2xl hover:bg-rose-50 transition-all transform hover:scale-110 active:scale-90"
                        >
                            <Trash2Icon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                    </div>
                </div>
            ) : (
                <CldUploadWidget
                    uploadPreset="tenpaten_uploads"
                    options={{
                        maxFiles: 1,
                        resourceType: 'image',
                        sources: ['local', 'camera'],
                        maxFileSize: 5 * 1024 * 1024,
                        folder: 'tenpaten/affiliate_ids',
                        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    }}
                    onSuccess={(result) => {
                        setIsUploading(false);
                        handleUploadSuccess(setImage)(result);
                    }}
                    onUpload={() => setIsUploading(true)}
                    onClose={() => setIsUploading(false)}
                >
                    {({ open }) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            disabled={isUploading}
                            className="relative w-full aspect-video border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-2xl hover:border-brand-accent hover:bg-white transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group shadow-inner"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-brand-primary group-hover:scale-110 transition-all">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 group-hover:text-brand-primary uppercase tracking-widest">
                                        Click to Capture
                                    </span>
                                </>
                            )}
                        </button>
                    )}
                </CldUploadWidget>
            )}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-1">{description}</p>
        </div>
    );
}

function SparkleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
        </svg>
    )
}

function Trash2Icon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <path d="M10 11v6m4-6v6" />
        </svg>
    )
}
