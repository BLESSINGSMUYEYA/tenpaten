import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, ArrowLeft, FileText, Download, User as UserIcon, Building2, CreditCard } from 'lucide-react';
import { updateAffiliateStatus } from '@/lib/actions/affiliates';
import Image from 'next/image';

export default async function AdminAffiliateDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const affiliate = await prisma.affiliateProfile.findUnique({
        where: { userId: id },
        include: {
            user: true
        }
    });

    if (!affiliate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-black text-[#36335e]">Partner not found</h2>
                <Link href="/dashboard/admin/affiliates" className="text-[#d5a22d] font-bold hover:underline mt-4">
                    Return to Registry
                </Link>
            </div>
        );
    }

    const bankDetails = affiliate.bankDetails as any;
    const documents = (affiliate.user.documents as any[]) || [];
    const idDocument = documents.find((doc: any) => doc.type === 'IDENTITY');

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/admin/affiliates"
                        className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-[#36335e]/10 flex items-center justify-center text-[#36335e] hover:bg-[#36335e] hover:text-[#d5a22d] hover:scale-110 transition-all duration-300 border border-gray-100"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d5a22d]/10 text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em] mb-3 border border-[#d5a22d]/20">
                            <UserIcon className="w-3 h-3" />
                            Affiliate verification
                        </div>
                        <h1 className="text-4xl font-black text-[#36335e] tracking-tight">{affiliate.user.fullName}</h1>
                        <p className="text-gray-500 mt-1 font-medium italic flex items-center gap-2">
                            Partner Code: <span className="text-[#36335e] font-bold">{affiliate.referralCode}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {affiliate.status === 'PENDING' && (
                        <>
                            <Button className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200">
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                            <Button variant="outline" className="h-12 px-6 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-xs">
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                        </>
                    )}
                    {affiliate.status === 'APPROVED' && (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest leading-none">
                            Authentic partner
                        </Badge>
                    )}
                    {affiliate.status === 'REJECTED' && (
                        <Badge className="bg-rose-50 text-rose-600 border-rose-100 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest leading-none">
                            Rejected application
                        </Badge>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-2xl shadow-[#36335e]/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="text-xl font-black flex items-center gap-3 text-[#36335e]">
                                <div className="p-2.5 rounded-xl bg-[#36335e] text-[#d5a22d]">
                                    <FileText className="w-5 h-5" />
                                </div>
                                Identification Document
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {idDocument ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">Document Type</label>
                                            <p className="text-sm font-bold text-[#36335e]">{idDocument.subType}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">Document ID</label>
                                            <p className="text-sm font-bold text-[#36335e]">{idDocument.number}</p>
                                        </div>
                                    </div>

                                    <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
                                        <Image
                                            src={idDocument.url}
                                            alt="ID Document"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <a href={idDocument.url} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-[#d5a22d] uppercase tracking-widest hover:underline">
                                            Open full resolution asset
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-bold italic">
                                    No identity artifacts present in registry.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="border-none shadow-2xl shadow-[#36335e]/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="text-xl font-black flex items-center gap-3 text-[#36335e]">
                                <div className="p-2.5 rounded-xl bg-[#36335e] text-[#d5a22d]">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                Settlement info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {bankDetails ? (
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">Bank Institution</label>
                                        <p className="text-sm font-black text-[#36335e]">{bankDetails.bankName}</p>
                                    </div>
                                    <Separator className="bg-slate-100" />
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">Account holder</label>
                                        <p className="text-sm font-black text-[#36335e]">{bankDetails.accountName}</p>
                                    </div>
                                    <Separator className="bg-slate-100" />
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">Channel ID / IBAN</label>
                                        <code className="text-xs font-black bg-slate-100 px-3 py-1.5 rounded-xl text-[#36335e]">{bankDetails.accountNumber}</code>
                                    </div>
                                    {bankDetails.swiftCode && (
                                        <>
                                            <Separator className="bg-slate-100" />
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2 block">SWIFT Authority</label>
                                                <p className="text-sm font-black text-[#36335e]">{bankDetails.swiftCode}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-400 font-bold italic">No settlement channels configured.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-2xl shadow-[#36335e]/20 rounded-[2.5rem] bg-[#36335e] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/20 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardHeader className="p-8 pb-4 relative z-10">
                            <CardTitle className="text-[10px] font-black text-[#d5a22d] uppercase tracking-[0.2em]">Economics</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white/70">Commission Level</span>
                                <span className="text-2xl font-black text-[#d5a22d] leading-none">{affiliate.commissionRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white/70">Reward Format</span>
                                <span className="text-sm font-black text-[#d5a22d] leading-none uppercase tracking-widest">{affiliate.rewardType.replace('_', ' ')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
