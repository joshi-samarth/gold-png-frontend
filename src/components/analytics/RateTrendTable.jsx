import { useState } from 'react';
import { toTola, sellTola, fmt, formatDate } from '../../utils/goldCalc';
import { BadgeChange } from '../BadgeChange';

export function RateTrendTable({ history }) {
    const [selectedGold, setSelectedGold] = useState('gold22ct');

    if (!history || history.length < 2) {
        return (
            <div className="space-y-6">
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                    📊 Last 7 Days
                </div>
                <div className="card p-8 text-center text-text-muted">
                    Not enough data yet
                </div>
            </div>
        );
    }

    const last7 = history.slice(-7).reverse(); // Most recent first

    // Gold type config
    const goldTypes = [
        { key: 'gold22ct', label: '22 Ct', icon: '🟨' },
        { key: 'gold24ct995', label: '24 Ct', icon: '🟡' },
        { key: 'gold18ct', label: '18 Ct', icon: '🟧' }
    ];
    const selectedConfig = goldTypes.find(g => g.key === selectedGold);

    // Calculate ups and downs for selected gold
    let ups = 0, downs = 0;
    for (let i = 0; i < last7.length - 1; i++) {
        const current = toTola(last7[i][selectedGold]);
        const prev = toTola(last7[i + 1][selectedGold]);
        if (current > prev) ups++;
        else if (current < prev) downs++;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                    📊 Last 7 Days
                </div>

                {/* Mobile Gold Selector */}
                <div className="sm:hidden">
                    <select
                        value={selectedGold}
                        onChange={(e) => setSelectedGold(e.target.value)}
                        className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-text font-semibold text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        {goldTypes.map(gold => (
                            <option key={gold.key} value={gold.key}>
                                {gold.icon} {gold.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Desktop Table - All 3 metals */}
            <div className="card p-0 md:p-6 overflow-hidden hidden sm:block">
                <div className="overflow-x-auto -mx-4 sm:-mx-0">
                    <table className="w-full text-xs md:text-sm">
                        <thead className="bg-primary-light border-b-2 border-primary/20">
                            <tr>
                                <th className="text-left px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Date</th>
                                <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">22 Ct / Tola</th>
                                <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">24 Ct / Tola</th>
                                <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">18 Ct / Tola</th>
                                <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Change (22Ct)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {last7.map((record, idx) => {
                                const isToday = idx === 0;
                                const prevRecord = idx < last7.length - 1 ? last7[idx + 1] : null;

                                const curr22 = toTola(record.gold22ct);
                                const prev22 = prevRecord ? toTola(prevRecord.gold22ct) : curr22;
                                const change22 = curr22 - prev22;

                                const curr24 = toTola(record.gold24ct995);
                                const curr18 = toTola(record.gold18ct);

                                return (
                                    <tr
                                        key={record._id || record.date}
                                        className={`border-b border-border transition-colors ${isToday ? 'bg-primary-light/50' : idx % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg'
                                            } hover:bg-primary-light/50`}
                                    >
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-text font-bold">
                                            <div className="flex items-center gap-2">
                                                {isToday && <span className="inline-block text-xs md:text-sm font-bold bg-success text-white px-2 py-1 rounded-full">TODAY</span>}
                                                <span>{formatDate(record.date)}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono font-bold text-text">
                                            {fmt(curr22)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono font-bold text-text">
                                            {fmt(curr24)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono font-bold text-text">
                                            {fmt(curr18)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-right">
                                            {idx < last7.length - 1 ? (
                                                <BadgeChange value={change22} />
                                            ) : (
                                                <span className="text-text-muted text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Table - Selected metal only */}
            <div className="card p-0 md:p-6 overflow-hidden sm:hidden">
                <div className="overflow-x-auto -mx-4 sm:-mx-0">
                    <table className="w-full text-xs md:text-sm">
                        <thead className="bg-primary-light border-b-2 border-primary/20">
                            <tr>
                                <th className="text-left px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Date</th>
                                <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">
                                    {selectedConfig.icon} {selectedConfig.label} / Tola
                                </th>
                                <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {last7.map((record, idx) => {
                                const isToday = idx === 0;
                                const prevRecord = idx < last7.length - 1 ? last7[idx + 1] : null;

                                const currPrice = toTola(record[selectedGold]);
                                const prevPrice = prevRecord ? toTola(prevRecord[selectedGold]) : currPrice;
                                const change = currPrice - prevPrice;

                                return (
                                    <tr
                                        key={record._id || record.date}
                                        className={`border-b border-border transition-colors ${isToday ? 'bg-primary-light/50' : idx % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg'
                                            } hover:bg-primary-light/50`}
                                    >
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-text font-bold">
                                            <div className="flex items-center gap-2">
                                                {isToday && <span className="inline-block text-xs md:text-sm font-bold bg-success text-white px-2 py-1 rounded-full">TODAY</span>}
                                                <span>{formatDate(record.date)}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono font-bold text-text">
                                            {fmt(currPrice)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 md:py-4 text-right">
                                            {idx < last7.length - 1 ? (
                                                <BadgeChange value={change} />
                                            ) : (
                                                <span className="text-text-muted text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Insight */}
            <div className="text-xs md:text-sm text-text-muted">
                Gold {selectedConfig.label} has gone <span className="font-bold text-success">up {ups} days</span> and{' '}
                <span className="font-bold text-danger">down {downs} days</span> in the last 7 days.
            </div>
        </div>
    );
}
