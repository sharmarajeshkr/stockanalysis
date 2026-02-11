import React, { useState, useEffect } from 'react';
import styles from '../../styles/DashboardWidgets.module.css';
import { useAuth } from '../../context/AuthContext';
import { SkeletonTable } from '../LoadingSkeleton';

const WatchlistWidget = ({ category }) => {
    const { userData, removeFromWatchlist } = useAuth();
    const [loading, setLoading] = useState(true);

    // Simulate loading state (in real app, this would be from API call)
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, [category]);

    const data = userData?.watchlist || [];
    const filteredData = category === 'stocks' ? data : [];

    return (
        <div className={styles.widgetContainer} style={{ marginTop: '2rem' }}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className={styles.title}>My Watchlist</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {filteredData.length} items
                    </div>
                </div>
                <button className={styles.viewAllBtn}>+ Add item</button>
            </div>

            {loading ? (
                <SkeletonTable rows={5} columns={4} />
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem 0' }}>Company</th>
                                <th style={{ textAlign: 'right' }}>Price</th>
                                <th style={{ textAlign: 'right' }}>Change</th>
                                <th style={{ textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 0', fontWeight: '500', color: 'var(--text-main)' }}>{item.symbol}</td>
                                    <td style={{ textAlign: 'right' }}>₹{item.price}</td>
                                    <td style={{ textAlign: 'right', color: item.change?.includes('+') ? 'var(--accent)' : 'var(--red-accent)' }}>
                                        {item.change}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => removeFromWatchlist(item.symbol)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredData.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            Your watchlist is empty.
                            <br />
                            <small>Add stocks from the details page.</small>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WatchlistWidget;
