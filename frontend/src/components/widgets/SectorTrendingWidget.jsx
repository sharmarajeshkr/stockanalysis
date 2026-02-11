import React from 'react';
import styles from '../../styles/DashboardWidgets.module.css';

const SectorTrendingWidget = () => {
    const sectors = [
        { name: 'Non-Ferrous Metals', gainers: 18, losers: 26, change: '+2.30%', isPositive: true },
        { name: 'Bearings', gainers: 4, losers: 6, change: '+0.67%', isPositive: true },
        { name: 'Cement - Products', gainers: 4, losers: 4, change: '+0.57%', isPositive: true },
        { name: 'Marine Port & Services', gainers: 0, losers: 4, change: '-6.78%', isPositive: false },
        { name: 'Trading', gainers: 161, losers: 172, change: '-7.17%', isPositive: false },
    ];

    return (
        <div className={styles.widgetContainer} style={{ marginTop: '3rem' }}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.title}>Sectors trending today</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                <span style={{ flex: 1 }}>Sector</span>
                <span style={{ flex: 2, textAlign: 'center' }}>Gainers/Losers</span>
                <span style={{ width: 80, textAlign: 'right' }}>1D price change</span>
            </div>

            {sectors.map((sec, i) => (
                <div key={i} className={styles.sectorRow}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <div className={styles.sectorIcon}>🏭</div> {/* Placeholder Icon */}
                        <span className={styles.sectorName}>{sec.name}</span>
                    </div>

                    <div style={{ flex: 2, padding: '0 2rem' }}>
                        <div className={styles.counts}>
                            <span>{sec.gainers}</span>
                            <span>{sec.losers}</span>
                        </div>
                        <div className={styles.barContainer}>
                            <div className={styles.barGreen} style={{ width: `${(sec.gainers / (sec.gainers + sec.losers)) * 100}%` }}></div>
                            <div className={styles.barRed} style={{ width: `${(sec.losers / (sec.gainers + sec.losers)) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className={styles.percentChange} style={{ color: sec.isPositive ? 'var(--accent)' : 'var(--red-accent)' }}>
                        {sec.change}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SectorTrendingWidget;
