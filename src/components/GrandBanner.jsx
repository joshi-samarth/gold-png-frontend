import { fmt, sellTola } from '../utils';

export function GrandBanner({ myGold, today, totalSold }) {
    if (!myGold || !today) return null;

    const metals = ['gold22ct', 'gold24ct995', 'gold18ct'];
    const holdingValue = metals.reduce((sum, metal) => {
        const fieldName = metal === 'gold24ct995' ? 'gold24ct' : metal;
        const tola = myGold[fieldName] || 0;
        const rate = today[metal];
        const sell = sellTola(rate);
        return sum + Math.round(sell * tola);
    }, 0);

    const grandTotal = holdingValue + totalSold;

    return (
        <div className="gradient-primary text-white p-6 md:p-8 rounded-lg md:rounded-xl mb-6 md:mb-8 shadow-lg">
            <div className="text-center">
                <h2 className="text-sm md:text-base font-bold text-white/80 mb-2 md:mb-3">
                    💰 Total Wealth — Gold Held + Already Sold
                </h2>
                <div className="text-4xl md:text-5xl lg:text-6xl font-mono-bold mb-8 md:mb-10">
                    {fmt(grandTotal)}
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-10">
                    <div className="bg-white/15 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-white/20">
                        <div className="text-xs md:text-sm font-bold text-white/80 mb-2">Gold You Still Hold</div>
                        <div className="text-2xl md:text-3xl font-mono-bold text-white">{fmt(holdingValue)}</div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 border border-white/20">
                        <div className="text-xs md:text-sm font-bold text-white/80 mb-2">Already Sold</div>
                        <div className="text-2xl md:text-3xl font-mono-bold text-white">{fmt(totalSold)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
