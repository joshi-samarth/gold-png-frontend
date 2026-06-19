import { BadgeChange } from './BadgeChange';
import { toTola, sellTola, fmt, metalNames, metalPurity } from '../utils';

export function RateCard({ category, today, yesterday }) {
    if (!today) return null;

    const perGram = today[category];
    const tola = toTola(perGram);
    const sell = sellTola(perGram, category);

    const yesterdayPerGram = yesterday?.[category] || 0;
    const change = perGram - yesterdayPerGram;
    const changePercent = yesterdayPerGram ? (change / yesterdayPerGram) * 100 : 0;

    return (
        <div className="card group">
            <div className="mb-4">
                <h3 className="text-lg md:text-xl font-bold text-text">{metalNames[category]}</h3>
                <p className="text-xs md:text-sm text-text-muted">{metalPurity[category]}</p>
            </div>

            <div className="mb-6">
                <div className="text-3xl md:text-4xl font-mono-bold text-primary mb-2">{fmt(tola)}</div>
                <div className="text-xs md:text-sm text-text-muted">per tola · ₹{Math.round(perGram)}/g</div>
            </div>

            <div className="mb-6 p-3 md:p-4 bg-success-bg rounded-lg border border-success/20">
                <div className="text-xs md:text-sm text-text-muted mb-1">You Get</div>
                <div className="text-2xl md:text-3xl font-bold text-success">{fmt(sell)}</div>
            </div>

            <div>
                <BadgeChange value={change * 10} percentage={changePercent} />
            </div>
        </div>
    );
}
