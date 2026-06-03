'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface EnrollmentAreaChartProps {
    data: { name: string; total: number }[];
    title?: string;
}

export default function EnrollmentAreaChart({ data, title = "Application Trends" }: EnrollmentAreaChartProps) {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] h-[480px] flex flex-col group hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-xl font-black text-brand-primary tracking-tight flex items-center gap-3 lowercase first-letter:uppercase">{title}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Enrollment Velocity</p>
                </div>
                <select className="text-[10px] font-black uppercase tracking-widest border border-slate-100 bg-slate-50 rounded-xl p-3 text-brand-primary focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all cursor-pointer">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                </select>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d5a22d" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#d5a22d" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: '900' }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '24px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                                backgroundColor: '#fff',
                                color: '#111827',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                fontSize: '10px',
                                letterSpacing: '0.1em',
                                padding: '16px 24px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#d5a22d"
                            strokeWidth={4}
                            strokeLinecap="round"
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
