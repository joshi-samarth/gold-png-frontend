import { useState, useEffect } from 'react';
import { GrandBanner } from '../components/GrandBanner';
import { SoldCard } from '../components/SoldCard';
import { Spinner } from '../components/Spinner';
import { getSoldHistory, deleteSale } from '../api';
import { fmt, sellTola } from '../utils';

export function SoldPage({ today, myGold, loading, onRefresh }) {
    const [sold, setSold] = useState([]);
    const [soldLoading, setSoldLoading] = useState(true);

    useEffect(() => {
        loadSold();
    }, []);

    const loadSold = async () => {
        try {
            setSoldLoading(true);
            const res = await getSoldHistory();
            setSold(res.data);
        } catch (error) {
            console.error('Load sold error:', error);
        } finally {
            setSoldLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteSale(id);
            setSold(sold.filter(s => s._id !== id));
            onRefresh();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete');
        }
    };

    if (loading || !today || !myGold) return <Spinner />;
    if (soldLoading) return <Spinner />;

    const totalSold = sold.reduce((sum, s) => sum + s.totalReceived, 0);
    const numTransactions = sold.length;
    const totalTolaSold = sold.reduce((sum, s) => sum + (s.tolaDeducted || 0), 2);

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-1 md:mb-2">Sold History</h1>
            <p className="text-xs md:text-sm text-text-muted mb-6 md:mb-8">Track your gold sales & wealth</p>

            {/* Grand Banner */}
            <GrandBanner myGold={myGold} today={today} totalSold={totalSold} />

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="card text-center p-4 md:p-6">
                    <div className="text-xs md:text-sm text-text-muted mb-2 md:mb-3 font-medium">Total Received</div>
                    <div className="text-2xl md:text-3xl font-bold text-primary">{fmt(totalSold)}</div>
                </div>
                <div className="card text-center p-4 md:p-6">
                    <div className="text-xs md:text-sm text-text-muted mb-2 md:mb-3 font-medium">Transactions</div>
                    <div className="text-2xl md:text-3xl font-bold text-primary">{numTransactions}</div>
                </div>
                <div className="card text-center p-4 md:p-6">
                    <div className="text-xs md:text-sm text-text-muted mb-2 md:mb-3 font-medium">Total Tola Sold</div>
                    <div className="text-2xl md:text-3xl font-mono-bold text-success">{totalTolaSold.toFixed(3)}</div>
                </div>
            </div>

            {/* Sold Cards Grid */}
            {sold.length > 0 ? (
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {sold.map((sale) => (
                        <SoldCard key={sale._id} sale={sale} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="card text-center py-8 md:py-12">
                    <p className="text-text-muted text-sm md:text-base">No sales recorded yet</p>
                </div>
            )}
        </div>
    );
}
