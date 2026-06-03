import { getAffiliateById } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { approveAffiliate, rejectAffiliate, updateAffiliateCommission } from '@/lib/actions/country-director';
import InitiateMessage from '@/components/messaging/InitiateMessage';
import {
    ArrowLeft,
    Users,
    Mail,
    Calendar,
    Building2,
    DollarSign,
    CreditCard,
    FileText,
    ExternalLink,
    CheckCircle,
    XCircle,
    BadgePercent,
    TrendingUp
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const affiliate = await getAffiliateById(id);

    if (!affiliate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-semibold">Affiliate not found</h2>
                <Button variant="link" asChild>
                    <Link href="/dashboard/country-director/affiliates">Back to Affiliates</Link>
                </Button>
            </div>
        );
    }

    const bankDetails = affiliate.bankDetails as any || {};
    const documents = affiliate.user.documents as any[] || [];
    const idDocument = documents.find(d => d.type === 'IDENTITY');

    return (
        <div className="w-full space-y-10 pb-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/country-director/affiliates"
                        className="h-14 w-14 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:scale-110 transition-all duration-300 border border-slate-100"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                            <Users className="w-3 h-3" />
                            Regional Partner Profile
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">{affiliate.user.fullName}</h1>
                        <p className="text-gray-400 mt-1 font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4 text-brand-accent" />
                            {affiliate.user.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <InitiateMessage
                        recipientId={affiliate.user.id}
                        label="Message Partner"
                        className="h-12 px-6 bg-white border-slate-200 text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary hover:border-brand-primary/10 rounded-2xl font-bold shadow-sm"
                    />

                    {affiliate.status === 'PENDING' && (
                        <div className="flex items-center gap-3 pl-3 border-l border-white/10 ml-3">
                            <form action={async () => {
                                'use server';
                                await approveAffiliate(affiliate.id);
                            }}>
                                <Button className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 transition-all transform hover:scale-105 active:scale-95 leading-none">
                                    <CheckCircle className="w-4 h-4 mr-2 text-brand-accent" />
                                    Approve
                                </Button>
                            </form>
                            <form action={async () => {
                                'use server';
                                await rejectAffiliate(affiliate.id);
                            }}>
                                <Button variant="outline" className="h-12 px-6 text-rose-600 border-rose-100 hover:bg-rose-50 rounded-2xl font-bold">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </form>
                        </div>
                    )}

                    {affiliate.status !== 'PENDING' && (
                        <div className={`h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 shadow-sm border
                            ${affiliate.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {affiliate.status === 'APPROVED' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {affiliate.status}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-10">
                    {/* Performance Card */}
                    <Card className="border-none shadow-2xl shadow-brand-primary/20 rounded-[2.5rem] bg-brand-primary text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                                    <TrendingUp className="w-5 h-5 text-brand-accent" />
                                </div>
                                Yield Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">Total Referred</p>
                                    <p className="text-4xl font-black tracking-tighter">{affiliate.referrals.length}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">Revenue Split</p>
                                    <p className="text-4xl font-black tracking-tighter text-brand-accent">{affiliate.commissionRate}%</p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 shadow-lg">
                                <form action={async (formData: FormData) => {
                                    'use server';
                                    const rate = parseFloat(formData.get('rate') as string);
                                    if (!isNaN(rate)) {
                                        await updateAffiliateCommission(affiliate.id, rate);
                                    }
                                }} className="space-y-4">
                                    <label className="text-[10px] font-black text-white/70 uppercase tracking-widest flex items-center gap-2">
                                        <BadgePercent className="w-4 h-4 text-brand-accent" />
                                        Rate Adjustment
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            name="rate"
                                            type="number"
                                            step="0.1"
                                            defaultValue={affiliate.commissionRate}
                                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                                        />
                                        <Button size="sm" className="h-11 px-6 bg-brand-accent text-brand-primary hover:bg-[#c49220] font-black rounded-xl border-none shadow-xl">Apply</Button>
                                    </div>
                                </form>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Details Card */}
                    <Card className="border-none shadow-xl shadow-brand-primary/10 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 pb-4">
                            <CardTitle className="text-base font-bold flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                    <CreditCard className="w-4 h-4" />
                                </div>
                                Settlement Channel
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Institution Name</label>
                                <p className="text-lg font-black text-slate-900 leading-tight">{bankDetails.bankName || 'Not configured'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Beneficiary</label>
                                <p className="text-sm font-bold text-slate-700">{bankDetails.accountName || 'Not configured'}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Account Number</label>
                                <p className="text-sm font-mono font-bold text-brand-primary bg-brand-primary/5 px-3 py-1.5 rounded-xl inline-block mt-1">
                                    {bankDetails.accountNumber || 'Not configured'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Identity Documents */}
                    {idDocument && (
                        <Card className="border-none shadow-xl shadow-brand-primary/10 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 pb-4">
                                <CardTitle className="text-base font-bold flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-brand-primary/5 text-brand-primary">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    KYC Authentication
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-5">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/5 group-hover:text-brand-primary transition-colors">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-brand-primary transition-colors uppercase tracking-tight">{idDocument.subType}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">REF: {idDocument.number}</p>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-slate-100" asChild>
                                        <a href={idDocument.url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-5 h-5 text-slate-400" />
                                        </a>
                                    </Button>
                                </div>
                                <Separator className="bg-slate-100" />
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                                    Verified on {new Date(idDocument.uploadedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2">
                    {/* Referrals List */}
                    <Card className="border-none shadow-xl shadow-brand-primary/10 rounded-[3rem] overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-10 pb-6 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black text-brand-primary flex items-center gap-4 tracking-tight">
                                    <div className="p-3 rounded-2xl bg-white shadow-lg text-brand-primary">
                                        <Users className="w-6 h-6 text-brand-accent" />
                                    </div>
                                    Network Pipeline
                                </CardTitle>
                                <p className="text-slate-500 font-medium mt-1">Direct student referrals and enrollment status.</p>
                            </div>
                            <div className="h-10 px-4 bg-brand-primary/5 rounded-xl flex items-center text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] shadow-sm">
                                {affiliate.referrals.length} CONNECTIONS
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {affiliate.referrals.length === 0 ? (
                                <div className="p-20 text-center">
                                    <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                        <Users className="w-10 h-10" />
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No activation in network pipeline yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {affiliate.referrals.map((ref: any) => (
                                        <div key={ref.id} className="p-8 hover:bg-slate-50/80 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-[1.5rem] bg-slate-100 shadow-inner flex items-center justify-center text-slate-400 font-black text-2xl group-hover:scale-110 group-hover:bg-brand-primary/5 group-hover:text-brand-primary transition-all">
                                                    {ref.prospect.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-brand-primary transition-colors uppercase leading-none mb-2">{ref.prospect.fullName}</h4>
                                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                                        <Building2 className="w-3.5 h-3.5 text-brand-primary/40" />
                                                        {ref.program.name} • {ref.program.university.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                        ${ref.status === 'ENROLLED' ? 'bg-emerald-50 text-emerald-600' :
                                                            ref.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' :
                                                                'bg-amber-50 text-amber-600'}`}>
                                                        {ref.status.replace(/_/g, ' ')}
                                                    </span>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2 flex items-center justify-end gap-1.5">
                                                        <Calendar className="w-3 h-3 text-brand-accent" />
                                                        {new Date(ref.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Button size="icon" variant="outline" className="h-12 w-12 rounded-2xl border-slate-200 text-slate-400 hover:text-brand-primary hover:border-brand-primary/10 hover:bg-brand-primary/5 group-hover:scale-110 active:scale-95 transition-all" asChild>
                                                    <Link href={`/dashboard/country-director/applications/${ref.id}`}>
                                                        <ExternalLink className="w-5 h-5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
