'use client';

import { useState, useEffect } from 'react';
import { 
    Globe, 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Users, 
    CreditCard, 
    Search, 
    Filter, 
    CheckCircle2, 
    Clock, 
    ArrowUpRight,
    Building2,
    Briefcase,
    ShieldCheck,
    Download,
    Eye,
    School
} from 'lucide-react';
import { 
    getGlobalFinancialOverview, 
    updatePayoutStatus, 
    updateAffiliatePayoutStatus 
} from '@/lib/actions/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function GlobalFinanceClient() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'affiliates'>('overview');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const result = await getGlobalFinancialOverview();
            setData(result);
        } catch (error) {
            console.error('Failed to fetch global financial data:', error);
            toast.error('Failed to load financial data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdatePayout = async (payoutId: string, status: string) => {
        try {
            await updatePayoutStatus(payoutId, status);
            toast.success(`Payout successfully marked as ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update payout status');
        }
    };

    const handleUpdateAffiliatePayout = async (payoutId: string, status: string) => {
        try {
            await updateAffiliatePayoutStatus(payoutId, status);
            toast.success(`Affiliate payout successfully marked as ${status}`);
            fetchData();
        } catch (error) {
            toast.error('Failed to update affiliate payout status');
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl mb-4 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-indigo-300 animate-spin" />
                </div>
                <div className="h-4 w-32 bg-indigo-50 rounded-full" />
            </div>
        );
    }

    const { summary, transactions, payouts, affiliatePayouts, currency } = data;

    const filteredTransactions = transactions.filter((tx: any) => 
        tx.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.university?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-[#36335e] tracking-tight mb-2">Global Financial Console</h1>
                    <p className="text-slate-500 font-medium italic">Monitor platform revenue, school earnings, and affiliate distributions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-2 font-bold gap-2">
                        <Download className="w-4 h-4" />
                        Platform Report
                    </Button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" />
                        Live Treasury
                    </div>
                </div>
            </div>

            {/* Global Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-[#36335e] to-[#2a284a] text-white p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-900/20 relative overflow-hidden group transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6 text-[#d5a22d]" />
                        </div>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total Platform Volume</p>
                        <h2 className="text-3xl font-black">{summary.totalVolume.toLocaleString()} <span className="text-sm font-bold opacity-60 ml-0.5">{currency}</span></h2>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                            <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Tenpaten Revenue</p>
                        <h2 className="text-3xl font-black text-[#36335e]">{summary.totalPlatformRevenue.toLocaleString()} <span className="text-sm font-bold text-slate-400 ml-0.5">{currency}</span></h2>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-amber-600" />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Affiliate Commissions</p>
                        <h2 className="text-3xl font-black text-[#36335e]">{summary.totalAffiliateCommissions.toLocaleString()} <span className="text-sm font-bold text-slate-400 ml-0.5">{currency}</span></h2>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Disbursable to Schools</p>
                        <h2 className="text-3xl font-black text-[#36335e]">{summary.totalSchoolEarnings.toLocaleString()} <span className="text-sm font-bold text-slate-400 ml-0.5">{currency}</span></h2>
                    </div>
                </div>
            </div>

            {/* Main Tabs Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-3 pb-2 transition-all relative ${activeTab === 'overview' ? 'text-[#36335e]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-lg font-black">All Transactions</span>
                            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#36335e] rounded-full" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab('payouts')}
                            className={`flex items-center gap-3 pb-2 transition-all relative ${activeTab === 'payouts' ? 'text-[#36335e]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <CreditCard className="w-5 h-5" />
                            <span className="text-lg font-black">School Payouts</span>
                            {payouts.some((p: any) => p.status === 'PENDING') && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                                    {payouts.filter((p: any) => p.status === 'PENDING').length}
                                </span>
                            )}
                            {activeTab === 'payouts' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#36335e] rounded-full" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab('affiliates')}
                            className={`flex items-center gap-3 pb-2 transition-all relative ${activeTab === 'affiliates' ? 'text-[#36335e]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Briefcase className="w-5 h-5" />
                            <span className="text-lg font-black">Affiliate Payouts</span>
                            {affiliatePayouts.some((p: any) => p.status === 'PENDING') && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                                    {affiliatePayouts.filter((p: any) => p.status === 'PENDING').length}
                                </span>
                            )}
                            {activeTab === 'affiliates' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#36335e] rounded-full" />}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Search everything..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 h-12 w-full md:w-64 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="overflow-x-auto min-h-[400px]">
                    {activeTab === 'overview' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction / Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Breakdown</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amounts</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#36335e] group-hover:text-white transition-all">
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#36335e]">{tx.referenceId}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{format(new Date(tx.createdAt), 'MMM d, yyyy • h:mm a')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <School className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-600">{tx.university?.name || 'Platform'}</span>
                                                </div>
                                                {tx.affiliate && (
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="w-3.5 h-3.5 text-[#d5a22d]" />
                                                        <span className="text-[10px] font-black text-[#d5a22d] uppercase tracking-wider">{tx.affiliate.user.fullName}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-xs font-medium text-slate-500">{tx.user.fullName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-[#36335e]">{tx.totalAmount.toLocaleString()} {tx.currency}</p>
                                                <div className="flex flex-col text-[10px] font-bold text-slate-400">
                                                    <span className="text-rose-400">-{tx.platformFee.toLocaleString()} (Our Fee)</span>
                                                    {tx.affiliateAmount > 0 && <span className="text-amber-500">-{tx.affiliateAmount.toLocaleString()} (Affiliate)</span>}
                                                    <span className="text-emerald-500">= {tx.schoolAmount.toLocaleString()} (School)</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    tx.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                    {tx.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                                                    {tx.status === 'PENDING' && <Clock className="w-3 h-3" />}
                                                    {tx.status}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : activeTab === 'payouts' ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">School / Request Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payouts.map((payout: any) => (
                                    <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#36335e]">{payout.university.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Requested {format(new Date(payout.requestedAt), 'MMM d, yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-sm font-black text-[#36335e]">{payout.amount.toLocaleString()} {payout.currency}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    payout.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    payout.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    payout.status === 'PROCESSING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                    {payout.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center gap-2">
                                                {payout.status === 'PENDING' && (
                                                    <>
                                                        <Button 
                                                            size="sm" 
                                                            className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-wider"
                                                            onClick={() => handleUpdatePayout(payout.id, 'PROCESSING')}
                                                        >
                                                            Start Processing
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            className="h-8 rounded-lg text-rose-600 border-rose-200 hover:bg-rose-50 text-[10px] font-black uppercase tracking-wider"
                                                            onClick={() => handleUpdatePayout(payout.id, 'REJECTED')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {payout.status === 'PROCESSING' && (
                                                    <Button 
                                                        size="sm" 
                                                        className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-wider"
                                                        onClick={() => handleUpdatePayout(payout.id, 'COMPLETED')}
                                                    >
                                                        Mark as Completed
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
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
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Affiliate / Request Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {affiliatePayouts.map((payout: any) => (
                                    <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#36335e]">{payout.affiliate.user.fullName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Requested {format(new Date(payout.requestedAt), 'MMM d, yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-sm font-black text-[#36335e]">{payout.amount.toLocaleString()} {payout.currency}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                    payout.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    payout.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    payout.status === 'PROCESSING' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    'bg-rose-50 text-rose-600 border-rose-100'
                                                }`}>
                                                    {payout.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center gap-2">
                                                {payout.status === 'PENDING' && (
                                                    <>
                                                        <Button 
                                                            size="sm" 
                                                            className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase tracking-wider"
                                                            onClick={() => handleUpdateAffiliatePayout(payout.id, 'PROCESSING')}
                                                        >
                                                            Start Processing
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            className="h-8 rounded-lg text-rose-600 border-rose-200 hover:bg-rose-50 text-[10px] font-black uppercase tracking-wider"
                                                            onClick={() => handleUpdateAffiliatePayout(payout.id, 'REJECTED')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                {payout.status === 'PROCESSING' && (
                                                    <Button 
                                                        size="sm" 
                                                        className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[10px] font-black uppercase tracking-wider"
                                                        onClick={() => handleUpdateAffiliatePayout(payout.id, 'COMPLETED')}
                                                    >
                                                        Mark as Completed
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
