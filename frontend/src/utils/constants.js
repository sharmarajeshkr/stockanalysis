// ============================================================================
// Application Constants
// ============================================================================

// LocalStorage Keys
export const STORAGE_KEYS = {
    USERS: 'app_users',
    ACTIVE_USER: 'app_user',
    USER_DATA_PREFIX: 'app_data_',
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
};

// Asset Categories
export const ASSET_CATEGORIES = {
    STOCKS: 'stocks',
    MUTUAL_FUNDS: 'mutualfunds',
    BONDS: 'bonds',
};

// Dashboard Sub-tabs
export const DASHBOARD_TABS = {
    EXPLORE: 'explore',
    HOLDINGS: 'holdings',
    WATCHLIST: 'watchlist',
};

// Default User Credentials
export const DEFAULT_USER = {
    username: 'demo',
    password: 'password',
    role: 'admin',
};

// Chart Configuration
export const CHART_CONFIG = {
    DEFAULT_HEIGHT: 300,
    ANIMATION_DURATION: 300,
    COLORS: {
        PRIMARY: '#00d09c',
        DANGER: '#eb5b3c',
        GRID: '#e5e7eb',
    },
};

// API Configuration (for future backend integration)
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    TIMEOUT: 10000,
    ENDPOINTS: {
        STOCK_DATA: '/api/stocks',
        STOCK_ANALYSIS: '/api/analyze',
        MUTUAL_FUNDS: '/api/mutual-funds',
    },
};

// UI Constants
export const UI_CONSTANTS = {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 3000,
    MAX_WATCHLIST_ITEMS: 50,
    MAX_HOLDINGS_ITEMS: 100,
};

// Market Indices
export const MARKET_INDICES = {
    NIFTY_50: { name: 'NIFTY 50', symbol: '^NSEI' },
    SENSEX: { name: 'SENSEX', symbol: '^BSESN' },
    NIFTY_BANK: { name: 'NIFTY BANK', symbol: '^NSEBANK' },
    NIFTY_IT: { name: 'NIFTY IT', symbol: '^CNXIT' },
};
