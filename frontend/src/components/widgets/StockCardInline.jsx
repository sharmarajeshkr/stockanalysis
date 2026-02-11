import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const StockCardInline = ({ symbol, price, change, isPositive }) => {
    // Generate deterministic mock data based on symbol
    // Memoized to avoid recalculating on every render
    const data = useMemo(() => {
        const mockData = [];
        let val = 100;
        const seed = symbol.charCodeAt(0);
        for (let i = 0; i < 20; i++) {
            // Use deterministic calculation based on seed and index only
            val = val + (Math.sin(i + seed) * 2) + (Math.cos(i * seed) * 3);
            mockData.push({ v: val });
        }
        return mockData;
    }, [symbol]);

    const color = isPositive ? '#00b386' : '#eb5b3c';

    return (
        <div className="stock-card-widget">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                <div className="stock-logo-placeholder">{symbol[0]}</div>
                <div className="stock-info-widget" style={{ flex: 1 }}>
                    <h4>{symbol}</h4>
                    <div className="stock-price-widget">
                        <span className="price">₹{price}</span>
                        <span className={`change ${isPositive ? 'up' : 'down'}`}>
                            {change}
                        </span>
                    </div>
                </div>
                <div style={{ width: 80, height: 40 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
                            <YAxis domain={['dataMin', 'dataMax']} hide={true} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default React.memo(StockCardInline);
