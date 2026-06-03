'use client';

import { useState } from 'react';
import { FileText, Trash2, Eye, CheckCircle2, AlertCircle, Loader2, UploadCloud, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { addUserDocument, deleteUserDocument } from '@/lib/actions/user-documents';
import { UserDocument } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DocumentsManagerProps {
    user: any;
    requiredDocuments?: string[];
}

type DocumentType = 'passport' | 'transcript' | 'test_score' | 'recommendation' | 'statement' | 'other';

export default function DocumentsManager({ user, requiredDocuments = [] }: DocumentsManagerProps) {
    const router = useRouter();
    const documents: UserDocument[] = user.documents || [];
    const [uploadingType, setUploadingType] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedDocType, setSelectedDocType] = useState<string>('');

    const documentTypes = [
        { value: 'passport', label: 'Passport', icon: FileText },
        { value: 'high_school_transcript', label: 'High School Transcript', icon: FileText },
        { value: 'english_proficiency_test', label: 'English Proficiency Test', icon: FileText },
        { value: 'personal_statement', label: 'Personal Statement', icon: FileText },
        { value: 'reference_letter', label: 'Reference Letter', icon: FileText },
        { value: 'cv_or_resume', label: 'CV or Resume', icon: FileText },
        { value: 'portfolio', label: 'Portfolio', icon: FileText },
        { value: 'bank_statement', label: 'Bank Statement', icon: FileText },
        { value: 'motivation_letter', label: 'Motivation Letter', icon: FileText },
        { value: 'medical_certificate', label: 'Medical Certificate', icon: FileText },
        { value: 'passport_photo', label: 'Passport Photo', icon: FileText },
        { value: 'police_clearance', label: 'Police Clearance', icon: FileText },
        { value: 'other', label: 'Other Documents', icon: FileText },
    ];

    const sortedDocumentTypes = [...documentTypes].sort((a, b) => {
        const aRequired = requiredDocuments.includes(a.value);
        const bRequired = requiredDocuments.includes(b.value);
        if (aRequired && !bRequired) return -1;
        if (!aRequired && bRequired) return 1;
        return 0;
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleManualUpload = async () => {
        if (!selectedFile || !selectedDocType) return;

        setUploadingType(selectedDocType);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', 'tenpaten_uploads');
            formData.append('folder', `tenpaten/users/${user.id}/documents`);

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            if (!cloudName) throw new Error('Cloudinary cloud name is missing');

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload to Cloudinary failed');

            const info = await response.json();

            const newDoc = {
                name: info.original_filename + '.' + info.format,
                type: selectedDocType,
                url: info.secure_url,
                size: info.bytes
            };

            const dbResponse = await addUserDocument(newDoc);
            if (!dbResponse.success) {
                const errMsg = dbResponse.error || 'Failed to save document';
                setError(errMsg);
                toast.error(errMsg);
            } else {
                toast.success('Document uploaded successfully');
                setSelectedFile(null); // Clear file selection on success
                // Keep document type selection if desired, or clear it
                // setSelectedDocType(''); 
                router.refresh();
            }
        } catch (err) {
            console.error('Upload Error:', err);
            setError('An unexpected error occurred during upload.');
            toast.error('An unexpected error occurred during upload.');
        } finally {
            setUploadingType(null);
        }
    };



    const handleDelete = async (documentId: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        setDeletingId(documentId);
        setError(null);

        try {
            const response = await deleteUserDocument(documentId);
            if (!response.success) {
                const errMsg = response.error || 'Failed to delete document';
                setError(errMsg);
                toast.error(errMsg);
            } else {
                toast.success('Document deleted successfully');
                router.refresh();
            }
        } catch (err) {
            setError('Failed to delete document');
            toast.error('Failed to delete document');
        } finally {
            setDeletingId(null);
        }
    };

    const getDocTypeLabel = (type: string) => {
        return documentTypes.find(t => t.value === type)?.label || type;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Documents</h3>
                <p className="text-sm text-gray-600">
                    Upload your documents once and use them across all applications
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="bg-white border text-card-foreground shadow-sm rounded-xl p-6 mb-8">
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Select Document Type
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <select
                            className="flex h-10 w-full sm:w-[300px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedDocType}
                            onChange={(e) => setSelectedDocType(e.target.value)}
                        >
                            <option value="" disabled>Select a document type...</option>
                            {sortedDocumentTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label} {requiredDocuments.includes(type.value) ? ' (REQUIRED)' : ''}
                                </option>
                            ))}
                        </select>

                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setSelectedFile(e.target.files[0]);
                                            setError(null);
                                        }
                                    }}
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                    disabled={!!uploadingType}
                                    className={selectedFile ? "border-brand-accent text-brand-accent bg-brand-accent/5" : ""}
                                >
                                    {selectedFile ? (
                                        <>
                                            <FileText className="w-4 h-4 mr-2" />
                                            {selectedFile.name.length > 15 ? selectedFile.name.substring(0, 12) + '...' : selectedFile.name}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Select File
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Button
                                onClick={handleManualUpload}
                                disabled={!selectedFile || !selectedDocType || !!uploadingType}
                                className="w-full sm:w-auto bg-brand-accent hover:bg-[#b89531] text-white min-w-[100px]"
                            >
                                {uploadingType ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="w-4 h-4 mr-2" />
                                        Upload
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-base font-semibold text-gray-900">Uploaded Documents</h4>
                {documents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {documents.map((doc, index) => (
                            <div
                                key={doc.id || `doc-${index}`}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-brand-accent/20 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-brand-accent/5 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-brand-accent" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {getDocTypeLabel(doc.type || '')}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate" title={doc.name}>
                                            {doc.name} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Just now'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(doc.url, '_blank')}
                                        className="h-8"
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        View
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => doc.id && handleDelete(doc.id)}
                                        disabled={!!doc.id && deletingId === doc.id}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                                    >
                                        {doc.id && deletingId === doc.id ? (
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-3 h-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <UploadCloud className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">No documents uploaded</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Select a document type above to start uploading
                        </p>
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 sm:p-6 bg-linear-to-r from-[#1a1b41]/5 to-brand-accent/5 border border-brand-accent/20 rounded-xl">
                <h4 className="font-semibold text-[#1a1b41] mb-2">Document Guidelines</h4>
                <ul className="text-sm text-[#1a1b41]/80 space-y-1">
                    <li>• Accepted formats: PDF, JPG, PNG</li>
                    <li>• Maximum file size: 10MB per document</li>
                    <li>• Documents should be clear and readable</li>
                </ul>
            </div>
        </div>
    );
}
