'use client';

import { useState, useEffect } from 'react';
import { 
    Wallet, 
    ArrowUpRight, 
    TrendingUp, 
    History, 
    Download, 
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle2,
    Search,
    Filter
} from 'lucide-react';
import { getSchoolFinancialSummary } from '@/lib/actions/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import PayoutModal from './PayoutModal';

export default function FinancePageClient() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'transactions' | 'payouts'>('transactions');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const result = await getSchoolFinancialSummary();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch financial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredTransactions = data?.transactions?.filter((tx: any) => 
        tx.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.application?.program?.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl mb-4" />
                <div className="h-4 w-32 bg-slate-200 rounded-full" />
            </div>
        );
    }

    const { summary, currency } = data;

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            
            {/* ── Navy & Gold Page Header ── */}
            <div className="bg-[#1d1b41] rounded-3xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                    <h1 className="text-base font-black text-white tracking-[0.15em] uppercase">
                        Financial Ledger
                    </h1>
                    <p className="text-white/40 mt-0.5 font-medium text-[11px]">
                        Track your institutional revenue, platform fees, and withdrawal balances.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white font-black rounded-xl text-[10px] uppercase tracking-[0.15em] hover:bg-white/20 transition-all border border-white/20">
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                    </button>
                    <button 
                        onClick={() => setIsPayoutModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#d5a22d] text-[#1d1b41] font-black rounded-xl text-[10px] uppercase tracking-[0.15em] hover:bg-[#b58825] transition-all shadow-lg"
                    >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Request Payout
                    </button>
                </div>
            </div>

            {/* ── Stats Overview ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Available Balance Card */}
                <div className="bg-[#1d1b41] text-white rounded-3xl p-6 relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[#d5a22d]/20 backdrop-blur-md flex items-center justify-center border border-[#d5a22d]/30">
                                <Wallet className="w-5 h-5 text-[#d5a22d]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-3 py-1 rounded-lg border border-white/10">Available Balance</span>
                        </div>
                        <div>
                            <p className="text-[#d5a22d] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Receivable</p>
                            <h2 className="text-3xl font-black tracking-tight">{summary.availableBalance.toLocaleString()} <span className="text-lg opacity-70">{currency}</span></h2>
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.1em] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">+12.5% vs Prev Month</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Gross Revenue</p>
                        <h2 className="text-3xl font-black text-[#1d1b41] tracking-tight">{summary.totalRevenue.toLocaleString()} <span className="text-lg text-slate-400">{currency}</span></h2>
                    </div>
                </div>

                {/* Tenpaten Cut Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-rose-500" />
                            </div>
                            <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.1em] bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">Platform Fees (10%)</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tenpaten Service Fee</p>
                        <h2 className="text-3xl font-black text-[#1d1b41] tracking-tight">{summary.platformFees.toLocaleString()} <span className="text-lg text-slate-400">{currency}</span></h2>
                    </div>
                </div>
            </div>

            {/* ── Transaction List Section ── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col">
                
                {/* Unified Toolbar */}
                <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                    
                    {/* Tab Switcher */}
                    <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-sm shrink-0">
                        <button 
                            onClick={() => setActiveTab('transactions')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                                activeTab === 'transactions' ? 'bg-[#1d1b41] text-[#d5a22d] shadow-md' : 'text-slate-500 hover:text-[#1d1b41]'
                            }`}
                        >
                            <History className="w-3.5 h-3.5" />
                            Transactions
                        </button>
                        <button 
                            onClick={() => setActiveTab('payouts')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
                                activeTab === 'payouts' ? 'bg-[#1d1b41] text-[#d5a22d] shadow-md' : 'text-slate-500 hover:text-[#1d1b41]'
                            }`}
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            Payouts
                        </button>
                    </div>

                    {/* Search & Filter (Only on Transactions) */}
                    {activeTab === 'transactions' && (
                        <div className="flex items-center gap-2 ml-auto">
                            <div className="relative group min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#1d1b41] transition-colors" />
                                <input 
                                    placeholder="Search references..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#1d1b41]/10 transition-all shadow-sm"
                                />
                            </div>
                            <button className="flex items-center justify-center w-[42px] h-[42px] bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#1d1b41] hover:border-[#1d1b41]/30 transition-all shadow-sm">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                    {activeTab === 'transactions' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Fee (10%)</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Net Credit</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#1d1b41]/5 flex items-center justify-center text-[10px] font-black text-[#1d1b41] group-hover:bg-[#1d1b41] group-hover:text-[#d5a22d] transition-all border border-[#1d1b41]/10">
                                                    {tx.user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-[#1d1b41] uppercase tracking-tight">{tx.user.fullName}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded leading-none border border-slate-200">{tx.referenceId}</span>
                                                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{format(new Date(tx.createdAt), 'MMM d, h:mm a')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-[#d5a22d] bg-[#d5a22d]/10 px-2 py-0.5 rounded-md w-fit uppercase tracking-widest border border-[#d5a22d]/20 mb-1">Application Fee</span>
                                                <span className="text-[11px] font-bold text-slate-500 truncate max-w-[150px]">{tx.application?.program?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-black text-[#1d1b41]">{tx.totalAmount.toLocaleString()} <span className="text-[9px] font-bold text-slate-400 ml-0.5">{tx.currency}</span></p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-xs font-black text-rose-500">-{tx.platformFee.toLocaleString()} <span className="text-[9px] font-bold opacity-60 ml-0.5">{tx.currency}</span></p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-black text-emerald-600">+{tx.schoolAmount.toLocaleString()} <span className="text-[9px] font-bold opacity-70 ml-0.5">{tx.currency}</span></p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                {tx.status === 'SUCCESS' ? (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Success
                                                    </div>
                                                ) : tx.status === 'PENDING' ? (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest border border-amber-100/50">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest border border-rose-100/50">
                                                        Failed
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Request Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Processed Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.payouts?.map((payout: any) => (
                                    <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#1d1b41]/5 flex items-center justify-center text-[#1d1b41] border border-[#1d1b41]/10">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-[#1d1b41] uppercase tracking-tight">Payout Request</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Requested on {format(new Date(payout.requestedAt), 'MMM d, yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-black text-[#1d1b41]">{payout.amount.toLocaleString()} <span className="text-[9px] font-bold text-slate-400 ml-0.5">{payout.currency}</span></p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                                                    payout.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                                    payout.status === 'PROCESSING' ? 'bg-[#1d1b41]/5 text-[#1d1b41] border-[#1d1b41]/10' :
                                                    payout.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100/50' :
                                                    'bg-amber-50 text-amber-600 border-amber-100/50'
                                                }`}>
                                                    {payout.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {payout.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-slate-500">
                                                {payout.processedAt ? format(new Date(payout.processedAt), 'MMM d, yyyy') : <span className="italic opacity-60">Still Pending</span>}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {((activeTab === 'transactions' && filteredTransactions.length === 0) || (activeTab === 'payouts' && data?.payouts?.length === 0)) && (
                    <div className="py-16 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                            <DollarSign className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-sm font-black text-[#1d1b41] tracking-[0.1em] uppercase">No {activeTab === 'transactions' ? 'Transactions' : 'Payouts'} Found</h4>
                        <p className="text-[11px] text-slate-400 font-medium max-w-[250px] mt-2">There is no record of financial activity matching your current criteria.</p>
                    </div>
                )}
            </div>

            <PayoutModal 
                isOpen={isPayoutModalOpen}
                onClose={() => setIsPayoutModalOpen(false)}
                availableBalance={summary.availableBalance}
                currency={currency}
                onSuccess={fetchData}
            />
        </div>
    );
}
