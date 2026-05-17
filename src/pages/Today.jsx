import { useState } from 'react';
import { RateCard } from '../components/RateCard';
import { MetalTable } from '../components/MetalTable';
import { Spinner } from '../components/Spinner';
import { fetchNow } from '../api';
import { RefreshCw } from 'lucide-react';

export function TodayPage({ today, history, loading, onRefresh }) {
    const [refreshing, setRefreshing] = useState(false);

    const yesterday = history && history.length > 1 ? history[history.length - 2] : null;

    const handleFetchNow = async () => {
        try {
            setRefreshing(true);
            await fetchNow();
            await new Promise(resolve => setTimeout(resolve, 500));
            onRefresh();
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) return <Spinner />;

    const metals = ['gold22ct', 'gold24ct995', 'gold18ct'];
    const lastFetchedTime = today?.fetchedAt
        ? new Date(today.fetchedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : 'Unknown';

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text">Today's Rates</h1>
                    <p className="text-xs md:text-sm text-text-muted">Live gold prices · Pune, India</p>
                </div>
                <button
                    onClick={handleFetchNow}
                    disabled={refreshing}
                    className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Updating...' : 'Refresh'}
                </button>
            </div>

            {/* Rate Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {metals.map((metal) => (
                    <RateCard key={metal} category={metal} today={today} yesterday={yesterday} />
                ))}
            </div>

            {/* Full Rate Table */}
            <div className="card mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-bold text-text mb-4 md:mb-6">Full Rate Details</h2>
                <MetalTable today={today} yesterday={yesterday} />
            </div>

            {/* Last Updated */}
            <div className="text-center text-xs md:text-sm text-text-muted py-4">
                <p>Last updated: <span className="font-mono font-bold text-primary">{lastFetchedTime}</span> IST</p>
            </div>
        </div>
    );
}
