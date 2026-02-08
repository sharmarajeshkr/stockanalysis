# Nifty IT Sector Analysis with Random Forest

This project performs trend analysis and prediction on the Nifty IT sector using an **Enhanced Random Forest Classifier**. It uses 10 years of historical data to train a model that predicts whether a stock's trend is likely to be positive ("GOOD") or negative ("NOT GOOD") over the next 20 days.

## Prerequisites

- Python 3.10+
- Scikit-learn, Pandas, NumPy, Yfinance, Joblib, Ta, Matplotlib

Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### 1. Model Training
Run the training script to fetch 10 years of Nifty IT data, engineer features (RSI, MACD, etc.), and train the Random Forest model.
```bash
python train_sector.py
```
This will save the trained model to `models/sector_model.joblib`.

### 2. Prediction and Analysis
Generate the sector forecast and visualization:
```bash
python predict_sector.py
```
This will:
- Load the saved Random Forest model.
- Fetch the latest stock data.
- Generate predictions and confidence scores.
- Save results to `sector_results.csv`.
- Generate a visual overview in `sector_overview.png`.
- Display a summary in the console.

## Configuration
Edit `config.py` to adjust settings:
- `START_DATE`: Historical data start date (calculated as 10 years ago).
- `FORECAST_HORIZON`: Prediction length (default: 20 days).
- `N_ESTIMATORS`: Number of trees in the Random Forest (default: 200).
