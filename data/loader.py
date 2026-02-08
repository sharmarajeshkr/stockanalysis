import pandas as pd
from backend.logger import setup_logger
from data.providers import YFinanceProvider

logger = setup_logger("DataLoader")

# Initialize the provider (could be configurable)
_provider = YFinanceProvider()

def get_stock_data(ticker: str, start: str) -> pd.DataFrame:
    """
    Fetches stock data using the configured provider.

    Args:
        ticker (str): The stock ticker symbol.
        start (str): The start date for fetching data (YYYY-MM-DD).

    Returns:
        pd.DataFrame: A DataFrame containing the stock data.
    """
    # Delegate to the provider
    df = _provider.get_history(ticker, start)
    
    if df.empty:
         # Provider might return empty df, we raise error here as per original contract
        raise ValueError(f"No data found for ticker {ticker} from {start}")
    
    return df
