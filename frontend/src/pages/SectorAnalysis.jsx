import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { getSectorAnalysis } from '../services/api';

const SectorAnalysis = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getSectorAnalysis();
                setData(result);
            } catch (err) {
                setError("Failed to load sector data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="main-content">Loading sector data...</div>;
    if (error) return <div className="main-content text-danger">{error}</div>;

    return (
        <div className="main-content">
            <h1 className="text-xl mb-4">Sector Analysis: NIFTY IT</h1>

            {/* Chart */}
            <div className="card mb-4" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="Ticker" angle={-45} textAnchor="end" stroke="#a0a0a0" />
                        <YAxis stroke="#a0a0a0" tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} />
                        <Tooltip
                            formatter={(value, name) => [
                                name === '30d_Change' ? `${(value * 100).toFixed(2)}%` : value,
                                name === '30d_Change' ? '30 Day Change' : name
                            ]}
                            contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
                        />
                        <ReferenceLine y={0} stroke="#666" />
                        <Bar dataKey="30d_Change">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry['30d_Change'] >= 0 ? '#00d09c' : '#ff4d4d'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333' }}>
                            <th style={{ padding: '1rem' }}>Ticker</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>30d Change</th>
                            <th style={{ padding: '1rem' }}>Prediction</th>
                            <th style={{ padding: '1rem' }}>Confidence</th>
                            <th style={{ padding: '1rem' }}>Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={row.Ticker} style={{ borderBottom: '1px solid #2a2a2a' }}>
                                <td style={{ padding: '1rem' }}>{row.Ticker}</td>
                                <td style={{ padding: '1rem' }}>₹{row.Price.toFixed(2)}</td>
                                <td style={{ padding: '1rem', color: row['30d_Change'] >= 0 ? '#00d09c' : '#ff4d4d' }}>
                                    {(row['30d_Change'] * 100).toFixed(2)}%
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        backgroundColor: row.Prediction === 'GOOD' ? 'rgba(0, 208, 156, 0.2)' : 'rgba(255, 77, 77, 0.2)',
                                        color: row.Prediction === 'GOOD' ? '#00d09c' : '#ff4d4d'
                                    }}>
                                        {row.Prediction}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{(row.Confidence * 100).toFixed(2)}%</td>
                                <td style={{ padding: '1rem' }}>{(row.CV_Accuracy * 100).toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SectorAnalysis;
