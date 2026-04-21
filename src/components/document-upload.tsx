'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadDocument } from '@/lib/upload-actions';
import { useRouter } from 'next/navigation';

export default function DocumentUpload({ applicationId }: { applicationId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Simple validation: 10MB limit
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size exceeds 10MB limit.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadDocument(formData, applicationId);
            if (result.success) {
                setFile(null);
                // Reset file input
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                router.refresh();
            } else {
                setError(result.error || 'Upload failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6 rounded-[2rem] border border-gray-100 p-8 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d5a22d]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Upload</span>
            </div>
            <h3 className="text-base font-black text-[#36335e] tracking-tight">Submit New Document</h3>
            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-[#36335e] uppercase tracking-widest ml-1">Select File</label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-[10px] font-black uppercase tracking-widest text-[#36335e]
                        file:mr-4 file:py-2.5 file:px-6
                        file:rounded-xl file:border-0
                        file:text-[10px] file:font-black file:uppercase file:tracking-widest
                        file:bg-[#36335e] file:text-[#d5a22d]
                        hover:file:bg-[#2a284a] transition-all cursor-pointer"
                />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] ml-1">Limit 10MB • PDF, JPG, PNG</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full h-12 rounded-2xl bg-[#d5a22d] hover:bg-[#c19229] text-[#1a1b41] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
                {uploading ? 'Processing...' : 'Complete Upload'}
            </Button>
        </div>
    );
}
