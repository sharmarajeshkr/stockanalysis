# CONFIG
from datetime import datetime, timedelta

# NIFTY IT Constituents
NIFTY_IT_STOCKS = [
    "TCS.NS", "INFY.NS", "HCLTECH.NS", "WIPRO.NS", "TECHM.NS",
    "LTIM.NS", "COFORGE.NS", "PERSISTENT.NS", "MPHASIS.NS", 
    "OFSS.NS", "LTTS.NS", "TATATECH.NS" 
]

TICKER = "TCS.BO" # Default/Example
START_DATE = (datetime.now() - timedelta(days=365*10)).strftime('%Y-%m-%d')  # 10 years of data
FORECAST_HORIZON = 20  # days ahead (approx 1 month)
PREDICTION_LENGTH = 20
GOOD_THRESHOLD = 0.02  # 2% price increase considered good
TEST_SPLITS = 5
N_ESTIMATORS = 200
RANDOM_STATE = 42


# Model Settings
MODEL_NAME = "random_forest"
MODEL_PATH = "models/sector_model.joblib"
