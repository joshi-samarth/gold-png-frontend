// Analytics & calculation utilities
export const METALS = [
    { key: 'gold22ct', label: 'Gold 22 Ct', sub: '916 purity', defaultTola: 13.783 },
    { key: 'gold24ct995', label: 'Gold 24 Ct (995)', sub: '995 purity', defaultTola: 8 },
    { key: 'gold18ct', label: 'Gold 18 Ct', sub: '750 purity', defaultTola: 14.263 },
];

export const CUT = 0.03;

export const toTola = (g) => g != null ? parseFloat((g * 10).toFixed(2)) : null;
export const sellTola = (g) => g != null ? Math.round(g * 10 * (1 - CUT)) : null;
export const fmt = (n) => n != null ? '₹' + Math.round(n).toLocaleString('en-IN') : '—';

// Portfolio value on a given day's rate record
export function portfolioValue(record, myGold) {
    if (!record) return null;
    const v22 = sellTola(record.gold22ct) * (myGold?.gold22ct || 13.783);
    const v24 = sellTola(record.gold24ct995) * (myGold?.gold24ct || 8);
    const v18 = sellTola(record.gold18ct) * (myGold?.gold18ct || 14.263);
    return Math.round(v22 + v24 + v18);
}

// Find best (highest) sell day in history
export function bestSellDay(history, metalKey) {
    if (!history?.length) return null;
    return history.reduce((best, d) =>
        (d[metalKey] || 0) > (best[metalKey] || 0) ? d : best
        , history[0]);
}

// Find worst (lowest) sell day in history
export function worstSellDay(history, metalKey) {
    if (!history?.length) return null;
    return history.reduce((worst, d) =>
        (d[metalKey] || 0) < (worst[metalKey] || 0) ? d : worst
        , history[0]);
}

// Portfolio peak value
export function portfolioPeak(history, myGold) {
    if (!history?.length) return { value: 0, date: null, record: null };
    let peak = { value: 0, date: null, record: null };
    history.forEach(record => {
        const value = portfolioValue(record, myGold);
        if (value > peak.value) {
            peak = { value, date: record.date, record };
        }
    });
    return peak;
}

// Format date for display
export function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Format date with year
export function formatDateFull(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Generate auto insights
export function generateInsights(today, history, myGold) {
    const insights = [];
    if (!today?.gold22ct || !history?.length) return insights;

    const last30 = history.slice(-30);
    const last7 = history.slice(-7);

    // Is today the highest in 30 days?
    const max30 = Math.max(...last30.map(d => d.gold22ct || 0));
    if (today.gold22ct >= max30) {
        insights.push({
            icon: '💡',
            bold: 'Gold 22 Ct is at its highest price in 30 days.',
            muted: 'This could be a good time to sell if you are planning to.'
        });
    }

    // Week change
    if (last7.length > 0 && last7[0]?.gold22ct) {
        const weekChange = toTola(today.gold22ct) - toTola(last7[0].gold22ct);
        if (weekChange < 0) {
            insights.push({
                icon: '📉',
                bold: `Gold went down ₹${Math.abs(Math.round(weekChange)).toLocaleString('en-IN')}/tola this week.`,
                muted: 'If you are not in a hurry to sell, you may want to wait a few days.'
            });
        } else if (weekChange > 0) {
            insights.push({
                icon: '📈',
                bold: `Gold went up ₹${Math.round(weekChange).toLocaleString('en-IN')}/tola this week.`,
                muted: 'Price has been rising. Good if you already sold.'
            });
        }
    }

    // Total portfolio value
    const total = portfolioValue(today, myGold);
    if (total) {
        insights.push({
            icon: '💰',
            bold: `If you sold all your gold today, you would get ${fmt(total)}.`,
            muted: 'This is after the 3% dealer cut.'
        });
    }

    // Best day in last 30
    const best = bestSellDay(last30, 'gold22ct');
    if (best) {
        const bestDate = formatDate(best.date);
        const bestPrice = sellTola(best.gold22ct);
        const todayPrice = sellTola(today.gold22ct);
        const diff = Math.round(todayPrice - bestPrice);
        insights.push({
            icon: '📅',
            bold: `Best sell day last month was ${bestDate} — rate was ${fmt(bestPrice)}/tola.`,
            muted: `Today is ₹${Math.abs(diff).toLocaleString('en-IN')} ${diff < 0 ? 'lower' : 'higher'}.`
        });
    }

    // Biggest holding
    const holdings = [
        { label: '22 Ct', value: sellTola(today.gold22ct) * (myGold?.gold22ct || 13.783) },
        { label: '24 Ct', value: sellTola(today.gold24ct995) * (myGold?.gold24ct || 8) },
        { label: '18 Ct', value: sellTola(today.gold18ct) * (myGold?.gold18ct || 14.263) },
    ].sort((a, b) => b.value - a.value);

    if (holdings[0].value > 0) {
        insights.push({
            icon: '🏅',
            bold: `Your ${holdings[0].label} gold is your most valuable holding — worth ${fmt(Math.round(holdings[0].value))}.`,
            muted: `Followed by ${holdings[1].label} at ${fmt(Math.round(holdings[1].value))}.`
        });
    }

    return insights;
}
