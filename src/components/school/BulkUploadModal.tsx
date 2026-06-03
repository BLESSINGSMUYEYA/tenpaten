'use client';

import { useState, useRef } from 'react';
import { Download, Upload, X, AlertCircle, CheckCircle2, ChevronRight, FileSpreadsheet } from 'lucide-react';
import * as xlsx from 'xlsx';
import { bulkAddPrograms } from '@/lib/actions/program';
import { toast } from 'sonner';

interface BulkUploadModalProps {
    onClose: () => void;
    departments: any[];
    universityId?: string;
}

export default function BulkUploadModal({ onClose, departments, universityId }: BulkUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<1 | 2>(1); // 1: Upload, 2: Preview
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        // Create standard headers
        const headers = [
            'Program Name (Required)',
            'Department Name (Required)',
            'Level (e.g. Undergraduate, Postgraduate)',
            'Duration (e.g. 4 Years)',
            'Tuition Numeric (e.g. 10000)',
            'Intake (e.g. Fall 2026)',
            'Requirements',
            'Description'
        ];

        // Ensure we provide some instructions or a sample row
        const sampleRow = [
            'Bachelor of Computer Science',
            departments.length > 0 ? departments[0].name : 'Computer Science Dept',
            'Undergraduate',
            '4 Years',
            '15000',
            'Fall 2026',
            'High School Diploma, IELTS 6.5',
            'A comprehensive program covering software engineering...'
        ];

        const worksheet = xlsx.utils.aoa_to_sheet([headers, sampleRow]);
        
        // Auto-size columns slightly
        const wscols = headers.map(() => ({ wch: 25 }));
        worksheet['!cols'] = wscols;

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Programs Template');

        xlsx.writeFile(workbook, 'Tenpaten_Programs_Upload_Template.xlsx');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        parseFile(selectedFile);
    };

    const parseFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = xlsx.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json: any[] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

                // Remove header row
                const rows = json.slice(1).filter(row => row.length > 0 && row.some((cell: any) => !!cell));
                
                const parsedPrograms = rows.map((row) => {
                    const programName = row[0] || '';
                    const deptName = row[1] || '';
                    
                    // Match department case-insensitively
                    const matchedDept = departments.find(
                        (d) => d.name.trim().toLowerCase() === String(deptName).trim().toLowerCase()
                    );

                    let errors = [];
                    if (!programName) errors.push('Program Name is required');
                    if (!deptName) errors.push('Department Name is required');
                    else if (!matchedDept) errors.push(`Department "${deptName}" not found in your institution.`);

                    return {
                        name: programName,
                        departmentName: deptName,
                        departmentId: matchedDept ? matchedDept.id : null,
                        level: row[2] ? String(row[2]) : '',
                        duration: row[3] ? String(row[3]) : '',
                        baseTuition: row[4] ? Number(String(row[4]).replace(/[^0-9.]/g, '')) : null,
                        intake: row[5] ? String(row[5]) : '',
                        requirements: row[6] ? String(row[6]) : '',
                        description: row[7] ? String(row[7]) : '',
                        errors,
                    };
                });

                setPreviewData(parsedPrograms);
                setStep(2);
            } catch (err) {
                toast.error('Failed to parse the file. Please ensure it is a valid .xlsx file.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleImport = async () => {
        const invalidRows = previewData.filter(p => p.errors.length > 0);
        if (invalidRows.length > 0) {
            toast.error('Please fix the errors before importing.');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await bulkAddPrograms(previewData.map(p => ({
                name: p.name,
                description: p.description,
                duration: p.duration,
                baseTuition: p.baseTuition,
                level: p.level,
                requirements: p.requirements,
                intake: p.intake,
                departmentId: p.departmentId,
            })), universityId);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Successfully imported ${previewData.length} programs!`);
                onClose();
            }
        } catch (error) {
            toast.error('An unexpected error occurred during import.');
        } finally {
            setIsProcessing(false);
        }
    };

    const hasErrors = previewData.some(p => p.errors.length > 0);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-brand-primary">Bulk Import Programs</h2>
                        <p className="text-sm text-slate-500 mt-1">Upload multiple programs via Excel.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    {step === 1 && (
                        <div className="max-w-2xl mx-auto space-y-8">
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-blue-800">
                                <h3 className="font-bold flex items-center gap-2 text-lg">
                                    <FileSpreadsheet className="w-5 h-5" />
                                    How it works
                                </h3>
                                <ol className="mt-4 space-y-3 text-sm list-decimal list-inside text-blue-700/80">
                                    <li><button onClick={handleDownloadTemplate} className="font-semibold underline hover:text-blue-900">Download our .xlsx template</button> to ensure formatting is correct.</li>
                                    <li>Fill out the spreadsheet. <strong>Note: The Department must exactly match the ones existing in your dashboard.</strong></li>
                                    <li>Upload the completed .xlsx file below.</li>
                                    <li>Preview the data and confirm the upload.</li>
                                </ol>
                            </div>

                            <div 
                                className="border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-brand-primary/30 bg-white transition-colors cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="w-16 h-16 rounded-full bg-brand-primary/5 flex items-center justify-center mb-4 group-hover:bg-brand-primary/10 transition-colors">
                                    <Upload className="w-8 h-8 text-brand-primary" />
                                </div>
                                <h3 className="font-bold text-lg text-brand-primary mb-2">Click to Upload or Drag & Drop</h3>
                                <p className="text-sm text-slate-500">Only .xlsx files are supported.</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-brand-primary flex items-center gap-2">
                                    Previewing {previewData.length} Programs
                                </h3>
                                <button 
                                    onClick={() => setStep(1)}
                                    className="text-sm text-slate-500 hover:text-brand-primary underline"
                                >
                                    Upload different file
                                </button>
                            </div>

                            {hasErrors && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Action Required</p>
                                        <p>Some programs cannot be imported due to errors. Missing departments must be created first.</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-brand-primary/5 text-brand-primary font-bold">
                                            <tr>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Program Name</th>
                                                <th className="px-4 py-3">Department</th>
                                                <th className="px-4 py-3">Level</th>
                                                <th className="px-4 py-3">Duration</th>
                                                <th className="px-4 py-3">Tuition (Num)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-600">
                                            {previewData.map((row, idx) => (
                                                <tr key={idx} className={row.errors.length > 0 ? "bg-red-50/50" : "hover:bg-slate-50"}>
                                                    <td className="px-4 py-3">
                                                        {row.errors.length > 0 ? (
                                                            <div className="text-red-500 group relative">
                                                                <AlertCircle className="w-5 h-5" />
                                                                {/* Tooltip */}
                                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 bg-red-600 text-white text-xs p-2 rounded shadow-lg z-10 whitespace-normal">
                                                                    {row.errors.join(", ")}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-slate-900">{row.name || <span className="text-red-400 italic">Missing</span>}</td>
                                                    <td className="px-4 py-3">
                                                        {row.departmentName ? (
                                                            row.departmentId ? (
                                                                row.departmentName
                                                            ) : (
                                                                <span className="text-red-500 underline decoration-red-300 decoration-wavy underline-offset-4" title="Department not found">
                                                                    {row.departmentName}
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span className="text-red-400 italic">Missing</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">{row.level}</td>
                                                    <td className="px-4 py-3">{row.duration}</td>
                                                    <td className="px-4 py-3">{row.baseTuition?.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    {step === 2 && (
                        <button
                            onClick={handleImport}
                            disabled={hasErrors || isProcessing}
                            className="px-8 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isProcessing ? 'Importing...' : `Import ${previewData.length} Programs`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
