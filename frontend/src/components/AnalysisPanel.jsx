import React from 'react';

const AnalysisPanel = ({ analysis, symbol }) => {
    if (!analysis) return null;

    return (
        <div className="analysis-panel">
            <h2>AI Analysis for {symbol}</h2>
            <div className="analysis-content">
                {analysis.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
};

export default AnalysisPanel;
