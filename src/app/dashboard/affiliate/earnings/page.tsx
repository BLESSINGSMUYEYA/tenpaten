import { getAffiliateFinancialSummary } from '@/lib/actions/finance';
import Link from 'next/link';
import { 
    DollarSign, 
    TrendingUp, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    History, 
    Wallet,
    CreditCard,
    ChevronRight,
    Search
} from 'lucide-react';
import PayoutRequestForm from './payout-form';
import { format } from 'date-fns';

export default async function Page() {
    const summary = await getAffiliateFinancialSummary();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
            case 'PROCESSING': return 'bg-blue-100 text-blue-700';
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'REJECTED': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="w-full space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Wallet className="w-3 h-3" />
                        Partner Finance
                    </div>
                    <h1 className="text-4xl font-black text-brand-primary tracking-tight">Financial Center</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage your commissions, track payments, and request payouts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/affiliate" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-black text-brand-primary hover:border-brand-accent/40 hover:shadow-lg hover:shadow-slate-200/50 transition-all active:scale-95">
                        <ArrowLeft className="w-4 h-4" />
                        Return
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Payout */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Available Balance Card */}
                    <div className="relative overflow-hidden bg-brand-primary rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/30">
                        {/* Abstract Background Design */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-accent/20 rounded-full translate-y-12 -translate-x-12 blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-indigo-200/70 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                <Wallet className="w-3.5 h-3.5" />
                                Available Balance
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter">{summary.availableBalance.toLocaleString()}</span>
                                <span className="text-xl font-black text-brand-accent">{summary.currency}</span>
                            </div>
                            
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                                    <div className="text-[10px] font-black text-indigo-200/50 uppercase mb-1">Total Earned</div>
                                    <div className="text-lg font-black">{summary.totalEarnings.toLocaleString()}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                                    <div className="text-[10px] font-black text-indigo-200/50 uppercase mb-1">Withdrawn</div>
                                    <div className="text-lg font-black">{summary.totalPaidOut.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payout Form */}
                    <PayoutRequestForm availableBalance={summary.availableBalance} currency={summary.currency} />
                </div>

                {/* Right Column: Lists */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Transaction History */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-brand-primary">Conversion Earnings</h2>
                                <p className="text-sm text-slate-400 font-medium">Commissions from successful applicant payments.</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>

                        {summary.transactions.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-slate-200" />
                                </div>
                                <p className="text-slate-400 font-bold">No transactions recorded yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-50">
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Commission</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {summary.transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="text-xs font-black text-brand-primary">{format(new Date(tx.createdAt), 'MMM dd, yyyy')}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{format(new Date(tx.createdAt), 'HH:mm')}</div>
                                                </td>
                                                <td className="px-4 py-5">
                                                    <div className="text-sm font-black text-brand-primary group-hover:text-brand-accent transition-colors">{tx.referenceId}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold">APPLICATION SUCCESS</div>
                                                </td>
                                                <td className="px-4 py-5 text-right">
                                                    <div className="text-lg font-black text-brand-accent">+{tx.affiliateAmount?.toLocaleString()}</div>
                                                    <div className="text-[11px] text-emerald-500 font-black uppercase tracking-widest">CONFIRMED</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Payout History */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-brand-primary">Withdrawal History</h2>
                                <p className="text-sm text-slate-400 font-medium">Track your bank transfers and payout requests.</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <History className="w-6 h-6" />
                            </div>
                        </div>

                        {summary.payouts.length === 0 ? (
                            <div className="py-16 text-center">
                                <p className="text-slate-400 font-bold lowercase italic text-xs">your withdrawal history will appear here once you request funds.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {summary.payouts.map((payout) => (
                                    <div key={payout.id} className="p-6 md:px-8 hover:bg-slate-50/30 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(payout.status)} transition-colors`}>
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-black text-brand-primary">{payout.amount.toLocaleString()} {payout.currency}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(payout.status)}`}>
                                                        {payout.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-400 font-bold mt-1">Requested on {format(new Date(payout.requestedAt), 'PPP')}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            {payout.adminNotes && (
                                                <div className="hidden md:block max-w-[200px]">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">Admin Note</span>
                                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{payout.adminNotes}"</p>
                                                </div>
                                            )}
                                            <ChevronRight className="w-5 h-5 text-slate-200 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
