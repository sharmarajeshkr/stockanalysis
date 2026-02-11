import React, { useState } from 'react';
import styles from '../../styles/DashboardWidgets.module.css';
import StockCardInline from './StockCardInline';

// --- Internal Component: All Sectors Modal ---
const AllSectorsModal = ({ isOpen, onClose, onApply }) => {
    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const sectors = [
        'Banking', 'IT Services', 'Automobiles', 'FMCG', 'Pharmaceuticals',
        'Metal', 'Realty', 'Power', 'Oil & Gas', 'Telecom',
        'Consumer Durables', 'Capital Goods', 'Chemicals', 'Construction',
        'Healthcare', 'Media', 'Textiles', 'Services', 'Diversified'
    ];

    const toggleSector = (sector) => {
        if (selected.includes(sector)) {
            setSelected(selected.filter(s => s !== sector));
        } else {
            setSelected([...selected, sector]);
        }
    };

    const filteredSectors = sectors.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.title}>All Sectors</h3>
                    <button onClick={onClose} className={styles.closeBtn}>×</button>
                </div>

                <input
                    type="text"
                    placeholder="Search sectors..."
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '1.5rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className={styles.sectorGrid}>
                    {filteredSectors.map(sector => (
                        <label key={sector} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={selected.includes(sector)}
                                onChange={() => toggleSector(sector)}
                            />
                            {sector}
                        </label>
                    ))}
                </div>

                <div className={styles.modalFooter}>
                    <button onClick={() => setSelected([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>Clear</button>
                    <button onClick={() => onApply(selected)} className={styles.primaryBtn}>Apply ({selected.length})</button>
                </div>
            </div>
        </div>
    );
};

// --- Internal Component: Sector Stock List ---
const SectorStockList = ({ sectors, onBack }) => {
    // Mock Data Generator for selected sectors
    const getStocksForSectors = (sectorList) => {
        // Just generating some mock items based on sector name for demo
        return sectorList.flatMap(sec => [
            { name: `${sec} Corp`, price: '1,205', change: '+12.5 (1.1%)', volume: '2.5M', pe: '24.5', mcap: '50T' },
            { name: `${sec} Industries`, price: '890', change: '-5.0 (0.6%)', volume: '1.1M', pe: '18.2', mcap: '20T' },
            { name: `National ${sec}`, price: '450', change: '+2.0 (0.4%)', volume: '800K', pe: '15.0', mcap: '10T' }
        ]);
    };

    const stocks = getStocksForSectors(sectors);

    return (
        <div className={styles.widgetContainer} style={{ marginTop: '2rem' }}>
            <div className={styles.sectionHeader}>
                <div>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>← Back to Catalog</button>
                    <h3 className={styles.title}>Stocks in {sectors.join(', ')}</h3>
                </div>
            </div>

            <div className={styles.stockTableContainer}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem 0' }}>Company Name</th>
                            <th style={{ textAlign: 'right' }}>Price</th>
                            <th style={{ textAlign: 'right' }}>Change %</th>
                            <th style={{ textAlign: 'right' }}>Volume</th>
                            <th style={{ textAlign: 'right' }}>P/E</th>
                            <th style={{ textAlign: 'right' }}>Market Cap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem 0', fontWeight: '500', color: 'var(--text-main)' }}>{stock.name}</td>
                                <td style={{ textAlign: 'right' }}>₹{stock.price}</td>
                                <td style={{ textAlign: 'right', color: stock.change.includes('+') ? 'var(--accent)' : 'var(--red-accent)' }}>{stock.change}</td>
                                <td style={{ textAlign: 'right' }}>{stock.volume}</td>
                                <td style={{ textAlign: 'right' }}>{stock.pe}</td>
                                <td style={{ textAlign: 'right' }}>₹{stock.mcap}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Main Widget ---
const SectorCatalogWidget = ({ category, onSelect }) => {
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState('catalog'); // 'catalog' or 'list'
    const [selectedSectors, setSelectedSectors] = useState([]);

    const handleApply = (sectors) => {
        setSelectedSectors(sectors);
        setShowModal(false);
        if (sectors.length > 0) {
            setViewMode('list');
        }
    };

    if (viewMode === 'list') {
        return <SectorStockList sectors={selectedSectors} onBack={() => setViewMode('catalog')} />;
    }

    // Standard Catalog View
    const getCatalogData = () => {
        switch (category) {
            case 'mutualfunds':
                return {
                    title: 'Top Mutual Funds by Category',
                    sections: [
                        {
                            title: 'Equity',
                            items: [
                                { symbol: 'QUANT', name: 'Quant Small Cap', price: '254.50', change: '+1.4% 1Y', isPositive: true },
                                { symbol: 'NIPPON', name: 'Nippon Small Cap', price: '190.00', change: '+2.5% 1Y', isPositive: true }
                            ]
                        },
                        {
                            title: 'Debt',
                            items: [
                                { symbol: 'ICICIDEBT', name: 'ICICI Pru Debt', price: '54.50', change: '+0.4% 1Y', isPositive: true },
                                { symbol: 'HDFCDEBT', name: 'HDFC Short Term', price: '40.00', change: '+0.5% 1Y', isPositive: true }
                            ]
                        },
                        {
                            title: 'Hybrid',
                            items: [
                                { symbol: 'SBIBAL', name: 'SBI Equity Hybrid', price: '154.50', change: '+1.2% 1Y', isPositive: true },
                            ]
                        }
                    ]
                };
            case 'bonds':
                return {
                    title: 'Bonds by Collections',
                    sections: [
                        {
                            title: 'Sovereign Gold Bonds',
                            items: [
                                { symbol: 'SGBMAY', name: 'SGB May 2030', price: '6,200', change: 'AAA', isPositive: true },
                                { symbol: 'SGBDEC', name: 'SGB Dec 2028', price: '6,100', change: 'AAA', isPositive: true }
                            ]
                        },
                        {
                            title: 'Tax Free Bonds',
                            items: [
                                { symbol: 'NHAI', name: 'NHAI 2030', price: '1,120', change: 'AAA', isPositive: true },
                                { symbol: 'REC', name: 'REC Ltd', price: '1,050', change: 'AAA', isPositive: true }
                            ]
                        },
                        {
                            title: 'Corporate',
                            items: [
                                { symbol: 'PIRAMAL', name: 'Piramal Ent', price: '950', change: 'A+', isPositive: true },
                            ]
                        }
                    ]
                };
            case 'stocks':
            default:
                return {
                    title: 'Top Sectors',
                    sections: [
                        {
                            title: 'Banking',
                            items: [
                                { symbol: 'HDFCBANK', name: 'HDFC Bank', price: '1,650', change: '+0.6%', isPositive: true },
                                { symbol: 'SBIN', name: 'SBI', price: '580', change: '-0.2%', isPositive: false },
                                { symbol: 'ICICI', name: 'ICICI Bank', price: '950', change: '+1.2%', isPositive: true }
                            ]
                        },
                        {
                            title: 'IT Services',
                            items: [
                                { symbol: 'TCS', name: 'TCS', price: '3,450', change: '-0.5%', isPositive: false },
                                { symbol: 'INFY', name: 'Infosys', price: '1,420', change: '+0.8%', isPositive: true },
                                { symbol: 'WIPRO', name: 'Wipro', price: '450', change: '+0.2%', isPositive: true }
                            ]
                        },
                        {
                            title: 'Automobiles',
                            items: [
                                { symbol: 'TATAMOTORS', name: 'Tata Motors', price: '620', change: '+2.5%', isPositive: true },
                                { symbol: 'M&M', name: 'Mahindra', price: '1,550', change: '+1.5%', isPositive: true }
                            ]
                        }
                    ]
                };
        }
    };

    const data = getCatalogData();

    return (
        <div className={styles.catalogContainer}>
            <AllSectorsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onApply={handleApply}
            />

            <div className={styles.sectionHeader}>
                <h3 className={styles.title}>{data.title}</h3>
                <button
                    className={styles.viewAllBtn}
                    style={{ fontSize: '1rem' }}
                    onClick={() => setShowModal(true)}
                >
                    See all sectors
                </button>
            </div>

            <div className={styles.catalogGrid}>
                {data.sections.map((section, idx) => (
                    <div key={idx} className={styles.catalogSection}>
                        <div className={styles.catalogHeader}>
                            <span className={styles.catalogTitle}>{section.title}</span>
                            <button className={styles.viewAllBtn} onClick={() => handleApply([section.title])}>See all</button>
                        </div>
                        <div className={styles.assetList}>
                            {section.items.map((item, i) => (
                                <div key={i} onClick={() => onSelect(item)} style={{ cursor: 'pointer' }}>
                                    <StockCardInline {...item} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectorCatalogWidget;
