import { toTola, sellTola, fmt } from '../../utils/goldCalc';

export function MetalCompareCard({ today }) {
    if (!today) return null;

    // Calculate sell prices
    const sell22 = sellTola(today.gold22ct, 'gold22ct');
    const sell24 = sellTola(today.gold24ct995, 'gold24ct995');
    const sell18 = sellTola(today.gold18ct, 'gold18ct');

    // Calculate market prices (toTola already multiplies by 10)
    const market22 = toTola(today.gold22ct);
    const market24 = toTola(today.gold24ct995);
    const market18 = toTola(today.gold18ct);

    // Bar widths as percentage of 24ct
    const width22 = (sell22 / sell24) * 100;
    const width24 = 100;
    const width18 = (sell18 / sell24) * 100;

    // Differences
    const diff22 = sell24 - sell22;
    const diff18 = sell24 - sell18;

    const metals = [
        {
            label: 'Gold 22 Ct',
            icon: '🟨',
            market: market22,
            sell: sell22,
            width: width22,
            barColor: 'bg-yellow-500',
            diff: diff22
        },
        {
            label: 'Gold 24 Ct',
            icon: '🟡',
            market: market24,
            sell: sell24,
            width: width24,
            barColor: 'bg-gold',
            diff: 0
        },
        {
            label: 'Gold 18 Ct',
            icon: '🟧',
            market: market18,
            sell: sell18,
            width: width18,
            barColor: 'bg-orange-400',
            diff: diff18
        }
    ];

    return (
        <div className="space-y-6">
            <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                ⚖️ Metal Comparison
            </div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {metals.map((metal, idx) => (
                    <div key={idx} className="card p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-4 md:mb-6">
                            <span className="text-2xl">{metal.icon}</span>
                            <div>
                                <h3 className="font-bold text-text text-sm md:text-base">{metal.label}</h3>
                            </div>
                        </div>

                        {/* Market price */}
                        <div className="mb-2 md:mb-3">
                            <div className="text-xs md:text-sm text-text-muted mb-1">Market Price</div>
                            <div className="font-mono font-bold text-primary text-lg md:text-xl">
                                {fmt(metal.market)}
                            </div>
                        </div>

                        {/* Sell price */}
                        <div className="mb-4 md:mb-6">
                            <div className="text-xs md:text-sm text-text-muted mb-1">You Get</div>
                            <div className="font-mono font-bold text-success text-lg md:text-xl">
                                {fmt(metal.sell)}
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4 md:mb-6">
                            <div className="h-3 md:h-4 bg-border rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${metal.barColor} transition-all duration-500`}
                                    style={{ width: `${metal.width}%` }}
                                />
                            </div>
                        </div>

                        {/* Difference */}
                        {metal.diff > 0 && (
                            <div className="text-xs md:text-sm text-danger">
                                ₹{Math.round(metal.diff).toLocaleString('en-IN')} less per tola than 24 Ct
                            </div>
                        )}
                        {metal.diff === 0 && (
                            <div className="text-xs md:text-sm text-text-muted">
                                Highest purity gold
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
