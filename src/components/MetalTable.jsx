import { toTola, sellTola, fmt, metalNames } from '../utils';

export function MetalTable({ today, yesterday }) {
    if (!today) return null;

    const metals = ['gold22ct', 'gold24ct995', 'gold18ct'];

    return (
        <div className="overflow-x-auto -mx-4 sm:-mx-0">
            <table className="w-full text-sm">
                <thead className="bg-primary-light border-b-2 border-primary/20">
                    <tr>
                        <th className="text-left px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Metal</th>
                        <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Per Gram</th>
                        <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">Per Tola</th>
                        <th className="text-right px-3 sm:px-4 py-3 md:py-4 font-bold text-text">You Get/Tola</th>
                    </tr>
                </thead>
                <tbody>
                    {metals.map((metal, index) => {
                        const perGram = today[metal];
                        const tola = toTola(perGram);
                        const sell = sellTola(perGram);

                        return (
                            <tr key={metal} className={`border-b border-border transition-colors ${index % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg'
                                } hover:bg-primary-light/50`}>
                                <td className="px-3 sm:px-4 py-3 md:py-4 text-text font-bold">{metalNames[metal]}</td>
                                <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono text-text">{fmt(perGram)}</td>
                                <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono text-text font-bold">{fmt(tola)}</td>
                                <td className="px-3 sm:px-4 py-3 md:py-4 text-right font-mono text-success font-bold">{fmt(sell)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
