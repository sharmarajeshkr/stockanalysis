import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { getSectorAnalysis, analyzeStock } from '../services/api';
import { TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const [sectorData, setSectorData] = useState([]);
    const [selectedTicker, setSelectedTicker] = useState(null);
    const [stockData, setStockData] = useState(null);
    const [loadingSector, setLoadingSector] = useState(true);
    const [loadingStock, setLoadingStock] = useState(false);
    const [error, setError] = useState(null);

    // Colors for charts
    const COLORS = {
        bullish: '#00d09c',
        bearish: '#ff4d4d',
        neutral: '#8884d8'
    };

    // Fetch Sector Data on Mount
    useEffect(() => {
        const fetchSectorData = async () => {
            try {
                const data = await getSectorAnalysis();
                setSectorData(data);
                if (data.length > 0) {
                    // Select the first stock by default or the best performing one
                    setSelectedTicker(data[0].Ticker);
                }
            } catch (err) {
                setError("Failed to load sector data.");
            } finally {
                setLoadingSector(false);
            }
        };
        fetchSectorData();
    }, []);

    // Fetch Individual Stock Data when selectedTicker changes
    useEffect(() => {
        if (!selectedTicker) return;

        const fetchStockDetails = async () => {
            setLoadingStock(true);
            setStockData(null);
            try {
                const result = await analyzeStock(selectedTicker);
                setStockData(result);
            } catch (err) {
                console.error("Error fetching stock details:", err);
            } finally {
                setLoadingStock(false);
            }
        };

        fetchStockDetails();
    }, [selectedTicker]);

    // Aggregated Data for Charts
    const sentimentData = [
        { name: 'Bullish (GOOD)', value: sectorData.filter(s => s.Prediction === 'GOOD').length },
        { name: 'Bearish (NOT GOOD)', value: sectorData.filter(s => s.Prediction !== 'GOOD').length }
    ];

    const renderSectorOverview = () => (
        <div className="grid grid-cols-2 mb-6 gap-4">
            {/* Sentiment Distribution */}
            <div className="card">
                <h3 className="text-sm text-secondary mb-2">Sector Sentiment</h3>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                <Cell fill={COLORS.bullish} />
                                <Cell fill={COLORS.bearish} />
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
                                itemStyle={{ color: '#e0e0e0' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Movers (Bar Chart of returns) */}
            <div className="card">
                <h3 className="text-sm text-secondary mb-2">30-Day Performance</h3>
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <BarChart data={sectorData.slice(0, 5)} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="Ticker" type="category" width={60} stroke="#a0a0a0" style={{ fontSize: '0.75rem' }} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
                            />
                            <Bar dataKey="30d_Change" name="Return">
                                {sectorData.slice(0, 5).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry['30d_Change'] >= 0 ? COLORS.bullish : COLORS.bearish} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    return (
        <div className="main-content" style={{ display: 'flex', gap: '1.5rem', maxWidth: '1600px' }}>

            {/* LEFT SIDEBAR: Stock List */}
            <div className="card" style={{ width: '300px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 100px)' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 className="text-xl">NIFTY IT</h2>
                    <p className="text-sm" style={{ color: '#a0a0a0' }}>{sectorData.length} Stocks</p>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {loadingSector ? (
                        <p style={{ padding: '1rem' }}>Loading...</p>
                    ) : (
                        sectorData.map(stock => (
                            <div
                                key={stock.Ticker}
                                onClick={() => setSelectedTicker(stock.Ticker)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #2a2a2a',
                                    cursor: 'pointer',
                                    backgroundColor: selectedTicker === stock.Ticker ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600 }}>{stock.Ticker.replace('.NS', '')}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#a0a0a0' }}>₹{stock.Price.toFixed(0)}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: stock['30d_Change'] >= 0 ? COLORS.bullish : COLORS.bearish, fontWeight: 500 }}>
                                        {stock['30d_Change'] >= 0 ? '+' : ''}{(stock['30d_Change'] * 100).toFixed(1)}%
                                    </div>
                                    {stock.Prediction === 'GOOD' && (
                                        <div style={{ fontSize: '0.7rem', color: COLORS.bullish, marginTop: '2px' }}>BULLISH</div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT PANEL: Charts & Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Sector Overview Section */}
                {!loadingSector && sectorData.length > 0 && renderSectorOverview()}

                {/* Selected Stock Details */}
                {selectedTicker && (
                    <div className="card" style={{ flex: 1 }}>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-xl" style={{ fontSize: '2rem' }}>{selectedTicker.replace('.NS', '')}</h1>
                                <p style={{ color: '#a0a0a0' }}>Technical Analysis Report</p>
                            </div>
                            {stockData && (
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#a0a0a0' }}>Prediction Confidence</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stockData.prediction === 'GOOD' ? COLORS.bullish : COLORS.bearish }}>
                                        {(stockData.confidence * 100).toFixed(1)}%
                                    </div>
                                </div>
                            )}
                        </div>

                        {loadingStock ? (
                            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                Analyzing {selectedTicker}...
                            </div>
                        ) : stockData ? (
                            <div className="grid grid-cols-2 gap-6">
                                {/* Analysis Stats */}
                                <div>
                                    <div className="mb-6">
                                        <h3 className="text-sm text-secondary mb-2">Model Signal</h3>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            backgroundColor: stockData.prediction === 'GOOD' ? 'rgba(0, 208, 156, 0.15)' : 'rgba(255, 77, 77, 0.15)',
                                            color: stockData.prediction === 'GOOD' ? COLORS.bullish : COLORS.bearish,
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            border: `1px solid ${stockData.prediction === 'GOOD' ? COLORS.bullish : COLORS.bearish}`
                                        }}>
                                            {stockData.prediction}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div style={{ padding: '1rem', backgroundColor: '#121212', borderRadius: '8px' }}>
                                            <div style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Model Accuracy (CV)</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{(stockData.cv_accuracy * 100).toFixed(1)}%</div>
                                        </div>
                                        <div style={{ padding: '1rem', backgroundColor: '#121212', borderRadius: '8px' }}>
                                            <div style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Latest Signal Date</div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{stockData.date}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Feature Importance Chart */}
                                <div>
                                    <h3 className="text-sm text-secondary mb-2">Key Drivers</h3>
                                    <div style={{ width: '100%', height: 250 }}>
                                        <ResponsiveContainer>
                                            <BarChart data={stockData.top_features.slice(0, 5)} layout="vertical" margin={{ left: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="Feature" type="category" width={110} stroke="#a0a0a0" style={{ fontSize: '0.75rem' }} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
                                                    itemStyle={{ color: '#e0e0e0' }}
                                                />
                                                <Bar dataKey="Importance" fill="#0088cc" barSize={15} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-danger">Could not load analysis.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
