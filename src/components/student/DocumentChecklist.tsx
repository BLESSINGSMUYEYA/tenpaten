'use client';

import { FileCheck, FileX, Upload, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface Document {
    name: string;
    required: boolean;
    uploaded: boolean;
    status?: 'pending' | 'verified' | 'rejected';
    uploadedAt?: Date;
}

interface DocumentChecklistProps {
    applicationId: string;
    documents: Document[];
}

export default function DocumentChecklist({ applicationId, documents }: DocumentChecklistProps) {
    const requiredDocs = documents.filter(doc => doc.required);
    const uploadedCount = requiredDocs.filter(doc => doc.uploaded).length;
    const completionPercentage = requiredDocs.length > 0
        ? Math.round((uploadedCount / requiredDocs.length) * 100)
        : 0;

    const getStatusIcon = (doc: Document) => {
        if (!doc.uploaded) {
            return <Clock className="w-4 h-4 text-gray-400" />;
        }
        if (doc.status === 'verified') {
            return <CheckCircle2 className="w-4 h-4 text-green-600" />;
        }
        if (doc.status === 'rejected') {
            return <XCircle className="w-4 h-4 text-red-600" />;
        }
        return <Clock className="w-4 h-4 text-yellow-600" />;
    };

    const getStatusColor = (doc: Document) => {
        if (!doc.uploaded) return 'bg-gray-50 border-gray-200';
        if (doc.status === 'verified') return 'bg-green-50 border-green-200';
        if (doc.status === 'rejected') return 'bg-red-50 border-red-200';
        return 'bg-yellow-50 border-yellow-200';
    };

    return (
        <div className="rounded-lg bg-white border border-gray-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-semibold text-gray-900">Documents</h4>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                        {uploadedCount}/{requiredDocs.length}
                    </span>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Document List */}
            <div className="space-y-2">
                {documents.map((doc, index) => (
                    <div
                        key={index}
                        className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${getStatusColor(doc)}`}
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                {getStatusIcon(doc)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {doc.name}
                                    </p>
                                    {doc.required && (
                                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                            Required
                                        </span>
                                    )}
                                </div>
                                {doc.uploaded && doc.uploadedAt && (
                                    <p className="text-xs text-gray-500">
                                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        {!doc.uploaded && (
                            <Link
                                href={`/dashboard/applications/${applicationId}#documents`}
                                className="flex-shrink-0 p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 transition-colors"
                            >
                                <Upload className="w-4 h-4 text-gray-600" />
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Upload All Button */}
            {uploadedCount < requiredDocs.length && (
                <Link
                    href={`/dashboard/applications/${applicationId}#documents`}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    Upload Missing Documents
                </Link>
            )}
        </div>
    );
}
