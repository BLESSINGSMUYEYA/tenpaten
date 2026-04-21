'use client';

import { useState, useEffect } from 'react';
import { 
    Globe, 
    PieChart, 
    TrendingUp, 
    Building2, 
    ArrowUpRight, 
    CheckCircle2, 
    Clock, 
    Search,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import { getRegionalFinancialOverview } from '@/lib/actions/finance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import Link from 'next/link';

export default function RegionalFinanceClient() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getRegionalFinancialOverview();
                setData(result);
            } catch (error) {
                console.error('Failed to fetch regional financial data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl mb-4" />
                <div className="h-4 w-32 bg-slate-200 rounded-full" />
            </div>
        );
    }

    const { summary, universityStats, transactions, countryName, currency } = data;

    const filteredTransactions = transactions.filter((tx: any) => 
        tx.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.university.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100/50">
                        <Globe className="w-3 h-3" />
                        Regional Director oversight
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">{countryName} Financial Overview</h1>
                    <p className="text-slate-500 font-medium italic">Monitoring institutional revenue and platform cuts across all {universityStats.length} universities.</p>
                </div>
            </div>

            {/* Regional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#36335e] text-white rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Total Regional Volume</p>
                    <h2 className="text-4xl font-black tracking-tight mb-2">{summary.totalVolume.toLocaleString()} {currency}</h2>
                    <p className="text-white/60 text-xs font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-[#d5a22d]" />
                        Gross processed through Tenpaten
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Regional Platform Revenue</p>
                    <h2 className="text-4xl font-black text-[#36335e] tracking-tight mb-2">{summary.totalPlatformRevenue.toLocaleString()} {currency}</h2>
                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                        Tenpaten Net Commission (10%)
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Total School Payouts Owed</p>
                    <h2 className="text-4xl font-black text-[#36335e] tracking-tight mb-2">{summary.regionalAvailableBalance.toLocaleString()} {currency}</h2>
                    <p className="text-amber-600 text-xs font-bold uppercase tracking-widest">Awaiting Institutional Withdrawal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* University Leaderboard */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-black text-[#36335e]">Top Performers</h3>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {universityStats.map((uni: any, index: number) => (
                                <div key={uni.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs font-black text-slate-300 w-4">{index + 1}</div>
                                        <div>
                                            <p className="text-sm font-black text-[#36335e] group-hover:text-indigo-600 transition-colors">{uni.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{uni.transactionCount} Successful Payments</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-[#36335e]">{uni.totalRevenue.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase leading-none">{currency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Action Card */}
                    <div className="bg-gradient-to-br from-[#36335e] to-[#4f4b8a] p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden group cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#d5a22d]/20 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-xl font-black tracking-tight leading-tight">Generate Regional Report</h4>
                            <p className="text-white/60 text-sm font-medium">Download a comprehensive PDF audit of all universities in {countryName}.</p>
                            <Button className="w-full h-12 bg-[#d5a22d] hover:bg-[#b88e24] text-[#36335e] font-black uppercase tracking-widest rounded-2xl gap-3">
                                Export PDF
                                <ArrowUpRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sub-Ledger (All Regional Transactions) */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden h-full">
                        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#36335e]">
                                    <PieChart className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-black text-[#36335e]">Regional Sub-Ledger</h3>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    placeholder="Search student or school..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 h-12 w-full md:w-64 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction / Student</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">University</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Volume</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredTransactions.map((tx: any) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div>
                                                    <p className="text-sm font-black text-[#36335e]">{tx.user.fullName}</p>
                                                    <p className="text-[10px] font-mono text-slate-300 mt-0.5">{tx.referenceId}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4 text-indigo-400" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{tx.university.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="text-sm font-black text-[#36335e]">{tx.totalAmount.toLocaleString()} {tx.currency}</p>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Net: {tx.schoolAmount.toLocaleString()}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    {tx.status === 'SUCCESS' ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                    ) : (
                                                        <Clock className="w-4 h-4 text-amber-400" />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredTransactions.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No activity found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
