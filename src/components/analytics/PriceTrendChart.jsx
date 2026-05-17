import { useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { toTola, sellTola, fmt, formatDate, bestSellDay } from '../../utils/goldCalc';

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
            {payload.map(p => (
                <div key={p.name} style={{ fontWeight: 700, marginBottom: 4 }}>
                    {p.name}: ₹{Math.round(p.value).toLocaleString('en-IN')}
                </div>
            ))}
        </div>
    );
};

export function PriceTrendChart({ history }) {
    const [selectedMetal, setSelectedMetal] = useState('gold22ct');
    const [selectedPeriod, setSelectedPeriod] = useState('1M');

    if (!history || history.length === 0) {
        return (
            <div className="space-y-6">
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                    📈 Price Trend
                </div>
                <div className="card p-8 text-center text-text-muted">
                    Not enough data yet
                </div>
            </div>
        );
    }

    // Filter history by period
    const getPeriodData = () => {
        const daysMap = { '7D': 7, '1M': 30, '3M': 90 };
        const days = daysMap[selectedPeriod];
        return history.slice(-days);
    };

    const chartData = getPeriodData().map(record => ({
        date: formatDate(record.date),
        rawDate: record.date,
        market: toTola(record[selectedMetal]),
        sell: sellTola(record[selectedMetal])
    }));

    // Find best day in selected period
    const best = bestSellDay(getPeriodData(), selectedMetal);
    const bestPrice = best ? sellTola(best[selectedMetal]) : 0;
    const bestDateStr = best ? formatDate(best.date) : '';

    // Calculate period change
    const firstPrice = chartData.length > 0 ? chartData[0].market : 0;
    const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].market : 0;
    const periodChange = currentPrice - firstPrice;
    const periodChangePct = firstPrice ? ((periodChange / firstPrice) * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                📈 Price Trend
            </div>

            {/* Controls */}
            <div className="space-y-3 md:space-y-4">
                {/* Metal selector */}
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Metal:</span>
                    {['gold22ct', 'gold24ct995', 'gold18ct'].map((metal, idx) => {
                        const labels = ['22 Ct', '24 Ct', '18 Ct'];
                        const isActive = selectedMetal === metal;
                        return (
                            <button
                                key={metal}
                                onClick={() => setSelectedMetal(metal)}
                                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-white border-2 border-primary/20 text-primary hover:border-primary/50 hover:bg-primary/5'
                                    }`}
                            >
                                {labels[idx]}
                            </button>
                        );
                    })}
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
                                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-white border-2 border-primary/20 text-primary hover:border-primary/50 hover:bg-primary/5'
                                    }`}
                            >
                                {period}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Chart */}
            <div className="card p-4 md:p-6 bg-gradient-to-br from-white to-blue-50/30">
                {chartData.length >= 2 ? (
                    <>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-6 mb-6 md:mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md"></div>
                                <span className="text-xs md:text-sm font-semibold text-text">Market Rate</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #10b981 0px, #10b981 3px, transparent 3px, transparent 6px)' }}></div>
                                <span className="text-xs md:text-sm font-semibold text-text">Sell Price</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 45, bottom: 10 }}>
                                <defs>
                                    <linearGradient id="marketGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="sellGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.08)" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
                                    interval={Math.max(0, Math.floor(chartData.length / 8))}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                    tickLine={{ stroke: '#e5e7eb' }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                                    label={{ value: '₹/Tola', angle: -90, position: 'insideLeft', offset: 5, style: { fontSize: 11, fill: '#6b7280', fontWeight: 500 } }}
                                    axisLine={{ stroke: '#e5e7eb' }}
                                    tickLine={{ stroke: '#e5e7eb' }}
                                    tickFormatter={(value) => {
                                        if (value >= 1000) {
                                            return (value / 1000).toFixed(0) + 'k';
                                        }
                                        return value.toString();
                                    }}
                                    width={40}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '4 4', stroke: '#d1d5db', radius: 4 }} />
                                <Line
                                    type="natural"
                                    dataKey="market"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={false}
                                    isAnimationActive={true}
                                    animationDuration={800}
                                    name="Market Rate"
                                    fillOpacity={1}
                                    fill="url(#marketGrad)"
                                />
                                <Line
                                    type="natural"
                                    dataKey="sell"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    strokeDasharray="6 6"
                                    dot={false}
                                    isAnimationActive={true}
                                    animationDuration={800}
                                    name="Sell Price"
                                    fillOpacity={1}
                                    fill="url(#sellGrad)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </>
                ) : (
                    <div className="text-center py-12 text-text-muted">
                        Not enough data yet
                    </div>
                )}
            </div>

            {/* Insight */}
            <div className="text-xs md:text-sm text-text-muted space-y-2 md:space-y-3">
                <p>
                    <span className="font-bold text-text">
                        Gold is ₹{Math.abs(Math.round(periodChange)).toLocaleString('en-IN')} {periodChange >= 0 ? 'higher' : 'lower'} than {selectedPeriod === '7D' ? 'a week' : selectedPeriod === '1M' ? 'a month' : '3 months'} ago
                    </span>
                    {' '}({periodChangePct > 0 ? '+' : ''}{periodChangePct}%)
                </p>
                <p>
                    Best time to sell in this period was <span className="font-bold text-primary">{bestDateStr}</span> at{' '}
                    <span className="font-bold text-success">{fmt(bestPrice)}/tola</span>.
                </p>
            </div>
        </div>
    );
}
