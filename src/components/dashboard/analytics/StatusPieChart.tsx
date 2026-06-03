'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface StatusPieChartProps {
    data: { name: string; value: number }[];
    title?: string;
}

const COLORS = ['#d5a22d', '#001f3f', '#4b5563', '#10b981', '#ef4444', '#8b5cf6', '#f59e0b'];

export default function StatusPieChart({ data, title = "Application Distribution" }: StatusPieChartProps) {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] h-[480px] flex flex-col group hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-brand-primary tracking-tight flex items-center gap-3 lowercase first-letter:uppercase">{title}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Live Distribution</p>
                </div>
                <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-brand-primary uppercase tracking-widest">
                    Real-time
                </div>
            </div>

            <div className="flex-1 w-full relative">
                {/* Centered Metric */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                    <p className="text-3xl font-black text-brand-primary tracking-tighter leading-none">{total}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Total</p>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={85}
                            outerRadius={110}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                    className="hover:opacity-80 transition-opacity cursor-pointer outline-none" 
                                />
                            ))}
                        </Pie>
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
                            itemStyle={{
                                color: '#36335e'
                            }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
