import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCountryDirectorAnalytics } from '@/lib/actions/analytics';
import StatsCard from '@/components/dashboard/analytics/StatsCard';
import EnrollmentAreaChart from '@/components/dashboard/analytics/EnrollmentAreaChart';
import ConversionBarChart from '@/components/dashboard/analytics/ConversionBarChart';
import {
    Building2,
    Users,
    FileText,
    ChevronRight,
    Search,
    TrendingUp,
    Globe,
    Plus,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Page() {
    const analytics = await getCountryDirectorAnalytics();

    if (!analytics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-brand-primary/5 rounded-[2.5rem] flex items-center justify-center text-brand-accent">
                    <Globe className="w-12 h-12 animate-pulse" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-brand-primary tracking-tight">Profile Pending Configuration</h1>
                    <p className="text-slate-500 font-medium max-w-md mx-auto italic">
                        Your account has not yet been assigned to a regional territory. Please contact the Super Admin to finalize your country appointment.
                    </p>
                </div>
                <Link href="/">
                    <Button variant="outline" className="rounded-2xl font-bold px-8">
                        Return Home
                    </Button>
                </Link>
            </div>
        );
    }

    const { metrics, chartData, countryName } = analytics;

    // Derived stats for the "Attention Needed" section
    const partnerCount = metrics.find(m => m.label === 'Partners')?.value || 0;
    const universityCount = metrics.find(m => m.label === 'Universities')?.value || 0;

    return (
        <div className="w-full space-y-8 pb-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Globe className="w-3 h-3" />
                        Executive Overview
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Managing Tenpaten operations in <span className="font-bold text-brand-accent">{countryName}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-accent transition-colors" />
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="pl-12 pr-6 py-3.5 bg-slate-50/10 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-accent focus:bg-slate-50/20 transition-all w-64 shadow-sm text-white"
                        />
                    </div>
                    <Link href="/dashboard/country-director/universities/create">
                        <Button className="h-12 px-6 bg-brand-primary hover:bg-brand-primary-hover text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg shadow-brand-primary/20 transition-all transform hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5 mr-2 text-brand-accent" />
                            Add University
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {metrics.map((stat, idx) => (
                    <StatsCard
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        trendUp={true}
                    />
                ))}
            </div>

            {/* Analytics & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <EnrollmentAreaChart data={chartData} title="Regional Application Growth" />
                </div>

                <Card className="border-none shadow-2xl shadow-brand-primary/20 rounded-[2.5rem] bg-linear-to-br from-brand-primary to-brand-primary-hover text-white overflow-hidden relative group h-full">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none group-hover:bg-brand-accent/20 transition-colors duration-500" />
                    
                    <CardHeader className="p-10 pb-6 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 w-fit mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                            System Status
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tight">Regional Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 pt-2 space-y-6 relative z-10">
                        <div className="space-y-4">
                            <Link href="/dashboard/country-director/affiliates" className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-brand-accent/10 transition-all cursor-pointer group/item block">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold uppercase tracking-tight">Affiliate Review</p>
                                    <ChevronRight className="w-4 h-4 text-white/50 group-hover/item:translate-x-1 transition-transform group-hover/item:text-brand-accent" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-brand-accent text-brand-primary text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                                        {partnerCount}
                                    </span>
                                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Pending Review</p>
                                </div>
                            </Link>
                            <Link href="/dashboard/country-director/universities" className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-brand-accent/10 transition-all cursor-pointer group/item block">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold uppercase tracking-tight">Institution Hub</p>
                                    <ChevronRight className="w-4 h-4 text-white/50 group-hover/item:translate-x-1 transition-transform group-hover/item:text-brand-accent" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-brand-accent text-brand-primary text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                                        {universityCount}
                                    </span>
                                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Managed Schools</p>
                                </div>
                            </Link>
                        </div>

                        <Link href="/dashboard/country-director/applications" className="block mt-8">
                            <Button className="w-full h-14 bg-white text-brand-primary hover:bg-[#f8fafc] font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-black/20 transition-all transform hover:translate-y-[-2px]">
                                Open Regional Hub
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-50 p-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-brand-primary/10 text-brand-primary">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-black text-brand-primary">Performance Insights</CardTitle>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Growth Metrics</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center p-6 bg-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.3]" />
                        <div className="w-full h-full relative z-10">
                            <ConversionBarChart />
                        </div>
                    </CardContent>
                </Card>

                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-gray-100 relative overflow-hidden group hover:border-brand-accent/20 transition-colors">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-brand-primary rotate-12" />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Regional Support</h4>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-300">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-brand-primary leading-tight mb-1">Partner Helpdesk</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Contact Global HQ</p>
                            </div>
                            <Button size="sm" variant="ghost" className="ml-auto rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
