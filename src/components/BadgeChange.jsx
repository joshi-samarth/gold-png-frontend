export function BadgeChange({ value, percentage }) {
    const isPositive = value > 0;
    const symbol = isPositive ? '▲' : value < 0 ? '▼' : '—';
    const bgColor = isPositive ? 'bg-success-bg' : value < 0 ? 'bg-danger-bg' : 'bg-primary-light';
    const textColor = isPositive ? 'text-success' : value < 0 ? 'text-danger' : 'text-text-muted';

    if (value === 0 || value === null || value === undefined) {
        return (
            <span className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-3 py-2 rounded-lg text-sm font-bold`}>
                —
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-3 py-2 rounded-lg text-sm font-bold`}>
            {symbol} ₹{Math.abs(value).toLocaleString('en-IN')}
            {percentage !== undefined && ` (${Math.abs(percentage).toFixed(1)}%)`}
        </span>
    );
}
