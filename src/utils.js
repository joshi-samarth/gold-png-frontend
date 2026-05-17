const DEALER_CUT = 0.03;

export const toTola = (perGram) => (perGram != null ? parseFloat((perGram * 10).toFixed(2)) : null);
export const sellTola = (perGram) => (perGram != null ? Math.round(perGram * 10 * (1 - DEALER_CUT)) : null);
export const fmt = (n) => (n != null ? '₹' + Math.round(n).toLocaleString('en-IN') : '—');

export const metalNames = {
    gold22ct: 'Gold 22 Ct',
    gold24ct995: 'Gold 24 Ct',
    gold18ct: 'Gold 18 Ct'
};

export const metalPurity = {
    gold22ct: '916 purity',
    gold24ct995: '995 purity',
    gold18ct: '750 purity'
};
