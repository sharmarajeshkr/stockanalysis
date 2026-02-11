import React, { useMemo, useCallback } from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/index.css';

const NAV_ITEMS = [
    { id: 'stocks', label: 'Stocks' },
    { id: 'mutualfunds', label: 'Mutual Funds' },
    { id: 'bonds', label: 'Bonds' },
];

const SUB_NAV_ITEMS = [
    { id: 'explore', label: 'Explore' },
    { id: 'holdings', label: 'Holdings' },
    { id: 'watchlist', label: 'Watchlist' },
];

const Header = ({ activeTab, onTabChange, activeSubTab, onSubTabChange, user }) => {

    // Memoize nav button handler
    const handleTabClick = useCallback((tabId) => {
        onTabChange(tabId);
    }, [onTabChange]);

    // Memoize sub-nav click handler
    const handleSubTabClick = useCallback((subTabId) => {
        onSubTabChange(subTabId);
    }, [onSubTabChange]);

    // Memoize main navigation buttons
    const navigationButtons = useMemo(() => (
        NAV_ITEMS.map((item) => (
            <button
                key={item.id}
                className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleTabClick(item.id)}
            >
                {item.label}
            </button>
        ))
    ), [activeTab, handleTabClick]);

    // Memoize sub-navigation items
    const subNavigationItems = useMemo(() => (
        SUB_NAV_ITEMS.map(item => (
            <span
                key={item.id}
                className={`sub-nav-item ${activeSubTab === item.id ? 'active' : ''}`}
                onClick={() => handleSubTabClick(item.id)}
                style={{ color: activeSubTab === item.id ? 'var(--accent)' : 'inherit' }}
            >
                {item.label}
            </span>
        ))
    ), [activeSubTab, handleSubTabClick]);

    // Memoize user avatar
    const userAvatar = useMemo(() => {
        if (!user || !user.username) return 'U';
        return user.username[0].toUpperCase();
    }, [user]);

    return (
        <header className="main-header">
            <div className="header-content">
                <div className="logo-section">
                    <div className="logo-icon"></div>
                    <span className="logo-text">StockApp</span>
                </div>

                <nav className="main-nav">
                    {navigationButtons}
                </nav>

                <div className="search-bar-header">
                    <span className="search-icon">🔍</span>
                    <input type="text" placeholder="Search stocks, funds..." />
                </div>

                <div className="user-actions">
                    <ThemeToggle />
                    <button className="icon-btn">🔔</button>
                    <div className="user-avatar" title={user?.username}>
                        {userAvatar}
                    </div>
                </div>
            </div>

            <div className="sub-nav">
                {subNavigationItems}
            </div>
        </header>
    );
};

export default React.memo(Header);
