import { useState } from 'react';
import { fmt, sellTola, metalNames, toTola } from '../utils';
import { recordSale } from '../api';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export function SellModal({ isOpen, onClose, today, myGold, onSuccess }) {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState(null);
    const [tola, setTola] = useState(0);
    const [paymentType, setPaymentType] = useState(null);
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleClose = () => {
        setStep(1);
        setCategory(null);
        setTola(0);
        setPaymentType(null);
        setAmount(0);
        setError(null);
        onClose();
    };

    const handleReset = () => {
        setStep(1);
        setCategory(null);
        setTola(0);
        setPaymentType(null);
        setAmount(0);
        setError(null);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);

            let payload = {
                category,
                tolaDeducted: tola,
                amountType: paymentType === 'today' ? 'today_rate' : paymentType === 'total' ? 'total' : 'per_gram',
                amountValue: amount,
                rateAtSale: 0
            };

            await recordSale(payload);
            setLoading(false);
            handleClose();
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setLoading(false);
        }
    };

    const fieldName = category === 'gold24ct995' ? 'gold24ct' : category;
    const currentTola = myGold?.[fieldName] || 0;
    const rate = today?.[category] || 0;
    const sellRate = sellTola(rate);

    let preview = null;
    if (paymentType === 'today') {
        preview = Math.round(sellRate * tola);
    } else if (paymentType === 'total' && amount) {
        preview = amount;
    } else if (paymentType === 'per_gram' && amount) {
        preview = Math.round(Math.round(amount * 10 * 0.97) * tola);
    }

    const isDesktop = window.innerWidth >= 769;

    const content = (
        <div className="w-full max-w-md mx-auto bg-bg rounded-lg md:rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="gradient-primary text-white p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold">Record a Sale</h2>
                <p className="text-xs md:text-sm text-white/80">Step {step} of 5</p>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 min-h-80">
                {error && (
                    <div className="mb-4 p-3 md:p-4 bg-danger-bg text-danger rounded-lg font-bold text-xs md:text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Step 1: Select Metal */}
                {step === 1 && (
                    <div>
                        <h3 className="font-bold text-text mb-4 md:mb-6 text-base md:text-lg">Which metal?</h3>
                        <div className="space-y-2 md:space-y-3">
                            {['gold22ct', 'gold24ct995', 'gold18ct'].map((m) => {
                                const fieldName = m === 'gold24ct995' ? 'gold24ct' : m;
                                const balance = myGold?.[fieldName] || 0;
                                return (
                                    <button
                                        key={m}
                                        onClick={() => {
                                            setCategory(m);
                                            setStep(2);
                                        }}
                                        className="w-full p-3 md:p-4 border-2 border-border rounded-lg text-left hover:border-primary hover:bg-primary-light/50 transition duration-200"
                                    >
                                        <div className="font-bold text-text text-sm md:text-base">{metalNames[m]}</div>
                                        <div className="text-xs md:text-sm text-text-muted">Available: {balance} tola</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 2: Enter Tola */}
                {step === 2 && (
                    <div>
                        <h3 className="font-bold text-text mb-2 md:mb-3 text-base md:text-lg">How many tola?</h3>
                        <p className="text-xs md:text-sm text-text-muted mb-4 md:mb-6">Available: <span className="font-bold text-primary">{currentTola}</span> tola</p>
                        <input
                            type="number"
                            step="0.001"
                            value={tola}
                            onChange={(e) => setTola(e.target.valueAsNumber)}
                            placeholder="0"
                            className="input-base font-mono text-sm mb-4 md:mb-6"
                        />
                        <button
                            onClick={() => setStep(3)}
                            disabled={tola <= 0 || tola > currentTola}
                            className="w-full btn-primary disabled:opacity-50 text-sm md:text-base"
                        >
                            Next →
                        </button>
                    </div>
                )}

                {/* Step 3: Payment Type */}
                {step === 3 && (
                    <div>
                        <h3 className="font-bold text-text mb-4 md:mb-6 text-base md:text-lg">How were you paid?</h3>
                        <div className="space-y-2 md:space-y-3">
                            <button
                                onClick={() => setStep(5)}
                                className="w-full p-3 md:p-4 border-2 border-border rounded-lg text-left hover:border-success hover:bg-success-bg/50 transition duration-200"
                            >
                                <div className="font-bold text-text text-sm md:text-base">Today's sell rate</div>
                                <div className="text-xs md:text-sm text-text-muted">Auto-calculate</div>
                                <div className="text-sm md:text-base text-success font-bold mt-2">Total: {fmt(Math.round(sellRate * tola))}</div>
                            </button>

                            <button
                                onClick={() => {
                                    setPaymentType('total');
                                    setStep(4);
                                }}
                                className="w-full p-3 md:p-4 border-2 border-border rounded-lg text-left hover:border-primary hover:bg-primary-light/50 transition duration-200"
                            >
                                <div className="font-bold text-text text-sm md:text-base">I know total amount</div>
                                <div className="text-xs md:text-sm text-text-muted">Enter ₹ received for all tola</div>
                            </button>

                            <button
                                onClick={() => {
                                    setPaymentType('per_gram');
                                    setStep(4);
                                }}
                                className="w-full p-3 md:p-4 border-2 border-border rounded-lg text-left hover:border-primary hover:bg-primary-light/50 transition duration-200"
                            >
                                <div className="font-bold text-text text-sm md:text-base">I know per gram rate</div>
                                <div className="text-xs md:text-sm text-text-muted">Enter ₹/gram, calculate total</div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Enter Amount */}
                {step === 4 && (
                    <div>
                        <h3 className="font-bold text-text mb-4 md:mb-6 text-base md:text-lg">
                            {paymentType === 'total' ? 'Total amount received' : 'Rate per gram'}
                        </h3>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.valueAsNumber)}
                            placeholder="0"
                            className="input-base font-mono text-sm mb-4 md:mb-6"
                        />
                        {preview && (
                            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-success-bg rounded-lg border border-success/20">
                                <div className="text-xs md:text-sm text-text-muted">Total you'll receive</div>
                                <div className="text-2xl md:text-3xl font-bold text-success">{fmt(preview)}</div>
                            </div>
                        )}
                        <button
                            onClick={() => setStep(5)}
                            disabled={amount <= 0}
                            className="w-full btn-primary disabled:opacity-50 text-sm md:text-base"
                        >
                            Next →
                        </button>
                    </div>
                )}

                {/* Step 5: Confirm */}
                {step === 5 && (
                    <div>
                        <h3 className="font-bold text-text mb-4 md:mb-6 text-base md:text-lg">Confirm sale</h3>
                        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-primary-light rounded-lg border border-primary/20 space-y-2 md:space-y-3">
                            <div className="flex justify-between">
                                <span className="text-xs md:text-sm text-text-muted">Metal</span>
                                <span className="font-bold text-text text-xs md:text-sm">{metalNames[category]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs md:text-sm text-text-muted">Tola sold</span>
                                <span className="font-mono font-bold text-text text-xs md:text-sm">{tola}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs md:text-sm text-text-muted">Sell rate/tola</span>
                                <span className="font-mono font-bold text-text text-xs md:text-sm">{fmt(sellRate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs md:text-sm text-text-muted">Type</span>
                                <span className="text-xs font-bold text-primary uppercase">
                                    {paymentType === 'today' ? 'Today Rate' : paymentType === 'total' ? 'Total Amount' : 'Per Gram Rate'}
                                </span>
                            </div>
                            <div className="border-t border-primary/30 pt-3 flex justify-between">
                                <span className="font-bold text-text text-xs md:text-sm">You Received</span>
                                <span className="text-xl md:text-2xl font-bold text-success">{fmt(preview)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full btn-primary mb-2 md:mb-3 disabled:opacity-50 text-sm md:text-base"
                        >
                            {loading ? 'Processing...' : '✅ Confirm Sale'}
                        </button>
                        <button onClick={handleReset} className="w-full btn-secondary text-sm md:text-base">
                            ← Start Over
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
                >
                    ✕
                </button>
                {content}
            </div>
        </div>
    );
}
