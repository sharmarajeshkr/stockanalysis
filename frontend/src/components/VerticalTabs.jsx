import React from 'react';

const VerticalTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'stocks', label: 'Stocks' },
        { id: 'funds', label: 'Mutual Funds' },
        { id: 'bonds', label: 'Bonds' },
        { id: 'settings', label: 'Settings' },
    ];

    return (
        <div className="nav-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default VerticalTabs;
