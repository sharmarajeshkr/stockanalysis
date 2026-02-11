import React from 'react';

const InvestmentSummary = ({ totalValue, oneDayReturn, totalReturn }) => (
    <div className="investment-summary-card">
        <h3>Your investments</h3>
        <div className="inv-content">
            <div className="current-val-section">
                <span>Current</span>
                <h2>₹{totalValue}</h2>
            </div>

            <div className="return-row">
                <span>1D returns</span>
                <span className="down">{oneDayReturn}</span>
            </div>

            <div className="return-row">
                <span>Total returns</span>
                <span className="down">{totalReturn}</span>
            </div>
        </div>
        <div className="inv-footer">
            <button className="primary-text-btn">See all investments</button>
        </div>
    </div>
);

export default InvestmentSummary;
