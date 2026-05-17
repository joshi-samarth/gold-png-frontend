import { Spinner } from '../components/Spinner';
import { SnapshotCards } from '../components/analytics/SnapshotCards';
import { PriceTrendChart } from '../components/analytics/PriceTrendChart';
import { PortfolioHistoryChart } from '../components/analytics/PortfolioHistoryChart';
import { RateTrendTable } from '../components/analytics/RateTrendTable';
import { MetalCompareCard } from '../components/analytics/MetalCompareCard';
import { InsightsBox } from '../components/analytics/InsightsBox';

export function AnalyticsPage({ today, history, myGold, loading }) {
    if (loading) return <Spinner />;

    if (!today || !history || !myGold) {
        return (
            <div className="card text-center py-12">
                <p className="text-text-muted">Unable to load data. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8 md:space-y-12">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text mb-1 md:mb-2">Analytics</h1>
                <p className="text-xs md:text-sm text-text-muted">Understand your gold better with simple insights</p>
            </div>

            {/* Section 1: Snapshot Cards */}
            <SnapshotCards today={today} history={history} myGold={myGold} />

            {/* Section 2: Price Trend Chart */}
            <PriceTrendChart history={history} />

            {/* Section 3: Portfolio History Chart */}
            <PortfolioHistoryChart history={history} myGold={myGold} />

            {/* Section 4: Rate Trend Table */}
            <RateTrendTable history={history} />

            {/* Section 5: Metal Comparison */}
            <MetalCompareCard today={today} />

            {/* Section 6: Insights Box */}
            <InsightsBox today={today} history={history} myGold={myGold} />
        </div>
    );
}
