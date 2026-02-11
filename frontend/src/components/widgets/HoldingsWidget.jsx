import React, { useMemo } from 'react';
import styles from '../../styles/DashboardWidgets.module.css';
import { useAuth } from '../../context/AuthContext';

const HoldingsWidget = ({ category }) => {
    const { userData } = useAuth();

    // Enrich data with simulated LTP (Last Traded Price) and P&L
    // In a real app, LTP comes from a websocket or API
    const data = useMemo(() => {
        const rawData = userData?.holdings || [];
        return rawData.map(item => {
            // Use symbol hash for deterministic "random" factor
            const symbolHash = item.symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const randomFactor = 1 + ((Math.sin(symbolHash) * 0.05)); // Deterministic fluctuation
            const ltp = item.avg * randomFactor;
            const curVal = ltp * item.qty;
            const invested = item.avg * item.qty;
            const pl = curVal - invested;
            const percent = (pl / invested) * 100;

            return {
                ...item,
                ltp,
                curVal,
                pl,
                percent
            };
        });
    }, [userData]);

    const totalCurrent = data.reduce((sum, item) => sum + item.curVal, 0);
    const totalInvested = data.reduce((sum, item) => sum + (item.qty * item.avg), 0);
    const totalPL = totalCurrent - totalInvested;

    if (category !== 'stocks' && data.length === 0) {
        // Only show message for stocks if empty, to avoid duplicate empty messages if we had separate widgets
    }

    // Filter if needed (currently we store all in one list, assuming stocks)
    // If we had funds, we'd filter by item.type
    const filteredData = category === 'stocks' ? data : [];

    return (
        <div className={styles.widgetContainer} style={{ marginTop: '2rem' }}>
            <div className={styles.sectionHeader}>
                <div>
                    <h3 className={styles.title}>All Holdings ({filteredData.length})</h3>
                    {filteredData.length > 0 && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Total Inv: ₹{totalInvested.toLocaleString(undefined, { maximumFractionDigits: 0 })} • Current: ₹{totalCurrent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                    )}
                </div>

                {filteredData.length > 0 && (
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: totalPL >= 0 ? 'var(--accent)' : 'var(--red-accent)', fontWeight: 'bold' }}>
                            {totalPL >= 0 ? '+' : ''}₹{totalPL.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({((totalPL / totalInvested) * 100).toFixed(2)}%)
                        </div>
                        <span className={styles.badge} style={{ background: '#eee', color: '#555' }}>Day P&L: +₹{Math.floor(totalPL * 0.1).toLocaleString()}</span>
                    </div>
                )}
            </div>

            {filteredData.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem 0' }}>Company/Fund</th>
                            <th style={{ textAlign: 'right' }}>Qty</th>
                            <th style={{ textAlign: 'right' }}>Avg. Price</th>
                            <th style={{ textAlign: 'right' }}>Current</th>
                            <th style={{ textAlign: 'right' }}>P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'var(--text-main)' }}>{item.symbol}</td>
                                <td style={{ textAlign: 'right' }}>{item.qty}</td>
                                <td style={{ textAlign: 'right' }}>₹{item.avg.toFixed(2)}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <div>₹{item.ltp.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>₹{item.curVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ color: item.pl >= 0 ? 'var(--accent)' : 'var(--red-accent)' }}>
                                        {item.pl >= 0 ? '+' : ''}₹{item.pl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: item.percent >= 0 ? 'var(--accent)' : 'var(--red-accent)' }}>
                                        {item.percent.toFixed(2)}%
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    Your portfolio is empty.
                    <br />
                    <small>Buy stocks to see them here.</small>
                </div>
            )}
        </div>
    );
};

export default HoldingsWidget;
