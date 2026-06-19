// Metal-specific dealer cuts
const DEALER_CUTS = {
    gold22ct: 0.03,
    gold24ct995: 0.04,
    gold18ct: 0.03
};

const getDealerCut = (metalKey) => DEALER_CUTS[metalKey] || 0.03;

export const toTola = (perGram) => (perGram != null ? parseFloat((perGram * 10).toFixed(2)) : null);
export const sellTola = (perGram, metalKey = 'gold22ct') => (perGram != null ? Math.round(perGram * 10 * (1 - getDealerCut(metalKey))) : null);
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
