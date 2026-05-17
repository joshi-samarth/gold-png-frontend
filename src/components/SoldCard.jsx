import { fmt, metalNames } from '../utils';
import { Trash2 } from 'lucide-react';

export function SoldCard({ sale, onDelete }) {
    const showDate = sale.date !== '2025-01-01';
    const displayName = sale.note || metalNames[sale.category] || sale.category;
    const showDetails = sale.amountType !== 'manual_entry';

    return (
        <div className="card">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg md:text-xl text-text">{displayName}</h3>
                    {showDate && <p className="text-xs md:text-sm text-text-muted">{sale.date}</p>}
                    {!showDate && <p className="text-xs md:text-sm text-text-muted">Past sale</p>}
                </div>
            </div>

            <div className="mb-4 md:mb-6">
                <div className="text-2xl md:text-3xl font-bold text-success">{fmt(sale.totalReceived)}</div>
                <div className="text-xs md:text-sm text-text-muted">Amount received</div>
            </div>

            {showDetails && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-primary-light rounded-lg border border-primary/20 text-sm space-y-2 md:space-y-3">
                    <div className="flex justify-between">
                        <span className="text-text-muted">Tola sold</span>
                        <span className="font-mono font-bold text-text">{sale.tolaDeducted}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-muted">Rate/Tola</span>
                        <span className="font-mono font-bold text-text">{fmt(sale.rateAtSale)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-text-muted">Type</span>
                        <span className="font-mono text-xs font-bold text-primary">{sale.amountType}</span>
                    </div>
                </div>
            )}

            {sale.tolaDeducted === 0 && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-primary-light rounded-lg border border-primary/20 text-xs md:text-sm text-text-muted">
                    💳 Amount record only
                </div>
            )}

            <button
                onClick={() => {
                    if (confirm('Delete this entry?')) {
                        onDelete(sale._id);
                    }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 md:py-3 text-danger hover:bg-danger-bg rounded-lg font-bold transition duration-200 text-sm md:text-base"
            >
                <Trash2 size={16} />
                Delete entry
            </button>
        </div>
    );
}
