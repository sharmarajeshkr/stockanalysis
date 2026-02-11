import React, { useState, useEffect } from 'react';
import styles from '../../styles/DashboardWidgets.module.css';
import StockCardInline from './StockCardInline';
import axios from 'axios';

// API Base URL
const API_URL = 'http://localhost:8000/api';

const MostBoughtWidget = ({ category, onSelect }) => {
    const [filter, setFilter] = useState('Today');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Category mapping for title
    const categoryTitle = {
        'stocks': 'stocks',
        'mutualfunds': 'Mutual Funds',
        'bonds': 'Bonds'
    };

    useEffect(() => {
        const fetchData = async () => {
            // Only fetch for stocks as our backend currently supports NIFTY 50
            if (category !== 'stocks') return;

            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/stocks/market-status`);
                // Use 'most_bought' (volume leaders) as the proxy for Most Bought
                setData(res.data.most_bought || []);
            } catch (err) {
                console.error("Failed to fetch market status", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]);

    // Fallback mock data for other categories
    const mockDataOther = {
        mutualfunds: {
            'Today': [
                { symbol: 'QUANTSMALL', name: 'Quant Small Cap Fund', price: '254.50', change: '+1.40 (0.5%)', isPositive: true },
                { symbol: 'SBICONTRA', name: 'SBI Contra Fund', price: '340.00', change: '+2.50 (0.7%)', isPositive: true },
            ]
        },
        bonds: {
            'Today': [
                { symbol: 'RBIBOND', name: 'RBI Floating Rate Bond', price: '1000.00', change: '+0.50 (0.05%)', isPositive: true },
            ]
        }
    };

    const displayData = category === 'stocks' ? data : (mockDataOther[category]?.['Today'] || []);

    return (
        <div className={styles.widgetContainer} style={{ border: 'none', padding: 0 }}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.title}>Most bought {categoryTitle[category]} on Groww</h3>
                <div className={styles.filterGroup}>
                    {['Today', 'This Week', 'This Month'].map(f => (
                        <button
                            key={f}
                            className={`${styles.filterChip} ${filter === f.replace('This ', '') ? styles.active : ''}`}
                            onClick={() => setFilter(f.replace('This ', ''))}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading live market data...</div>
            ) : (
                <div className="most-bought-list">
                    {displayData.map((stock, i) => (
                        <div key={i} onClick={() => onSelect(stock)}>
                            <StockCardInline {...stock} />
                        </div>
                    ))}
                    {displayData.length === 0 && <div style={{ padding: '1rem' }}>No data available</div>}
                </div>
            )}
        </div>
    );
};

export default MostBoughtWidget;
