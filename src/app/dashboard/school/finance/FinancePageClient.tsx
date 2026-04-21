'use client';

import { useState, useEffect } from 'react';
import { 
    Wallet, 
    ArrowUpRight, 
    ArrowDownRight, 
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
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#36335e] tracking-tight mb-2">Financial Ledger</h1>
                    <p className="text-slate-500 font-medium italic">Track your institutional revenue, platform fees, and withdrawal balances.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-2 font-bold gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                    <Button 
                        onClick={() => setIsPayoutModalOpen(true)}
                        className="rounded-2xl bg-[#36335e] hover:bg-[#2a284a] text-white font-bold gap-2 px-6 shadow-xl shadow-indigo-900/10"
                    >
                        <ArrowUpRight className="w-4 h-4" />
                        Request Payout
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Available Balance Card */}
                <div className="bg-[#36335e] text-white rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl shadow-indigo-900/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-[#d5a22d]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-3 py-1 rounded-full">Available Balance</span>
                        </div>
                        <div>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Receivable</p>
                            <h2 className="text-4xl font-black tracking-tight">{summary.availableBalance.toLocaleString()} {currency}</h2>
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group relative overflow-hidden transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                            </div>
                            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">+12.5% vs Prev Month</span>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Gross Revenue</p>
                        <h2 className="text-3xl font-black text-[#36335e] tracking-tight">{summary.totalRevenue.toLocaleString()} {currency}</h2>
                    </div>
                </div>

                {/* Tenpaten Cut Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 group relative overflow-hidden transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="text-amber-600 text-[10px] font-black uppercase tracking-widest">Platform Fees (10%)</span>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Tenpaten Service Fee</p>
                        <h2 className="text-3xl font-black text-[#36335e] tracking-tight">{summary.platformFees.toLocaleString()} {currency}</h2>
                    </div>
                </div>
            </div>

            {/* Transaction List Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => setActiveTab('transactions')}
                            className={`flex items-center gap-3 pb-2 transition-all relative ${activeTab === 'transactions' ? 'text-[#36335e]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <History className="w-5 h-5" />
                            <span className="text-lg font-black">Transaction History</span>
                            {activeTab === 'transactions' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#36335e] rounded-full" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab('payouts')}
                            className={`flex items-center gap-3 pb-2 transition-all relative ${activeTab === 'payouts' ? 'text-[#36335e]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span className="text-lg font-black">Payout Records</span>
                            {activeTab === 'payouts' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#36335e] rounded-full" />}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        {activeTab === 'transactions' && (
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    placeholder="Search reference, student..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 h-12 w-full md:w-64 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        )}
                        <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 border border-slate-100">
                            <Filter className="w-4 h-4 text-slate-400" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
                    {activeTab === 'transactions' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fee (10%)</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Net Credit</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-[#36335e] group-hover:text-white transition-all">
                                                    {tx.user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#36335e]">{tx.user.fullName}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded leading-none">{tx.referenceId}</span>
                                                        <span className="text-[10px] text-slate-300">•</span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{format(new Date(tx.createdAt), 'MMM d, h:mm a')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Application Fee</span>
                                                <span className="text-xs font-bold text-slate-500 mt-1 truncate max-w-[150px]">{tx.application?.program?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-sm font-black text-[#36335e]">{tx.totalAmount.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 ml-0.5">{tx.currency}</span></p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-sm font-black text-rose-500">-{tx.platformFee.toLocaleString()} <span className="text-[10px] font-bold opacity-60 ml-0.5">{tx.currency}</span></p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-sm font-black text-emerald-600">+{tx.schoolAmount.toLocaleString()} <span className="text-[10px] font-bold opacity-70 ml-0.5">{tx.currency}</span></p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                {tx.status === 'SUCCESS' ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Success
                                                    </div>
                                                ) : tx.status === 'PENDING' ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100/50">
                                                        <Clock className="w-3 h-3" />
                                                        Pending
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest border border-rose-100/50">
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
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Details</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Processed Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.payouts?.map((payout: any) => (
                                    <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#36335e]">Payout Request</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Requested on {format(new Date(payout.requestedAt), 'MMM d, yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-sm font-black text-[#36335e]">{payout.amount.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 ml-0.5">{payout.currency}</span></p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    payout.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                                    payout.status === 'PROCESSING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100/50' :
                                                    payout.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100/50' :
                                                    'bg-amber-50 text-amber-600 border-amber-100/50'
                                                }`}>
                                                    {payout.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {payout.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-500 italic">
                                                {payout.processedAt ? format(new Date(payout.processedAt), 'MMM d, yyyy') : 'Still Pending'}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {((activeTab === 'transactions' && filteredTransactions.length === 0) || (activeTab === 'payouts' && data?.payouts?.length === 0)) && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                            <DollarSign className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-lg font-black text-[#36335e] tracking-tight">No {activeTab === 'transactions' ? 'Transactions' : 'Payouts'} Found</h4>
                        <p className="text-sm text-slate-400 font-medium max-w-xs mt-2">There is no record of financial activity matching your current criteria.</p>
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
