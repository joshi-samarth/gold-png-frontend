import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Spinner } from './components/Spinner';
import { TodayPage } from './pages/Today';
import { ComparePage } from './pages/Compare';
import { AnalyticsPage } from './pages/Analytics';
import { MyGoldPage } from './pages/MyGold';
import { SoldPage } from './pages/Sold';
import { useGoldData } from './hooks/useGoldData';
import './index.css';

function App() {
    const { today, history, myGold, loading, error, refresh } = useGoldData();

    const lastUpdatedTime = today?.fetchedAt
        ? new Date(today.fetchedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : null;

    if (error && !today) {
        return (
            <Layout>
                <div className="card text-center py-8">
                    <p className="text-red font-bold">Error loading data: {error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <BrowserRouter>
            <Layout lastUpdated={lastUpdatedTime}>
                <Routes>
                    <Route
                        path="/"
                        element={<TodayPage today={today} history={history} loading={loading} onRefresh={refresh} />}
                    />
                    <Route
                        path="/compare"
                        element={<ComparePage today={today} history={history} loading={loading} />}
                    />
                    <Route
                        path="/analytics"
                        element={<AnalyticsPage today={today} history={history} myGold={myGold} loading={loading} />}
                    />
                    <Route
                        path="/mygold"
                        element={<MyGoldPage today={today} myGold={myGold} loading={loading} onRefresh={refresh} />}
                    />
                    <Route
                        path="/sold"
                        element={<SoldPage today={today} myGold={myGold} loading={loading} onRefresh={refresh} />}
                    />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
