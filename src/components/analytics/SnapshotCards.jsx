import { toTola, sellTola, fmt, formatDateFull, bestSellDay, worstSellDay, portfolioPeak } from '../../utils/goldCalc';

export function SnapshotCards({ today, history, myGold }) {
    if (!today || !history || history.length === 0) return null;

    // Card 1: Best Sell Day (22 Ct) in last 90 days
    const best = bestSellDay(history, 'gold22ct');
    const bestPrice = best ? sellTola(best.gold22ct, 'gold22ct') : 0;
    const bestDate = best ? formatDateFull(best.date) : 'N/A';

    // Card 2: Worst Day in Last 30 Days
    const last30 = history.slice(-30);
    const worst = worstSellDay(last30, 'gold22ct');
    const worstPrice = worst ? sellTola(worst.gold22ct, 'gold22ct') : 0;
    const worstDate = worst ? formatDateFull(worst.date) : 'N/A';

    // Card 3: Price Change This Month
    const currentPrice = toTola(today.gold22ct);
    const monthAgo = history[Math.max(0, history.length - 30)];
    const monthAgoPrice = monthAgo ? toTola(monthAgo.gold22ct) : currentPrice;
    const monthChange = currentPrice - monthAgoPrice;
    const monthPct = monthAgoPrice ? ((monthChange / monthAgoPrice) * 100).toFixed(1) : 0;

    // Card 4: Portfolio Peak
    const peak = portfolioPeak(history, myGold);

    return (
        <div className="space-y-6 md:space-y-0">
            <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted mb-6">
                📊 Quick Snapshot
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Card 1 */}
                <div className="card p-4 md:p-6">
                    <div className="text-xs md:text-sm font-bold uppercase text-text-muted mb-3 md:mb-4 tracking-wide">
                        Best Sell Day (90d)
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-success mb-1 md:mb-2">
                        {fmt(bestPrice)}
                    </div>
                    <div className="text-xs md:text-sm text-text-muted">
                        {bestDate}
                    </div>
                </div>

                {/* Card 2 */}
                <div className="card p-4 md:p-6">
                    <div className="text-xs md:text-sm font-bold uppercase text-text-muted mb-3 md:mb-4 tracking-wide">
                        Lowest Price (30d)
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-danger mb-1 md:mb-2">
                        {fmt(worstPrice)}
                    </div>
                    <div className="text-xs md:text-sm text-text-muted">
                        {worstDate}
                    </div>
                </div>

                {/* Card 3 */}
                <div className="card p-4 md:p-6">
                    <div className="text-xs md:text-sm font-bold uppercase text-text-muted mb-3 md:mb-4 tracking-wide">
                        Change This Month
                    </div>
                    <div className={`text-2xl md:text-3xl font-bold font-mono mb-1 md:mb-2 ${monthChange >= 0 ? 'text-success' : 'text-danger'
                        }`}>
                        {monthChange >= 0 ? '▲' : '▼'} {fmt(Math.abs(monthChange))}
                    </div>
                    <div className="text-xs md:text-sm text-text-muted">
                        ({monthPct > 0 ? '+' : ''}{monthPct}%)
                    </div>
                </div>

                {/* Card 4 */}
                <div className="card p-4 md:p-6">
                    <div className="text-xs md:text-sm font-bold uppercase text-text-muted mb-3 md:mb-4 tracking-wide">
                        Your Portfolio Peak
                    </div>
                    <div className="text-2xl md:text-3xl font-bold font-mono text-gold mb-1 md:mb-2">
                        {fmt(peak.value)}
                    </div>
                    <div className="text-xs md:text-sm text-text-muted">
                        {peak.date ? formatDateFull(peak.date) : 'Calculating...'}
                    </div>
                </div>
            </div>
        </div>
    );
}
