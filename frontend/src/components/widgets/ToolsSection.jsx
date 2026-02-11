import React from 'react';

const ToolsSection = () => (
    <div className="tools-section">
        <h3>Products & Tools</h3>
        <div className="tool-list">
            <div className="tool-item">
                <span className="tool-icon">📢</span>
                <span>IPO</span>
                <span className="badge">2 open</span>
            </div>
            <div className="tool-item">
                <span className="tool-icon">📄</span>
                <span>Bonds</span>
                <span className="badge">2 open</span>
            </div>
            <div className="tool-item">
                <span className="tool-icon">📊</span>
                <span>ETF Screener</span>
            </div>
        </div>
    </div>
);

export default ToolsSection;
