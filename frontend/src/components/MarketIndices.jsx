import React from 'react';

const MarketIndices = () => {
    const indices = [
        { name: 'NIFTY', value: '25,048.65', change: '-241.25 (0.95%)', isDown: true },
        { name: 'SENSEX', value: '81,537.70', change: '-789.67 (0.94%)', isDown: true },
        { name: 'BANKNIFTY', value: '58,473.10', change: '-727.00 (1.23%)', isDown: true },
        { name: 'MIDCPNIFTY', value: '13,066.65', change: '-258.80 (1.94%)', isDown: true },
    ];

    return (
        <div className="market-indices-bar">
            {indices.map((idx, i) => (
                <div key={i} className="index-item">
                    <span className="index-name">{idx.name}</span>
                    <span className="index-value">{idx.value}</span>
                    <span className={`index-change ${idx.isDown ? 'down' : 'up'}`}>
                        {idx.change}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default MarketIndices;
