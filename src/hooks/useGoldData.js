import { useState, useEffect, useCallback } from 'react';
import { getTodayRates, getHistory, getMyGold } from '../api';

export function useGoldData() {
    const [today, setToday] = useState(null);
    const [history, setHistory] = useState([]);
    const [myGold, setMyGold] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [todayRes, historyRes, myGoldRes] = await Promise.all([
                getTodayRates(),
                getHistory(90),
                getMyGold()
            ]);

            setToday(todayRes.data);
            setHistory(historyRes.data);
            setMyGold(myGoldRes.data);
        } catch (err) {
            setError(err.message);
            console.error('useGoldData error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { today, history, myGold, loading, error, refresh };
}
