import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { CHART_CONFIG } from '../utils/constants';

const StockChart = ({ data }) => {
    // Generate mock data if none provided (since backend is simulated)
    const chartData = useMemo(() => {
        if (data && data.length > 0) return data;

        const mock = [];
        let price = 1000;
        const now = new Date();
        // Use current time for seed to get different data per symbol/refresh
        // but still deterministic within the same render
        const seed = now.getTime();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            // Deterministic fluctuation using sin/cos with seed
            price = price + (Math.sin(i + seed / 1000000) * 25) + (Math.cos(i * seed / 10000000) * 25);
            mock.push({
                date: date.toLocaleDateString(),
                close: Math.max(0, price)
            });
        }
        return mock;
    }, [data]);

    const { isPositive, color, percentChange } = useMemo(() => {
        const positive = chartData.length > 1 &&
            chartData[chartData.length - 1].close >= chartData[0].close;

        const change = chartData.length > 1
            ? ((chartData[chartData.length - 1].close - chartData[0].close) / chartData[0].close * 100).toFixed(2)
            : 0;

        return {
            isPositive: positive,
            color: positive ? CHART_CONFIG.COLORS.PRIMARY : CHART_CONFIG.COLORS.DANGER,
            percentChange: change,
        };
    }, [chartData]);

    const chartStyle = useMemo(() => ({
        background: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        marginTop: '1rem'
    }), []);

    const tooltipStyle = useMemo(() => ({
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-main)',
        borderRadius: '8px'
    }), []);

    return (
        <div className="chart-container" style={chartStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Price History (1 Month)</h3>
                <div style={{ color: color, fontWeight: 'bold' }}>
                    {isPositive ? '▲' : '▼'} {percentChange}%
                </div>
            </div>
            <div style={{ width: '100%', height: CHART_CONFIG.DEFAULT_HEIGHT }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--text-secondary)"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="var(--text-secondary)"
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `₹${val.toFixed(0)}`}
                        />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area
                            type="monotone"
                            dataKey="close"
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorClose)"
                            animationDuration={CHART_CONFIG.ANIMATION_DURATION}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default React.memo(StockChart);
