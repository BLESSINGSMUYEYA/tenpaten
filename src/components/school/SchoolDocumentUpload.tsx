'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Trash2, Download, AlertCircle, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import { uploadSchoolDocument, deleteSchoolDocument, SchoolDocumentType } from '@/lib/actions/school-documents';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

interface SchoolDocumentUploadProps {
    applicationId: string;
    documents: {
        offerLetterUrl?: string | null;
        acceptanceLetterUrl?: string | null;
        enrollmentDetailsUrl?: string | null;
    };
}

const DOCUMENT_TYPES: { id: SchoolDocumentType; label: string; description: string }[] = [
    {
        id: 'offerLetterUrl',
        label: 'Offer Letter',
        description: 'Official admission offer for the student'
    },
    {
        id: 'acceptanceLetterUrl',
        label: 'Acceptance Letter',
        description: 'Signed acceptance from the student or school'
    },
    {
        id: 'enrollmentDetailsUrl',
        label: 'Enrollment Details',
        description: 'Final enrollment confirmation and next steps'
    },
];

export default function SchoolDocumentUpload({ applicationId, documents }: SchoolDocumentUploadProps) {
    const router = useRouter();
    const [processing, setProcessing] = useState<SchoolDocumentType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUploadSuccess = async (result: any, type: SchoolDocumentType) => {
        const info = result?.info;
        if (!info?.secure_url) return;

        setProcessing(type);
        setError(null);

        try {
            const saveResult = await uploadSchoolDocument(info.secure_url, applicationId, type);
            if (saveResult.success) {
                router.refresh();
            } else {
                setError(saveResult.error || 'Failed to save document URL');
            }
        } catch (err) {
            setError('An unexpected error occurred saving the document');
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (type: SchoolDocumentType) => {
        if (!confirm('Are you sure you want to remove this document?')) return;

        setProcessing(type);
        setError(null);

        try {
            const result = await deleteSchoolDocument(applicationId, type);
            if (result.success) {
                router.refresh();
            } else {
                setError(result.error || 'Delete failed');
            }
        } catch (err) {
            setError('An unexpected error occurred during deletion');
        } finally {
            setProcessing(null);
        }
    };

    return (
        <Card className="border border-slate-100 shadow-sm overflow-hidden bg-white rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-6 sm:px-8">
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-[#d5a22d]/10 rounded-xl">
                        <FileText className="w-5 h-5 text-[#d5a22d]" />
                    </div>
                    Official Documents
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium ml-[3.25rem] mt-1">Upload required PDF documents (Max 10MB)</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6 px-6 sm:px-8 pb-8">
                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {DOCUMENT_TYPES.map((docType) => {
                        const url = documents[docType.id as keyof typeof documents];
                        const isProcessing = processing === docType.id;

                        return (
                            <div key={docType.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-[#36335e]/30 transition-all shadow-sm hover:shadow-[#36335e]/5 group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">{docType.label}</h4>
                                        <p className="text-xs font-medium text-slate-500 mt-1">{docType.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 relative z-10">
                                        {url ? (
                                            <>
                                                <a
                                                    href={url as string}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 text-[#36335e] hover:bg-[#36335e]/5 border border-transparent hover:border-[#36335e]/10 rounded-xl transition-all"
                                                    title="View/Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(docType.id)}
                                                    disabled={isProcessing}
                                                    className="p-2.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all disabled:opacity-50"
                                                    title="Remove"
                                                >
                                                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {isProcessing ? (
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 text-xs font-bold">
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    <CldUploadWidget
                                                        uploadPreset="tenpaten_uploads"
                                                        options={{
                                                            maxFiles: 1,
                                                            resourceType: 'raw', // for PDFs
                                                            sources: ['local'],
                                                            maxFileSize: 10 * 1024 * 1024, // 10MB
                                                            folder: `tenpaten/applications/${applicationId}/school_docs`,
                                                            clientAllowedFormats: ['pdf'],
                                                        }}
                                                        onSuccess={(result) => handleUploadSuccess(result, docType.id)}
                                                        onError={(err) => setError('Upload failed. Please try again.')}
                                                    >
                                                        {({ open }) => (
                                                            <button
                                                                type="button"
                                                                onClick={() => open()}
                                                                className="flex items-center gap-2 px-4 py-2 bg-[#36335e]/5 text-[#36335e] border border-transparent hover:border-[#36335e]/20 rounded-xl text-xs font-bold hover:bg-[#36335e]/10 transition-all active:scale-95"
                                                            >
                                                                <UploadCloud className="w-3.5 h-3.5" />
                                                                Upload PDF
                                                            </button>
                                                        )}
                                                    </CldUploadWidget>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                {url && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest relative z-0">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Document Uploaded
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
