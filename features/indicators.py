import pandas as pd
import numpy as np

def compute_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """
    Computes the Relative Strength Index (RSI).
    """
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(period).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def compute_macd(series: pd.Series, short: int = 12, long: int = 26) -> pd.Series:
    """
    Computes the Moving Average Convergence Divergence (MACD).
    """
    short_ema = series.ewm(span=short).mean()
    long_ema = series.ewm(span=long).mean()
    return short_ema - long_ema

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Generates technical indicators as features.
    
    Args:
        df (pd.DataFrame): The input dataframe with stock data.
        
    Returns:
        pd.DataFrame: A dataframe with technical indicators.
    """
    feats = pd.DataFrame(index=df.index)
    # Ensure we use 'Close' column correctly, handling potential MultiIndex if needed
    # yfinance sometimes returns MultiIndex columns. 
    # For now, assuming typical single level or handling it in main if needed.
    # But based on original notebook, it seems straightforward.
    
    close_col = df["Close"]
    
    feats["SMA_20"] = close_col.rolling(20).mean()
    feats["SMA_50"] = close_col.rolling(50).mean()
    feats["EMA_200"] = close_col.ewm(span=200).mean()
    feats["RSI"] = compute_rsi(close_col, 14)
    feats["MACD"] = compute_macd(close_col)
    feats["Volatility"] = close_col.pct_change().rolling(20).std()
    feats["Volume"] = df["Volume"].rolling(5).mean()
    return feats

def create_target(df: pd.DataFrame, horizon: int, threshold: float) -> pd.Series:
    """
    Creates the target variable.
    1 if price rises >= threshold after horizon days, else 0.
    """
    future_price = df["Close"].shift(-horizon)
    target = ((future_price - df["Close"]) / df["Close"] >= threshold).astype(int)
    return target
