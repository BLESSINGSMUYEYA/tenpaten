'use client';

import { useSearchParams } from 'next/navigation';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ExportButton() {
    const searchParams = useSearchParams();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams(searchParams.toString());
            const response = await fetch(`/api/school/applications/export?${params.toString()}`);
            
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Applicant_Registry_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            toast.success('Excel file generated successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to generate Excel file');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={isExporting}
            className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
            {isExporting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <FileSpreadsheet className="w-4 h-4" />
            )}
            {isExporting ? 'Generating...' : 'Export to Excel'}
        </Button>
    );
}
