'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ConversionBarChartProps {
    data?: { stage: string; count: number }[];
}

export default function ConversionBarChart({ data }: ConversionBarChartProps) {
    const defaultData = [
        { stage: 'Drafts', count: 120 },
        { stage: 'Submitted', count: 85 },
        { stage: 'Review', count: 45 },
        { stage: 'Offers', count: 20 },
        { stage: 'Enrolled', count: 12 },
    ];

    const chartData = data || defaultData;

    return (
        <div className="w-full h-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                        dataKey="stage"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#9ca3af' }}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            backgroundColor: '#fff',
                            color: '#1a1b41',
                            fontWeight: 'bold'
                        }}
                    />
                    <Bar dataKey="count" fill="#d5a22d" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
