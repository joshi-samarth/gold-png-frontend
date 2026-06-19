import { useState } from 'react';
import { GoldCard } from '../components/GoldCard';
import { Spinner } from '../components/Spinner';
import { SellModal } from '../components/SellModal';
import { updateMyGold } from '../api';
import { sellTola, fmt, metalNames } from '../utils';

export function MyGoldPage({ today, myGold, loading, onRefresh }) {
    const [tempGold, setTempGold] = useState(myGold);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    if (loading || !today || !tempGold) return <Spinner />;

    const metals = ['gold22ct', 'gold24ct995', 'gold18ct'];

    const handleTolasChange = (category, value) => {
        setTempGold({
            ...tempGold,
            [category === 'gold24ct995' ? 'gold24ct' : category]: Math.max(0, value)
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateMyGold({
                gold18ct: tempGold.gold18ct,
                gold22ct: tempGold.gold22ct,
                gold24ct: tempGold.gold24ct
            });
            onRefresh();
            setSaving(false);
        } catch (error) {
            console.error('Save error:', error);
            setSaving(false);
        }
    };

    // Calculate portfolio value
    const portfolioValue = metals.reduce((sum, metal) => {
        const fieldName = metal === 'gold24ct995' ? 'gold24ct' : metal;
        const tola = tempGold[fieldName] || 0;
        const rate = today[metal];
        const sell = sellTola(rate, metal);
        return sum + Math.round(sell * tola);
    }, 0);

    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-text mb-1 md:mb-2">My Gold</h1>
            <p className="text-xs md:text-sm text-text-muted mb-6 md:mb-8">Track your personal gold holdings</p>

            {/* Portfolio Value Hero */}
            <div className="gradient-gold text-white p-6 md:p-8 rounded-lg md:rounded-xl mb-6 md:mb-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-xs md:text-sm font-bold text-white/80 mb-2 md:mb-3">Total Portfolio Value</h2>
                    <div className="text-4xl md:text-5xl lg:text-6xl font-mono-bold mb-2 md:mb-3">{fmt(portfolioValue)}</div>
                    <p className="text-xs md:text-sm text-white/80">After 3% dealer cut · Based on today's sell rates</p>
                </div>
            </div>

            {/* Gold Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {metals.map((metal) => {
                    const fieldName = metal === 'gold24ct995' ? 'gold24ct' : metal;
                    return (
                        <GoldCard
                            key={metal}
                            category={metal}
                            rate={today[metal]}
                            currentTola={tempGold[fieldName]}
                            onTolasChange={(value) => handleTolasChange(metal, value)}
                        />
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 md:gap-4 flex-col sm:flex-row">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                    💾 {saving ? 'Saving...' : 'Save Amounts'}
                </button>
                <button onClick={() => setModalOpen(true)} className="btn-primary flex-1">
                    💸 Record a Sale
                </button>
            </div>

            {/* Sell Modal */}
            <SellModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                today={today}
                myGold={tempGold}
                onSuccess={onRefresh}
            />
        </div>
    );
}
