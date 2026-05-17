import { generateInsights } from '../../utils/goldCalc';

export function InsightsBox({ today, history, myGold }) {
    const insights = generateInsights(today, history, myGold);

    if (!insights || insights.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-text-muted">
                💡 Insights
            </div>

            <div className="card p-4 md:p-6 bg-gold-bg border-2 border-gold-light">
                <div className="space-y-4 md:space-y-6">
                    {insights.map((insight, idx) => (
                        <div key={idx}>
                            <div className="flex gap-3 md:gap-4 mb-2 md:mb-3">
                                <span className="text-lg md:text-xl flex-shrink-0">{insight.icon}</span>
                                <p className="font-bold text-text text-sm md:text-base leading-tight">
                                    {insight.bold}
                                </p>
                            </div>
                            <p className="text-xs md:text-sm text-text-muted leading-relaxed ml-7 md:ml-8">
                                {insight.muted}
                            </p>
                            {idx < insights.length - 1 && (
                                <div className="my-4 md:my-6 border-t border-gold-light/50"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
