import React, { useState, useCallback, useMemo } from 'react';
import Header from '../components/Header';
import MarketIndices from '../components/MarketIndices';
import {
    MostBoughtWidget,
    MarketMoversWidget,
    SectorTrendingWidget,
    TradingScreensWidget,
    SectorCatalogWidget,
    HoldingsWidget,
    InvestmentSummary,
    WatchlistWidget,
    ToolsSection,
} from '../components/widgets';
import AssetDetails from '../components/AssetDetails';
import { useAuth } from '../context/AuthContext';
import { ASSET_CATEGORIES, DASHBOARD_TABS } from '../utils/constants';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState(ASSET_CATEGORIES.STOCKS);
    const [activeSubTab, setActiveSubTab] = useState(DASHBOARD_TABS.EXPLORE);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const { user } = useAuth();

    // Memoized tab change handler to prevent unnecessary re-renders
    const handleTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
        setSelectedAsset(null);
    }, []);

    // Memoized asset selection handler
    const handleAssetSelect = useCallback((asset) => {
        setSelectedAsset(asset);
    }, []);

    // Memoized back handler
    const handleBack = useCallback(() => {
        setSelectedAsset(null);
    }, []);

    // Main dashboard content - memoized outside of conditional
    const exploreFeed = useMemo(() => (
        <>
            <MostBoughtWidget category={activeTab} onSelect={handleAssetSelect} />
            <MarketMoversWidget category={activeTab} />
            <SectorTrendingWidget />
            <SectorCatalogWidget category={activeTab} onSelect={handleAssetSelect} />
        </>
    ), [activeTab, handleAssetSelect]);

    // Conditional main feed based on active sub-tab - memoized at top level
    const mainFeed = useMemo(() => {
        if (activeSubTab === DASHBOARD_TABS.EXPLORE) {
            return exploreFeed;
        } else if (activeSubTab === DASHBOARD_TABS.WATCHLIST) {
            return <WatchlistWidget category={activeTab} />;
        } else {
            return <HoldingsWidget category={activeTab} />;
        }
    }, [activeSubTab, activeTab, exploreFeed]);

    // If asset is selected, show details view
    if (selectedAsset) {
        return (
            <div className="app-main-layout">
                <Header
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    activeSubTab={activeSubTab}
                    onSubTabChange={setActiveSubTab}
                    user={user}
                />
                <div className="app-container" style={{ padding: '2rem' }}>
                    <AssetDetails asset={selectedAsset} onBack={handleBack} />
                </div>
            </div>
        );
    }

    return (
        <div className="app-main-layout">
            <Header
                activeTab={activeTab}
                onTabChange={handleTabChange}
                activeSubTab={activeSubTab}
                onSubTabChange={setActiveSubTab}
                user={user}
            />

            {activeSubTab === DASHBOARD_TABS.EXPLORE && <MarketIndices />}

            <div className="dashboard-grid">
                {/* Left Column (Main Feed or Holdings) */}
                <div className="main-feed">
                    {mainFeed}
                </div>

                {/* Right Column (Sidebar) */}
                <div className="side-widgets">
                    <InvestmentSummary
                        totalValue="67,866"
                        oneDayReturn="-₹519.87 (0.76%)"
                        totalReturn="-₹1,486.95 (2.14%)"
                    />

                    <TradingScreensWidget />

                    <div style={{ marginTop: '2rem' }}>
                        <ToolsSection />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Dashboard);
