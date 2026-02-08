import pandas as pd
import yfinance as yf
from datetime import datetime, timedelta
from data.loader import get_stock_data
from features.indicators import create_features, create_target
from models.train import train_time_series_model
import config
from backend.logger import setup_logger

logger = setup_logger("SectorAnalysis")

# NIFTY IT Constituents (Comprehensive List)
NIFTY_IT_STOCKS = [
    "TCS.NS", "INFY.NS", "HCLTECH.NS", "WIPRO.NS", "TECHM.NS",
    "LTIM.NS", "COFORGE.NS", "PERSISTENT.NS", "MPHASIS.NS", 
    "OFSS.NS", "LTTS.NS", "TATATECH.NS" 
]
# Note: TATATECH is a relatively new listing (Nov 2023), fitting "newly added".

def analyze_stock(ticker):
    logger.info(f"\n--- Analyzing {ticker} ---")
    try:
        # Fetch data
        df = get_stock_data(ticker, config.START_DATE)
        
        # Feature Engineering
        feats = create_features(df)
        target = create_target(df, config.FORECAST_HORIZON, config.GOOD_THRESHOLD)
        
        # Prepare Data
        data = feats.copy()
        data['target'] = target
        data.dropna(inplace=True)
        
        X = data.drop(columns=["target"])
        y = data["target"].squeeze()
        
        if len(X) < 200: # Ensure enough data
            logger.warning(f"Skipping {ticker}: Insufficient data ({len(X)} rows)")
            return None

        # Train with all data except last row
        X_train, y_train = X.iloc[:-1], y.iloc[:-1]
        X_latest = X.iloc[[-1]]
        
        model, cv_scores, _ = train_time_series_model(
            X_train, y_train, config.TEST_SPLITS, config.N_ESTIMATORS, config.RANDOM_STATE
        )
        
        # Predict
        pred = model.predict(X_latest)[0]
        prob = model.predict_proba(X_latest)[0][1]
        
        # Get recent performance (last 30 days)
        recent_df = df.iloc[-30:]
        
        # Ensure we get scalars
        if isinstance(recent_df["Close"], pd.DataFrame):
             close_series = recent_df["Close"].iloc[:, 0] # Take first column if it's a DF
        else:
             close_series = recent_df["Close"]
             
        start_price = float(close_series.iloc[0])
        end_price = float(close_series.iloc[-1])
        change_30d = (end_price - start_price) / start_price
        
        return {
            "Ticker": ticker,
            "Price": end_price,
            "30d_Change": change_30d,
            "CV_Accuracy": cv_scores.mean(),
            "Prediction": "GOOD" if pred == 1 else "NOT GOOD",
            "Confidence": prob
        }
        
    except Exception as e:
        logger.error(f"Error analyzing {ticker}: {e}")
        return None

def get_sector_analysis():
    logger.info("=== NIFTY IT Sector Analysis (Past 30 Days Trend) ===\n")
    
    results = []
    for ticker in NIFTY_IT_STOCKS:
        res = analyze_stock(ticker)
        if res:
            results.append(res)
            
    if not results:
        logger.warning("No results generated.")
        return []

    # Create Summary DataFrame
    summary_df = pd.DataFrame(results)
    
    # Sort by Confidence (descending)
    summary_df = summary_df.sort_values(by="Confidence", ascending=False)

    # Ensure numeric types
    summary_df["30d_Change"] = pd.to_numeric(summary_df["30d_Change"], errors='coerce')
    
    return summary_df.to_dict(orient="records")

def main():
    results = get_sector_analysis()
    if not results:
        return
        
    summary_df = pd.DataFrame(results)
    
    # Display formatted output
    print("\n\n=== Sector Analysis Summary ===")
    print(summary_df.to_string(index=False, formatters={
        "Price": "{:.2f}".format,
        "30d_Change": "{:.2%}".format,
        "CV_Accuracy": "{:.2%}".format,
        "Confidence": "{:.2%}".format
    }))
    
    # Save to CSV
    csv_file = "sector_results.csv"
    summary_df.to_csv(csv_file, index=False)
    logger.info(f"\nResults saved to {csv_file}")

    # Visualization
    try:
        import matplotlib.pyplot as plt
        
        plt.figure(figsize=(12, 6))
        colors = ['green' if x >= 0 else 'red' for x in summary_df["30d_Change"]]
        bars = plt.bar(summary_df["Ticker"], summary_df["30d_Change"], color=colors)
        
        plt.axhline(0, color='black', linewidth=0.8)
        plt.title("NIFTY IT Sector - 30 Day Performance")
        plt.xlabel("Stock")
        plt.ylabel("30-Day Return")
        plt.xticks(rotation=45)
        plt.grid(axis='y', linestyle='--', alpha=0.7)
        
        # Add labels
        for bar in bars:
            height = bar.get_height()
            label_y = height if height >= 0 else height - 0.02
            plt.text(bar.get_x() + bar.get_width()/2., label_y,
                     f'{height:.1%}', ha='center', va='bottom' if height >= 0 else 'top', fontsize=9)
            
        plot_file = "sector_overview.png"
        plt.tight_layout()
        plt.savefig(plot_file)
        logger.info(f"Visualization saved to {plot_file}")
        
    except ImportError:
        logger.warning("Matplotlib not found. Skipping visualization.")
    except Exception as e:
        logger.error(f"Error creating plot: {e}")
    
    # Sector Overview
    avg_30d = summary_df["30d_Change"].mean()
    bullish_count = summary_df[summary_df["Prediction"] == "GOOD"].shape[0]
    
    print(f"\nSector 30-Day Avg Return: {avg_30d:.2%}")
    print(f"Bullish Sentiment: {bullish_count}/{len(summary_df)} stocks predicted GOOD")

if __name__ == "__main__":
    main()
