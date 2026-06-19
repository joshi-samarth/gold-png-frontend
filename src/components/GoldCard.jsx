import { fmt, sellTola, metalNames, metalPurity } from '../utils';

export function GoldCard({ category, rate, currentTola, onTolasChange }) {
    const sellRate = sellTola(rate, category);
    const currentValue = Math.round(sellRate * currentTola);

    return (
        <div className="card">
            <div className="mb-4">
                <h3 className="text-lg md:text-xl font-bold text-text">{metalNames[category]}</h3>
                <p className="text-xs md:text-sm text-text-muted">{metalPurity[category]}</p>
            </div>

            <div className="mb-6">
                <div className="text-2xl md:text-3xl font-bold text-success">{fmt(currentValue)}</div>
                <div className="text-xs md:text-sm text-text-muted">Sell value</div>
            </div>

            <div className="mb-6 p-3 md:p-4 bg-primary-light rounded-lg border border-primary/20">
                <div className="flex justify-between mb-3">
                    <span className="text-xs md:text-sm text-text-muted">Sell Rate/Tola</span>
                    <span className="font-mono font-bold text-text text-sm md:text-base">{fmt(sellRate)}</span>
                </div>
                <div className="flex justify-between mb-3">
                    <span className="text-xs md:text-sm text-text-muted">Your Tola</span>
                    <span className="font-mono font-bold text-text text-sm md:text-base">{currentTola}</span>
                </div>
                <div className="flex justify-between border-t border-primary/30 pt-3">
                    <span className="text-xs md:text-sm text-text-muted font-bold">Your Value</span>
                    <span className="font-mono font-bold text-text text-sm md:text-base">{fmt(currentValue)}</span>
                </div>
            </div>

            <div>
                <label className="block text-xs md:text-sm text-text-muted mb-2 font-medium">Tola (edit)</label>
                <input
                    type="number"
                    step="0.001"
                    value={currentTola}
                    onChange={(e) => onTolasChange(e.target.valueAsNumber)}
                    className="input-base font-mono text-sm"
                />
            </div>
        </div>
    );
}
