'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { joinAffiliateProgram } from '@/lib/actions/affiliates';
import { uploadTempDocument } from '@/lib/upload-actions';
import { Upload, CheckCircle2, Building2, User, Landmark, DollarSign } from 'lucide-react';

interface ApplyAffiliateFormProps {
    countries: { id: string; name: string }[];
}

export default function ApplyAffiliateForm({ countries }: ApplyAffiliateFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Document States
    const [idFront, setIdFront] = useState<{ url: string; publicId: string; name: string } | null>(null);
    const [idBack, setIdBack] = useState<{ url: string; publicId: string; name: string } | null>(null);
    const [idSelfie, setIdSelfie] = useState<{ url: string; publicId: string; name: string } | null>(null);

    // Upload Handlers
    const [uploadingFront, setUploadingFront] = useState(false);
    const [uploadingBack, setUploadingBack] = useState(false);
    const [uploadingSelfie, setUploadingSelfie] = useState(false);

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setUploading: (val: boolean) => void,
        setResult: (data: { url: string; publicId: string; name: string } | null) => void
    ) => {
        if (!e.target.files || !e.target.files[0]) return;
        
        setError(null);
        setUploading(true);
        
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await uploadTempDocument(formData);
            if (res.success && res.document) {
                setResult(res.document);
            } else {
                setError(res.error || 'Failed to upload document.');
            }
        } catch (err) {
            setError('An unexpected error occurred during upload.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!idFront || !idBack || !idSelfie) {
            setError('Please upload all required ID documents.');
            return;
        }

        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        
        // Append exact Cloudinary identifiers to form data
        formData.append('idFrontUrl', idFront.url);
        formData.append('idFrontPublicId', idFront.publicId);
        formData.append('idFrontName', idFront.name);

        formData.append('idBackUrl', idBack.url);
        formData.append('idBackPublicId', idBack.publicId);
        formData.append('idBackName', idBack.name);

        formData.append('idSelfieUrl', idSelfie.url);
        formData.append('idSelfiePublicId', idSelfie.publicId);
        formData.append('idSelfieName', idSelfie.name);

        const res = await joinAffiliateProgram(undefined, formData);

        if (res === 'Application submitted successfully! Your application is pending review.') {
            router.push('/dashboard/affiliate');
        } else {
            setError(res || 'Something went wrong.');
            setSubmitting(false);
        }
    };

    const UploadBox = ({ label, id, uploading, result, onChange, accept = ".jpg,.jpeg,.png,.pdf" }: any) => (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#36335e]">{label}</label>
            <div className={`relative flex items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${result ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-[#d5a22d]'}`}>
                {uploading ? (
                    <div className="text-xs font-bold text-[#d5a22d] animate-pulse">Uploading...</div>
                ) : result ? (
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{result.name.substring(0, 15)}...</span>
                        <button type="button" onClick={() => onChange({ target: { files: [] } })} className="text-[10px] font-bold text-red-500 hover:underline mt-1 bg-transparent border-none cursor-pointer">Remove</button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#36335e]/5 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="text-xs text-slate-500 font-medium text-center">
                            <span className="text-[#d5a22d] font-bold hover:underline cursor-pointer">Click to browse</span> or drag & drop
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG, PDF (Max 10MB)</p>
                    </div>
                )}
                
                <input
                    type="file"
                    id={id}
                    accept={accept}
                    onChange={(e) => onChange(e)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={uploading || !!result}
                />
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-10">

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3">
                    <div className="mt-0.5">⚠️</div>
                    {error}
                </div>
            )}

            {/* Section 1: Verification */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#36335e] text-white flex items-center justify-center shadow-lg shadow-[#36335e]/20">
                        <User className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#36335e] tracking-tight">Identity Verification</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Please provide government-issued ID details for security</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#36335e]">Document Type</label>
                        <select name="idType" required className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#d5a22d] focus:ring-1 focus:ring-[#d5a22d]/30 transition-all appearance-none">
                            <option value="">Select an ID type</option>
                            <option value="NATIONAL_ID">National ID Card</option>
                            <option value="PASSPORT">Passport</option>
                            <option value="DRIVERS_LICENSE">Driver's License</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#36335e]">ID Number</label>
                        <input type="text" name="idNumber" required placeholder="Enter exact document number" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#d5a22d] focus:ring-1 focus:ring-[#d5a22d]/30 transition-all placeholder:text-gray-400" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-[#36335e]">Operating Country</label>
                        <select name="countryId" required className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#d5a22d] focus:ring-1 focus:ring-[#d5a22d]/30 transition-all appearance-none">
                            <option value="">Select your operating country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Uploaders */}
                <div className="grid md:grid-cols-3 gap-6 pt-4">
                    <UploadBox 
                        label="Front of ID" 
                        id="frontUpload" 
                        uploading={uploadingFront} 
                        result={idFront} 
                        onChange={(e: any) => {
                            if (!e.target.files?.length) setIdFront(null);
                            else handleUpload(e, setUploadingFront, setIdFront);
                        }} 
                    />
                    <UploadBox 
                        label="Back of ID" 
                        id="backUpload" 
                        uploading={uploadingBack} 
                        result={idBack} 
                        onChange={(e: any) => {
                            if (!e.target.files?.length) setIdBack(null);
                            else handleUpload(e, setUploadingBack, setIdBack);
                        }} 
                    />
                    <UploadBox 
                        label="Selfie Holding ID" 
                        id="selfieUpload" 
                        uploading={uploadingSelfie} 
                        result={idSelfie} 
                        onChange={(e: any) => {
                            if (!e.target.files?.length) setIdSelfie(null);
                            else handleUpload(e, setUploadingSelfie, setIdSelfie);
                        }} 
                        accept=".jpg,.jpeg,.png"
                    />
                </div>
            </div>

            <div className="h-px bg-slate-100 w-full" />

            {/* Section 2: Bank Details */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#36335e] tracking-tight">Payout Details</h3>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Where should we send your commissions?</p>
                        </div>
                    </div>

                    {/* Reward Type Toggle */}
                    <div className="flex flex-col gap-1.5 min-w-[150px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Reward Type</label>
                        <select name="rewardType" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-bold text-[#36335e] focus:outline-none focus:border-[#d5a22d]">
                            <option value="CASH">Cash Payout</option>
                            <option value="TUITION_DISCOUNT">Tuition Discount</option>
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#36335e]">Bank Name</label>
                        <input type="text" name="bankName" required placeholder="e.g. Standard Chartered" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#d5a22d] focus:ring-1 focus:ring-[#d5a22d]/30 transition-all placeholder:text-gray-400" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#36335e]">Account Name</label>
                        <input type="text" name="accountName" required placeholder="Must match your ID name" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#d5a22d] focus:ring-1 focus:ring-[#d5a22d]/30 transition-all placeholder:text-gray-400" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#36335e]">Account Number</label>
                        <input type="text" name="accountNumber" required placeholder="Full account number" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#d5a22d] focus:ring-1 focus:ring-[#d5a22d]/30 transition-all placeholder:text-gray-400" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#36335e]">SWIFT / BIC Code (Optional)</label>
                        <input type="text" name="swiftCode" placeholder="For international transfers" className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium focus:outline-none focus:border-[#d5a22d] focus:ring-1 focus:ring-[#d5a22d]/30 transition-all placeholder:text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Submit Actions */}
            <div className="pt-6">
                <button
                    type="submit"
                    disabled={submitting || !idFront || !idBack || !idSelfie || uploadingFront || uploadingBack || uploadingSelfie}
                    className="w-full h-14 rounded-2xl bg-[#36335e] text-[#d5a22d] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#36335e]/10 hover:bg-[#2a284a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-3"
                >
                    {submitting ? 'Submitting Application...' : 'Submit Affiliate Application'}
                </button>
                <p className="text-center text-[10px] font-medium text-slate-400 mt-4 uppercase tracking-widest">
                    By submitting, you agree to Tenpaten's Affiliate Terms & Conditions
                </p>
            </div>
        </form>
    );
}
