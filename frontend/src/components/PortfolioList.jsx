import React from 'react';

// Mock Portfolio Data (In a real app, this would come from an API/Database)
const MOCK_PORTFOLIO = [
    { id: 1, symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', quantity: 10, avgPrice: 150 },
    { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock', quantity: 5, avgPrice: 280 },
    { id: 3, symbol: 'VFIAX', name: 'Vanguard 500 Index', type: 'fund', quantity: 50, avgPrice: 350 },
    { id: 4, symbol: 'AGG', name: 'iShares Core US Aggregate Bond', type: 'bond', quantity: 20, avgPrice: 100 },
];

const PortfolioList = ({ type, onSelectAsset }) => {
    const assets = type === 'all'
        ? MOCK_PORTFOLIO
        : MOCK_PORTFOLIO.filter(a => a.type === type);

    if (assets.length === 0) {
        return <p>No {type} found in your portfolio.</p>;
    }

    return (
        <div className="portfolio-grid">
            {assets.map((asset) => (
                <div key={asset.id} className="asset-card" onClick={() => onSelectAsset(asset)}>
                    <div className="asset-header">
                        <span className="asset-symbol">{asset.symbol}</span>
                        <span className="asset-type">{asset.type}</span>
                    </div>
                    <p>{asset.name}</p>
                    <div className="asset-details">
                        <div>
                            <span>Qty:</span> <span className="detail-value">{asset.quantity}</span>
                        </div>
                        <div>
                            <span>Avg:</span> <span className="detail-value">${asset.avgPrice}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PortfolioList;
