from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import TimeSeriesSplit, cross_val_score
import pandas as pd
import numpy as np
from typing import Tuple, Any

def train_time_series_model(X: pd.DataFrame, y: pd.Series, n_splits: int, n_estimators: int, random_state: int) -> Tuple[Any, np.ndarray, np.ndarray]:
    """
    Trains a Random Forest model using TimeSeriesSplit.

    Args:
        X (pd.DataFrame): Features.
        y (pd.Series): Target.
        n_splits (int): Number of splits for TimeSeriesSplit.
        n_estimators (int): Number of trees in the forest.
        random_state (int): Random state for reproducibility.

    Returns:
        Tuple[Any, np.ndarray, np.ndarray]: The trained model, cross-validation scores, and feature importances.
    """
    print(f"Training model with {n_estimators} estimators and {n_splits} splits...")
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        random_state=random_state
    )
    tscv = TimeSeriesSplit(n_splits=n_splits)
    scores = cross_val_score(model, X, y, cv=tscv, scoring="accuracy")
    model.fit(X, y)
    return model, scores, model.feature_importances_
