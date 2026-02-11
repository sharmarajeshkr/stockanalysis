# Frontend Module Overview

## Tech Stack
- **Framework:** React v19.2
- **Build Tool:** Vite v7.2
- **Routing:** React Router DOM v7.13
- **Visualization:** Recharts v3.7
- **HTTP Client:** Axios v1.13 (available, though app currently uses simulated data)
- **State Management:** React Context API (AuthContext) + LocalStorage
- **Styling:** CSS Modules / Vanilla CSS (mapped in `styles/`)
- **Linting:** ESLint v9.39

## Project Structure
The frontend is located in the `frontend/` directory.

```
frontend/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and icons
│   ├── components/      # Reusable UI components
│   │   ├── widgets/     # Dashboard widgets (MarketMovers, SectorTrending, etc.)
│   │   └── [Core Components] (Header, StockChart, AssetDetails, etc.)
│   ├── context/         # Global state providers (AuthContext)
│   ├── layouts/         # Layout components
│   ├── pages/           # Page views
│   │   ├── Dashboard.jsx
│   │   └── LoginPage.jsx
│   ├── styles/          # Global styles and theme variables
│   ├── App.jsx          # Main application component & Routing
│   └── main.jsx         # Entry point
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Features

### 1. Authentication & User Management
- **Simulated Auth:** Uses `localStorage` to mock a user database and session management.
- **Login:** Simple username/password authentication (Default: `demo`/`password`).
- **User Persistance:** Persists user sessions and data (watchlist, holdings) locally.

### 2. Dashboard
The central hub of the application, featuring a dynamic layout with:
- **Navigation Tabs:** Switch between asset classes (Stocks, Mutual Funds, Bonds).
- **Sub-views:**
    - **Explore:** Market overview with widgets.
    - **Holdings:** View user's portfolio.
    - **Watchlist:** Tracked assets.

### 3. Market Analysis Widgets
- **Market Indices:** Displays major indices performance.
- **Most Bought:** Highlights popular assets.
- **Market Movers:** Shows top gainers/losers.
- **Sector Analysis:**
    - **Sector Trending:** Visualization of trending sectors.
    - **Sector Catalog:** Detailed list of sectors.

### 4. Asset Details & Tools
- **Stock Analysis:** Detailed view for individual assets.
- **Interactive Charts:** Historical price data visualization using Recharts.
- **Trading Simulation:** Ability to "Buy" stocks and track them in Holdings.
- **Watchlist Management:** Add/Remove assets from personal watchlist.
- **Investment Summary:** Real-time (simulated) calculation of total portfolio value and returns.
