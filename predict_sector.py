
import pandas as pd
import yfinance as yf
import numpy as np
import config
import os
import joblib
import matplotlib.pyplot as plt
from features.indicators import create_features
from backend.logger import setup_logger
from data.loader import get_stock_data

logger = setup_logger("PredictSector")

def load_model():
    if not os.path.exists(config.MODEL_PATH):
        logger.error(f"Model not found at {config.MODEL_PATH}. Please run train_sector.py first.")
        return None
    model = joblib.load(config.MODEL_PATH)
    return model

def predict_sector():
    model = load_model()
    if not model:
        return

    logger.info(f"Fetching latest data for prediction (Horizon: {config.FORECAST_HORIZON} days)...")
    
    results = []
    
    for ticker in config.NIFTY_IT_STOCKS:
        try:
            # Fetch data (get enough history for indicators)
            df = get_stock_data(ticker, config.START_DATE)
            if df is None or len(df) < 50:
                continue
                
            # Create features
            feats = create_features(df)
            
            # Predict on the LATEST data point
            latest_features = feats.iloc[[-1]] 
            # Note: create_features returns DataFrame with same index. 
            # We need to drop NaNs if any (rolling windows at start), but the END is fine.
            # However, if latest features have NaNs, we can't predict.
            if latest_features.isnull().values.any():
                 logger.warning(f"Skipping {ticker}: Latest features contain NaNs")
                 continue
                 
            # Predict Probability
            # Classes are 0, 1. Prob of 1 (increase)
            prob = model.predict_proba(latest_features)[0][1]
            prediction = "GOOD" if prob > 0.5 else "NOT GOOD"
            
            # Estimate potential return if bullish (using recent volatility or ATR)
            # Since Classification doesn't give price, we use recent return trend or just display probability.
            # User wants "Prediction Result".
            
            # Robustly get Close data
            close_data = df["Close"]
            if isinstance(close_data, pd.DataFrame):
                close_data = close_data.iloc[:, 0] # Take first column if multiple
            
            current_price = float(close_data.iloc[-1])
            
            # Calculate simple 30d historic return for context
            if len(df) > 30:
                start_price_30d = float(close_data.iloc[-30])
                hist_return = (current_price - start_price_30d) / start_price_30d
            else:
                hist_return = 0.0

            results.append({
                "Ticker": ticker,
                "Price": current_price,
                "Prediction": prediction,
                "Confidence": float(prob),
                "30d_Hist_Return": hist_return
            })
            
            logger.info(f"{ticker}: {prediction} (Conf: {prob:.2%})")
            
        except Exception as e:
            logger.error(f"Error predicting {ticker}: {e}")

    # Save to CSV
    summary_df = pd.DataFrame(results)
    if not summary_df.empty:
        summary_df.sort_values("Confidence", ascending=False, inplace=True)
        
        csv_file = "sector_results.csv"
        summary_df.to_csv(csv_file, index=False)
        logger.info(f"Results saved to {csv_file}")
        
        # Generator Plot
        generate_plot(summary_df)
        
        # Display
        print("\n=== Sector Analysis (Random Forest Model) ===")
        print(summary_df.to_string(index=False, formatters={
            "Price": "{:.2f}".format,
            "Confidence": "{:.2%}".format,
            "30d_Hist_Return": "{:.2%}".format
        }))

def generate_plot(df):
    try:
        import matplotlib.pyplot as plt
        plt.figure(figsize=(12, 6))
        
        # Color bars by prediction
        colors = ['green' if x == "GOOD" else 'red' for x in df["Prediction"]]
        bars = plt.bar(df["Ticker"], df["Confidence"], color=colors)
        
        plt.axhline(0.5, color='black', linestyle='--', linewidth=0.8, label="Threshold")
        plt.title(f"NIFTY IT Sector - Prediction Confidence (Horizon: {config.FORECAST_HORIZON} Days)")
        plt.xlabel("Stock")
        plt.ylabel("Confidence (Prob > 0.5 = GOOD)")
        plt.xticks(rotation=45)
        plt.ylim(0, 1)
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        plt.legend()
        
        for bar in bars:
            height = bar.get_height()
            plt.text(bar.get_x() + bar.get_width()/2., height,
                     f'{height:.0%}', ha='center', va='bottom', fontsize=9)
            
        plt.tight_layout()
        plt.savefig("sector_overview.png")
        logger.info("Plot saved to sector_overview.png")
    except Exception as e:
        logger.error(f"Failed to plot: {e}")

if __name__ == "__main__":
    predict_sector()
