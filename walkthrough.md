# Stock Analysis Project Walkthrough

I have successfully refactored your Jupyter Notebook into a structured, production-ready Python project.

## 📂 Project Structure

The code is now organized into logical modules:

```
d:/Stock_Analysis/
├── config.py           # Settings (Ticker, Horizon, Thresholds)
├── data/loader.py      # Data fetching (yfinance)
├── features/indicators.py # Technical Indicators (RSI, MACD, etc.)
├── models/train.py     # Model Training (Random Forest)
├── main.py             # Main Application Entry Point
└── requirements.txt    # Dependencies
```

## 🚀 How to Run

1.  **Install Dependencies** (Already done in this session):
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Analysis**:
    ```bash
    python main.py
    ```

## ✅ Verification Results

I ran the application and verified the following:
-   **Data Loading**: Successfully fetched data for `TCS.BO`.
-   **Feature Engineering**: Calculated SMA, EMA, RSI, MACD, etc.
-   **Model Training**: Trained a Random Forest model with TimeSeriesSplit.
-   **Output**: Produced a prediction for the next 5 days.

**Latest Run Output:**
```
Cross-Validation Accuracy: 68.15% (+/- 14.97%)
Prediction date: 2026-02-06
Prediction: [NOT GOOD]
Confidence: 30.50%
```

## 🛠️ Key Improvements
-   **Modularity**: Easier to test and maintain.
-   **Configurability**: Key parameters are in `config.py`.
-   **Error Handling**: Added checks for data loading and empty datasets.
-   **Reproducibility**: Fixed random state for consistent results.
