'use client';

import { Button } from '@/components/ui/button';
import { deleteDocument } from '@/lib/upload-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FileText } from 'lucide-react';

interface Document {
    publicId: string;
    url: string;
    name: string;
    uploadedAt: string;
}

export default function DocumentList({
    documents,
    applicationId,
    readonly = false
}: {
    documents: any,
    applicationId: string,
    readonly?: boolean
}) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    // Safety check for documents type
    const docList = Array.isArray(documents) ? documents as Document[] : [];

    const handleDelete = async (publicId: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        setDeletingId(publicId);
        try {
            await deleteDocument(applicationId, publicId);
            router.refresh();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Failed to delete document');
        } finally {
            setDeletingId(null);
        }
    };

    if (docList.length === 0) {
        return (
            <div className="py-8 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No documents uploaded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {docList.map((doc, index) => (
                <div key={doc.publicId || index} className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 bg-gray-50/50 hover:bg-white hover:border-[#d5a22d]/30 transition-all group">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#d5a22d] group-hover:bg-[#d5a22d] group-hover:text-white transition-all shadow-sm">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                            <p className="text-sm font-black text-[#36335e] truncate mb-0.5">{doc.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Uploaded</span>
                                <span className="text-[10px] font-bold text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                        <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-[#36335e] hover:border-[#d5a22d] hover:text-[#d5a22d] font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
                        >
                            View
                        </a>
                        {!readonly && (
                            <button
                                onClick={() => handleDelete(doc.publicId)}
                                disabled={deletingId === doc.publicId}
                                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {deletingId === doc.publicId ? '...' : 'Delete'}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
