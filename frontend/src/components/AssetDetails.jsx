import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from './StockChart';
import AnalysisPanel from './AnalysisPanel';
import { useAuth } from '../context/AuthContext';

// API Base URL
const API_URL = 'http://localhost:8000/api';

const AssetDetails = ({ asset, onBack }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState('');

    const { addToWatchlist, addToHoldings } = useAuth();
    const [buyQty, setBuyQty] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch Stock Details & History
                const res = await axios.get(`${API_URL}/stocks/search/${asset.symbol}`);
                setData(res.data);

                // Fetch AI Analysis
                // Note: This might be slow depending on the LLM, so we could separate it
                // or show a secondary loading state. For now, parallel fetch is better.
                axios.post(`${API_URL}/analysis/generate`, {
                    symbol: res.data.symbol,
                    stock_data: res.data
                }).then(analysisRes => {
                    setAnalysis(analysisRes.data.analysis);
                }).catch(err => {
                    console.error("Analysis failed", err);
                    setAnalysis({ summary: "AI Analysis unavailable currently." });
                });

            } catch (err) {
                console.error("Error loading details:", err);
                setError('Failed to load stock details. Please check backend connection.');
                // Fallback to asset prop if fetch fails, so user sees something
                setData({ ...asset, history: [] });
            } finally {
                setLoading(false);
            }
        };

        if (asset?.symbol) {
            fetchData();
        }
    }, [asset]);

    const handleBuy = () => {
        if (data) {
            // Parse price "1,234.50" -> 1234.50 (Handle both string with comma and number)
            let price = data.price;
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/,/g, ''));
            }
            addToHoldings({ symbol: data.symbol, name: data.name }, parseInt(buyQty), price);
            alert(`Bought ${buyQty} shares of ${data.symbol}!`);
        }
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading live analysis for {asset.name}...</div>;
    if (error) return (
        <div className="error-message" style={{ padding: '2rem' }}>
            <div style={{ color: 'var(--red-accent)', marginBottom: '1rem' }}>Error: {error}</div>
            <button onClick={onBack} style={{ background: 'var(--border-color)', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Go Back</button>
        </div>
    );

    return (
        <div className="asset-details-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack} className="back-btn" style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '1rem' }}>
                    ← Back to Portfolio
                </button>
                <button
                    onClick={() => { addToWatchlist({ symbol: data.symbol, price: data.price, change: data.change }); alert('Added to Watchlist'); }}
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                    ★ Watchlist
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ margin: 0 }}>{data?.name}</h1>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{data?.symbol}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0 }}>₹{data?.price}</h2>
                    <div style={{ color: data?.change?.includes('-') ? 'var(--red-accent)' : 'var(--accent)' }}>{data?.change}</div>
                </div>
            </div>

            {data && (
                <>
                    <StockChart data={data.history} symbol={data.symbol} />

                    <div style={{ margin: '2rem 0', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>Buy {data.symbol}</h3>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Add this stock to your portfolio</div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <label>Qty:</label>
                            <input
                                type="number"
                                min="1"
                                value={buyQty}
                                onChange={(e) => setBuyQty(e.target.value)}
                                style={{ padding: '0.5rem', width: '80px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                            />
                            <button
                                onClick={handleBuy}
                                style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Buy Order
                            </button>
                        </div>
                    </div>

                    <AnalysisPanel analysis={analysis} symbol={data.symbol} />
                </>
            )}
        </div>
    );
};

export default AssetDetails;
