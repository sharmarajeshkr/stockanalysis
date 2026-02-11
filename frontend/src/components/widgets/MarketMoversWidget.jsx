import React, { useState, useEffect } from 'react';
import styles from '../../styles/DashboardWidgets.module.css';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const MarketMoversWidget = ({ category }) => {
    const [activeTab, setActiveTab] = useState('Gainers');
    const [marketData, setMarketData] = useState({ gainers: [], losers: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (category !== 'stocks') return;

            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/stocks/market-status`);
                setMarketData({
                    gainers: res.data.gainers || [],
                    losers: res.data.losers || []
                });
            } catch (err) {
                console.error("Failed to fetch market movers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]);

    // Construct data object for render
    const dataStocks = {
        'Gainers': marketData.gainers,
        'Losers': marketData.losers,
        'Volume': [] // Not implemented for now in movers
    };

    // Fallback Mock for Funds/Bonds
    const dataFunds = {
        'Gainers': [
            { name: 'HDFC Small Cap', price: '120.40', change: '+5.40 (4.5%)', volume: 'High', isPositive: true },
        ],
        'Losers': [
            { name: 'Axis Bluechip', price: '45.00', change: '-1.00 (2.2%)', volume: 'Avg', isPositive: false },
        ]
    };

    const activeData = category === 'stocks' ? dataStocks : dataFunds;

    const availableTabs = ['Gainers', 'Losers'].filter(tab => {
        return activeData[tab] && activeData[tab].length > 0;
    });

    if (availableTabs.length === 0) availableTabs.push('Gainers');

    return (
        <div className={styles.widgetContainer} style={{ border: 'none', padding: 0, marginTop: '3rem' }}>
            <h3 className={styles.title} style={{ marginBottom: '1rem' }}>Top {category === 'mutualfunds' ? 'Funds' : (category === 'bonds' ? 'Bonds' : 'Market')} Movers</h3>
            <div className={styles.tabsContainer}>
                {availableTabs.map(tab => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
                    <span>Company</span>
                    <div style={{ display: 'flex', gap: '4rem' }}>
                        <span>NAV/Price</span>
                        <span>{category === 'stocks' ? 'Volume' : 'Rating'}</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '1rem', textAlign: 'center' }}>Loading...</div>
                ) : (
                    (activeData[activeTab] || []).map((item, i) => (
                        <div key={i} className={styles.moverRow}>
                            <div className={styles.companyInfo}>
                                <div className={styles.logoBox}>{item.name[0]}</div>
                                <span>{item.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '3rem', textAlign: 'right' }}>
                                <div>
                                    <div>₹{item.price}</div>
                                    <div style={{ color: item.isPositive ? 'var(--accent)' : 'var(--red-accent)', fontSize: '0.8rem' }}>
                                        {item.change}
                                    </div>
                                </div>
                                <div style={{ width: '80px' }}>{category === 'stocks' ? (item.volume / 100000).toFixed(1) + 'L' : 'AAA'}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MarketMoversWidget;
