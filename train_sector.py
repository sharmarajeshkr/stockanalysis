import pandas as pd
import yfinance as yf
import numpy as np
import config
import os
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
from features.indicators import create_features, create_target
from backend.logger import setup_logger
from data.loader import get_stock_data 

logger = setup_logger("TrainSectorModel")

def prepare_training_data():
    """
    Fetches data for all stocks, creates features, and combines them.
    """
    logger.info(f"Fetching data from {config.START_DATE} for {len(config.NIFTY_IT_STOCKS)} stocks...")
    
    all_X = []
    all_y = []
    
    for ticker in config.NIFTY_IT_STOCKS:
        try:
            df = get_stock_data(ticker, config.START_DATE)
            if df is None or len(df) < 50:
                logger.warning(f"Skipping {ticker}: Insufficient data")
                continue
                
            # Create features
            feats = create_features(df)
            target = create_target(df, config.FORECAST_HORIZON, config.GOOD_THRESHOLD)
            
            # Combine
            data = feats.copy()
            data['target'] = target
            data.dropna(inplace=True)
            
            if len(data) < 50:
                 continue
                 
            X = data.drop(columns=['target'])
            y = data['target']
            
            # Add Ticker as a categorical feature? 
            # Usually better to train a general model on technicals, or OneHotEncode ticker.
            # For simplicity and robustness, we stick to technicals only (general pattern).
            
            all_X.append(X)
            all_y.append(y)
            logger.info(f"Processed {ticker}: {len(X)} samples")
            
        except Exception as e:
            logger.error(f"Error processing {ticker}: {e}")
            
    if not all_X:
        return None, None
        
    # Concatenate all data
    final_X = pd.concat(all_X)
    final_y = pd.concat(all_y)
    
    return final_X, final_y

def train_and_save_model():
    logger.info("Preparing training data...")
    X, y = prepare_training_data()
    
    if X is None:
        logger.error("No training data available.")
        return

    logger.info(f"Training on {len(X)} total samples with {X.shape[1]} features.")
    
    # Train
    model = RandomForestClassifier(
        n_estimators=config.N_ESTIMATORS,
        random_state=config.RANDOM_STATE,
        n_jobs=-1
    )
    
    # Cross Validation (TimeSeriesSplit logic is tricky with concatenated data, 
    # but standard CV is better than nothing for checking stability)
    # Actually, simplistic CV on shuffled data is bad for time series.
    # We should trust the Random Forest OOB score or just train on all.
    
    model.fit(X, y)
    
    logger.info("Model training complete.")
    
    # Save
    if not os.path.exists("models"):
        os.makedirs("models")
        
    joblib.dump(model, config.MODEL_PATH)
    joblib.dump(list(X.columns), "models/features.joblib")
    
    logger.info(f"Model saved to {config.MODEL_PATH}")

if __name__ == "__main__":
    train_and_save_model()
