import { getApplicationDetails } from '@/lib/data';
import AdminStatusUpdater from './status-updater';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    GraduationCap,
    FileCheck,
    Clock,
    ExternalLink,
    CheckCircle2,
    Building2,
    Calendar,
    FileText,
    Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import InitiateMessage from '@/components/messaging/InitiateMessage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const application = await getApplicationDetails(id);

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-black text-[#36335e]">Application not found</h2>
                <Button variant="link" asChild className="text-[#d5a22d] font-bold">
                    <Link href="/dashboard/admin/applications">Back to Applications</Link>
                </Button>
            </div>
        );
    }

    const personalInfo = application.personalInfo as any || {};
    const academicInfo = application.academicInfo as any || {};
    const documents = application.documents as any[] || [];

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/admin/applications"
                        className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-[#36335e]/10 flex items-center justify-center text-[#36335e] hover:bg-[#36335e] hover:text-[#d5a22d] hover:scale-110 transition-all duration-300 border border-gray-100"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-[#d5a22d]/20">
                            <Target className="w-3 h-3" />
                            Global Enrollment Logic
                        </div>
                        <h1 className="text-4xl font-black text-[#36335e] tracking-tight">{application.prospect.fullName}</h1>
                        <p className="text-gray-500 mt-1 font-medium italic flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[#d5a22d]" />
                            {application.program.name} • <span className="text-[#36335e] font-bold">{application.program.university.name}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <InitiateMessage
                        recipientId={application.prospect.id}
                        label="Message Student"
                        className="h-12 px-6 bg-white border-gray-200 text-[#36335e] hover:bg-[#36335e]/5 hover:border-[#36335e]/20 rounded-2xl font-bold shadow-sm"
                    />
                    <div className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-md border
                        ${application.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                            application.status === 'ENROLLED' ? 'bg-[#36335e] text-[#d5a22d] border-[#36335e]' :
                                'bg-[#d5a22d]/10 text-[#d5a22d] border-[#d5a22d]/20'}`}>
                        <Clock className="w-4 h-4" />
                        {application.status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-10">
                    {/* Administrative Review Kit */}
                    <Card className="border-none shadow-2xl shadow-[#36335e]/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black flex items-center gap-3 text-[#36335e]">
                                        <div className="p-2.5 rounded-xl bg-[#36335e] text-[#d5a22d]">
                                            <FileCheck className="w-5 h-5" />
                                        </div>
                                        System-Wide Review Controller
                                    </CardTitle>
                                    <CardDescription className="font-bold text-gray-500 mt-1 uppercase tracking-tight text-[10px]">Override or validate enrollment decisions across the platform.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <AdminStatusUpdater applicationId={application.id} currentStatus={application.status} />
                        </CardContent>
                    </Card>

                    {/* Student Data Grids */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-none shadow-xl shadow-[#36335e]/5 rounded-[2.5rem] overflow-hidden bg-white border border-gray-50">
                            <CardHeader className="bg-gray-50/30 border-b border-gray-50 p-8 pb-4">
                                <CardTitle className="text-[10px] font-black flex items-center gap-3 text-gray-400 uppercase tracking-widest">
                                    <User className="w-4 h-4" />
                                    Identity Profile
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-5">
                                <div className="flex justify-between items-center group">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</span>
                                    <span className="text-sm font-bold text-[#36335e]">{application.prospect.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Axis</span>
                                    <span className="text-sm font-bold text-gray-700">{personalInfo.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nationality</span>
                                    <span className="text-sm font-black text-[#36335e] uppercase tracking-tight">{personalInfo.nationality || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Passport ID</span>
                                    <span className="text-sm font-mono font-bold text-[#d5a22d] bg-[#d5a22d]/5 px-2 py-1 rounded-lg border border-[#d5a22d]/10">{personalInfo.passportNumber || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl shadow-[#36335e]/5 rounded-[2.5rem] overflow-hidden bg-white border border-gray-50">
                            <CardHeader className="bg-gray-50/30 border-b border-gray-50 p-8 pb-4">
                                <CardTitle className="text-[10px] font-black flex items-center gap-3 text-[#d5a22d] uppercase tracking-widest">
                                    <GraduationCap className="w-4 h-4" />
                                    Academic Logic
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qualification</span>
                                    <span className="text-sm font-black text-[#36335e] uppercase tracking-tight">{academicInfo.highestQualification || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prior Institution</span>
                                    <span className="text-sm font-bold text-gray-700 truncate max-w-[150px]">{academicInfo.lastInstitution || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">GPA Performance</span>
                                    <span className="text-2xl font-black text-[#36335e] tracking-tighter">{academicInfo.gpa || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Graduation Year</span>
                                    <span className="text-sm font-bold text-gray-700 px-3 py-1 bg-gray-100 rounded-lg">{academicInfo.graduationYear || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Documentation Review */}
                    <Card className="border-none shadow-2xl shadow-[#36335e]/5 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="text-xl font-black flex items-center gap-3 text-[#36335e]">
                                <div className="p-2.5 rounded-xl bg-[#d5a22d]/10 text-[#d5a22d]">
                                    <FileText className="w-5 h-5" />
                                </div>
                                Evidence Repository
                            </CardTitle>
                            <CardDescription className="font-bold text-gray-400 mt-1 uppercase tracking-tight text-[10px]">Verify student credentials and identity assets.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            {documents.length === 0 ? (
                                <div className="text-center py-16 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">No documentary evidence uploaded</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {documents.map((doc: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-[#36335e]/10 transition-all group">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#36335e] shadow-sm group-hover:bg-[#36335e] group-hover:text-[#d5a22d] transition-all">
                                                    <FileText className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#36335e] truncate max-w-[120px]">{doc.name || 'Evidence File'}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{doc.type || 'Asset'}</p>
                                                </div>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-[#36335e] hover:text-[#d5a22d] transition-all" asChild>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-10">
                    {/* Institutional Context */}
                    <Card className="border-none shadow-2xl shadow-[#36335e]/30 rounded-[2.5rem] bg-[#36335e] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#d5a22d]/20 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <CardHeader className="p-8 pb-4 relative z-10">
                            <CardTitle className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.2em] flex items-center gap-3">
                                <Building2 className="w-4 h-4" />
                                Target Institution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8 relative z-10">
                            <div>
                                <h4 className="text-3xl font-black tracking-tighter leading-none">{application.program.university.name}</h4>
                                <p className="text-white/60 text-sm font-bold mt-3 italic">{application.program.name}</p>
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <p className="text-[#d5a22d] text-[10px] font-black uppercase tracking-widest">Fees</p>
                                    <p className="text-xl font-black tracking-tighter">
                                        {(application.program.university as any)?.country?.currencySymbol || ''}
                                        {application.program.baseTuition?.toLocaleString() || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[#d5a22d] text-[10px] font-black uppercase tracking-widest">Timeline</p>
                                    <p className="text-xl font-black tracking-tighter">{application.program.duration || 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Operational Log */}
                    <Card className="border-none shadow-xl shadow-[#36335e]/5 rounded-[2.5rem] overflow-hidden bg-white border border-gray-100">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="text-sm font-black flex items-center gap-3 text-[#36335e] uppercase tracking-widest">
                                <Clock className="w-5 h-5 text-[#d5a22d]" />
                                Life-Cycle Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-12 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-1 before:bg-gray-50">
                                {application.statusHistory.map((history, idx) => (
                                    <div key={history.id} className="relative pl-12 group">
                                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-xl transition-all duration-500
                                            ${idx === 0 ? 'bg-[#36335e] ring-8 ring-[#36335e]/5 scale-110' : 'bg-gray-200 group-hover:bg-[#d5a22d]'}`} />
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{new Date(history.createdAt).toLocaleDateString()}</p>
                                            <p className={`text-sm font-black tracking-tight ${idx === 0 ? 'text-[#36335e]' : 'text-gray-600'}`}>{history.status.replace('_', ' ')}</p>
                                            {history.note && (
                                                <div className="mt-3 text-xs bg-[#36335e]/5 p-4 rounded-2xl text-[#36335e] font-bold italic border border-[#36335e]/10 leading-relaxed shadow-sm">
                                                    "{history.note}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
