'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from 'recharts';

interface YieldRateChartProps {
    data: { name: string; offered: number; accepted: number }[];
}

export default function YieldRateChart({ data }: YieldRateChartProps) {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] h-[480px] flex flex-col group hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-[#36335e] tracking-tight flex items-center gap-3">Yield Rate</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Offers vs Acceptance</p>
                </div>
                <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    Conversion
                </div>
            </div>

            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                            interval={0}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
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
                        <Legend 
                            verticalAlign="top" 
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ paddingBottom: '20px' }}
                            formatter={(value) => (
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">{value}</span>
                            )}
                        />
                        <Bar 
                            dataKey="offered" 
                            fill="#36335e" 
                            radius={[6, 6, 0, 0]} 
                            name="Offers Issued"
                            barSize={20}
                        />
                        <Bar 
                            dataKey="accepted" 
                            fill="#d5a22d" 
                            radius={[6, 6, 0, 0]} 
                            name="Offers Accepted"
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
