import React from 'react';
import styles from '../../styles/DashboardWidgets.module.css';

const TradingScreensWidget = () => {
    const screens = [
        { type: 'Bullish', name: 'Resistance breakouts', chart: '↗️' },
        { type: 'Bullish', name: 'MACD above signal line', chart: '📈' },
        { type: 'Bearish', name: 'RSI overbought', chart: '📉' },
        { type: 'Bullish', name: 'RSI oversold', chart: '📊' },
    ];

    return (
        <div className={styles.widgetContainer}>
            <h3 className={styles.title} style={{ marginBottom: '1rem' }}>Trading Screens</h3>

            {screens.map((screen, i) => (
                <div key={i} className={styles.screenItem}>
                    <div>
                        <span className={`${styles.badge} ${screen.type === 'Bullish' ? styles.bullish : styles.bearish}`}>
                            {screen.type}
                        </span>
                        <div className={styles.screenName}>{screen.name}</div>
                    </div>
                    <div className={styles.miniChart}>{screen.chart}</div>
                </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem' }}>
                Intraday screener &gt;
            </div>
        </div>
    );
};

export default TradingScreensWidget;
