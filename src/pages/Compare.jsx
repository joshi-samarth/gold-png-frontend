import { toTola, fmt, metalNames } from '../utils';
import { BadgeChange } from '../components/BadgeChange';
import { Spinner } from '../components/Spinner';

export function ComparePage({ today, history, loading }) {
    if (loading) return <Spinner />;

    const metals = ['gold22ct', 'gold24ct995', 'gold18ct'];

    const findHistoryByDaysBack = (days) => {
        if (!today) return null;
        const targetDate = new Date(today.date);
        targetDate.setDate(targetDate.getDate() - days);
        const targetDateStr = targetDate.toISOString().split('T')[0];

        return history.find(h => h.date === targetDateStr) ||
            history.find(h => h.date < targetDateStr);
    };

    const yesterday = history && history.length > 1 ? history[history.length - 2] : null;
    const sevenDaysAgo = findHistoryByDaysBack(7);
    const thirtyDaysAgo = findHistoryByDaysBack(30);

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-1 md:mb-2">Compare Prices</h1>
            <p className="text-xs md:text-sm text-text-muted mb-6 md:mb-8">Track price changes over time</p>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Price Change Table */}
                <div className="card">
                    <h2 className="text-lg md:text-xl font-bold text-text mb-4 md:mb-6">Price Changes</h2>
                    <div className="overflow-x-auto -mx-4 sm:-mx-0">
                        <table className="w-full text-xs md:text-sm">
                            <thead className="bg-primary-light border-b-2 border-primary/20">
                                <tr>
                                    <th className="text-left px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Metal</th>
                                    <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">vs Yesterday</th>
                                    <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">vs 7 Days</th>
                                    <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">vs 30 Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metals.map((metal, idx) => {
                                    const todayTola = toTola(today[metal]);
                                    const yesterdayTola = toTola(yesterday?.[metal] || 0);
                                    const sevenDaysAgoTola = toTola(sevenDaysAgo?.[metal] || 0);
                                    const thirtyDaysAgoTola = toTola(thirtyDaysAgo?.[metal] || 0);

                                    const changeVsYesterday = todayTola - yesterdayTola;
                                    const changeVs7 = todayTola - sevenDaysAgoTola;
                                    const changeVs30 = todayTola - thirtyDaysAgoTola;

                                    const pctYesterday = yesterdayTola ? (changeVsYesterday / yesterdayTola) * 100 : 0;
                                    const pct7 = sevenDaysAgoTola ? (changeVs7 / sevenDaysAgoTola) * 100 : 0;
                                    const pct30 = thirtyDaysAgoTola ? (changeVs30 / thirtyDaysAgoTola) * 100 : 0;

                                    return (
                                        <tr key={metal} className={`border-b border-border transition-colors ${idx % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg'
                                            } hover:bg-primary-light/50`}>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 font-bold text-text">{metalNames[metal]}</td>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 text-right">
                                                <BadgeChange value={changeVsYesterday} percentage={pctYesterday} />
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 text-right">
                                                <BadgeChange value={changeVs7} percentage={pct7} />
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 text-right">
                                                <BadgeChange value={changeVs30} percentage={pct30} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actual Rates Table */}
                <div className="card">
                    <h2 className="text-lg md:text-xl font-bold text-text mb-4 md:mb-6">Actual Rates (Per Tola)</h2>
                    <div className="overflow-x-auto -mx-4 sm:-mx-0">
                        <table className="w-full text-xs md:text-sm">
                            <thead className="bg-primary-light border-b-2 border-primary/20">
                                <tr>
                                    <th className="text-left px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Metal</th>
                                    <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Today</th>
                                    <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">7 Days</th>
                                    <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">30 Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {metals.map((metal, idx) => {
                                    const todayTola = toTola(today[metal]);
                                    const sevenDaysAgoTola = toTola(sevenDaysAgo?.[metal] || 0);
                                    const thirtyDaysAgoTola = toTola(thirtyDaysAgo?.[metal] || 0);

                                    return (
                                        <tr key={metal} className={`border-b border-border transition-colors ${idx % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg'
                                            } hover:bg-primary-light/50`}>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 font-bold text-text">{metalNames[metal]}</td>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono text-text font-bold">{fmt(todayTola)}</td>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono text-text">
                                                {sevenDaysAgo ? fmt(sevenDaysAgoTola) : '—'}
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono text-text">
                                                {thirtyDaysAgo ? fmt(thirtyDaysAgoTola) : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
