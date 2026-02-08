import pandas as pd
from data.loader import get_stock_data
from features.indicators import create_features, create_target
from models.train import train_time_series_model
import config
from backend.logger import setup_logger

logger = setup_logger("MainAnalysis")

def run_analysis(ticker=config.TICKER):
    logger.info(f"=== AI Technical Analysis for {ticker} ===")
    logger.info(f"Data: {config.START_DATE} -> latest | Horizon: {config.FORECAST_HORIZON}d | Good if >= {config.GOOD_THRESHOLD*100:.1f}%\n")

    # 1. Load data
    try:
        df = get_stock_data(ticker, config.START_DATE)
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        return None

    # 2. Feature Engineering
    print("Generating features...")
    feats = create_features(df)
    target = create_target(df, config.FORECAST_HORIZON, config.GOOD_THRESHOLD)

    # 3. Prepare Data
    data = feats.copy()
    data['target'] = target
    data.dropna(inplace=True)

    X = data.drop(columns=["target"])
    y = data["target"].squeeze()

    # Train-test split (last row for prediction)
    if len(X) < 2:
        print("Not enough data to train and predict.")
        return None

    X_train, y_train = X.iloc[:-1], y.iloc[:-1]
    X_latest = X.iloc[[-1]]
    latest_date = X_latest.index[-1].date()

    # 4. Train Model
    model, cv_scores, feat_importance = train_time_series_model(
        X_train, 
        y_train, 
        config.TEST_SPLITS, 
        config.N_ESTIMATORS, 
        config.RANDOM_STATE
    )

    # 5. Prediction
    pred = model.predict(X_latest)[0]
    prob = model.predict_proba(X_latest)[0][1]

    # Feature Importance
    feat_df = pd.DataFrame({"Feature": X.columns, "Importance": feat_importance})
    feat_df = feat_df.sort_values("Importance", ascending=False)
    
    result = {
        "ticker": ticker,
        "date": latest_date,
        "cv_accuracy": cv_scores.mean(),
        "cv_std": cv_scores.std(),
        "prediction": "GOOD" if pred == 1 else "NOT GOOD",
        "confidence": prob,
        "top_features": feat_df.head(10).to_dict(orient="records")
    }

    return result

def main():
    result = run_analysis()
    if result:
        print(f"Cross-Validation Accuracy: {result['cv_accuracy']:.2%} (+/- {result['cv_std']:.2%})")
        print(f"Prediction date: {result['date']}")
        print(f"Prediction: {result['prediction']}")
        print(f"Confidence: {result['confidence']:.2%}\n")
        print("Top features influencing decision:")
        print(pd.DataFrame(result['top_features']))

if __name__ == "__main__":
    main()
