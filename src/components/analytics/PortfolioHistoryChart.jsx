import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LabelList
} from 'recharts';
import { portfolioValue, fmt, formatDate } from '../../utils/goldCalc';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#0f2d6b',
            color: '#fff',
            padding: '10px 14px',
            borderRadius: '10px',
            fontFamily: 'DM Mono',
            fontSize: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{ opacity: 0.7, marginBottom: 4, fontFamily: 'Inter', fontWeight: 500 }}>
                {label}
            </div>
            <div style={{ fontWeight: 700 }}>
                ₹{Math.round(payload[0].value).toLocaleString('en-IN')}
            </div>
        </div>
    );
};

export function PortfolioHistoryChart({ history, myGold }) {
    const [selectedPeriod, setSelectedPeriod] = useState('1M');

    if (!history || history.length === 0 || !myGold) {
        return (
            <div className="space-y-6">
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                    💎 Your Portfolio Value
                </div>
                <div className="card p-8 text-center text-text-muted">
                    Not enough data yet
                </div>
            </div>
        );
    }

    const getPeriodData = () => {
        const daysMap = { '7D': 7, '1M': 30, '3M': 90 };
        const days = daysMap[selectedPeriod];
        return history.slice(-days);
    };

    const chartData = getPeriodData().map(record => ({
        date: formatDate(record.date),
        value: portfolioValue(record, myGold)
    }));

    const todayValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
    const firstValue = chartData.length > 0 ? chartData[0].value : 0;
    const change = todayValue - firstValue;
    const changePct = firstValue ? ((change / firstValue) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                💎 Your Portfolio Value
            </div>

            {/* Period selector */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Period:</span>
                {['7D', '1M', '3M'].map((period) => {
                    const isActive = selectedPeriod === period;
                    return (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-r from-gold to-amber-500 text-white shadow-lg scale-105'
                                : 'bg-white border-2 border-gold/20 text-gold hover:border-gold/50 hover:bg-gold/5'
                                }`}
                        >
                            {period}
                        </button>
                    );
                })}
            </div>

            {/* Chart */}
            <div className="card p-4 md:p-6 bg-gradient-to-br from-white to-amber-50/30">
                {chartData.length >= 2 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 45, bottom: 35 }}>
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#b54708" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.08)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                tick={false}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                                label={{ value: '₹ (L)', angle: -90, position: 'insideLeft', offset: 5, style: { fontSize: 11, fill: '#6b7280', fontWeight: 500 } }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={{ stroke: '#e5e7eb' }}
                                tickFormatter={(value) => {
                                    const val = value / 100000;
                                    return val % 1 === 0 ? val.toFixed(0) + 'L' : val.toFixed(1) + 'L';
                                }}
                                width={40}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 8 }} />
                            <Bar
                                dataKey="value"
                                fill="url(#barGrad)"
                                radius={[10, 10, 0, 0]}
                                isAnimationActive={true}
                                animationDuration={800}
                            >
                                <LabelList
                                    dataKey="date"
                                    position="bottom"
                                    fill="#6b7280"
                                    fontSize={11}
                                    fontWeight={500}
                                    offset={8}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center py-12 text-text-muted">
                        Not enough data yet
                    </div>
                )}
            </div>

            {/* Insight */}
            <div className="text-xs md:text-sm text-text-muted space-y-2 md:space-y-3">
                <p>
                    Your gold is worth <span className="font-bold text-text">{fmt(todayValue)}</span> today.
                </p>
                <p>
                    {selectedPeriod === '7D' ? 'A week' : selectedPeriod === '1M' ? 'A month' : '3 months'} ago it was worth{' '}
                    <span className="font-bold text-text">{fmt(firstValue)}</span>.
                </p>
                <p>
                    That's a <span className={`font-bold ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                        {change >= 0 ? 'gain' : 'loss'} of {fmt(Math.abs(change))}
                    </span> ({changePct > 0 ? '+' : ''}{changePct}%).
                </p>
            </div>
        </div>
    );
}
