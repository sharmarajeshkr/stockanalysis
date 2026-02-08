# Stock Analysis Project

This project predicts stock price movements using technical indicators and a Random Forest classifier. It features a FastAPI backend and a React (Vite) frontend.

## Project Structure
```
d:/Stock_Analysis/
├── backend/            # FastAPI backend
├── data/               # Data fetching logic (Refactored with Providers)
├── features/           # Feature engineering
├── frontend/           # React frontend
├── models/             # Model training logic
├── tests/              # Unit tests
├── config.py           # Configuration parameters
├── main.py             # CLI entry point
├── sector_analysis.py  # Sector analysis script
├── start_app.bat       # One-click launch script
└── requirements.txt    # Dependencies
```

## Setup & Usage

### 1. Install Dependencies
```bash
pip install -r requirements.txt
cd frontend
npm install
cd ..
```

### 2. Start the Application
The easiest way to run the application is using the provided batch script:
- Double-click **`start_app.bat`** in the root directory.
- This will launch both the Backend API and the Frontend Application, and open your browser to `http://localhost:5173`.

### 3. CLI Usage
You can also run analysis scripts directly:
```bash
# Run analysis for a single stock (configured in config.py)
python main.py

# Run sector-wide analysis
python sector_analysis.py
```

## Implementation Plan Summary

Recent updates have focused on improving code modularity and reliability.

-   **Data Fetching Refactoring**: Decoupled `yfinance` dependency by introducing a `StockDataProvider` interface and `YFinanceProvider` implementation. This allows for easy swapping of data sources in the future.
-   **Unit Testing**: Added a `tests` suite using `unittest` to verify the data fetching layer, ensuring robustness.
-   **Launch Automation**: Created `start_app.bat` to streamline the startup process for both backend and frontend components.

For full details, please refer to the [Implementation Plan](implementation_plan.md).

## Configuration
Modify `config.py` to change the ticker, start date, or model parameters.
