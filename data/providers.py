from abc import ABC, abstractmethod
import pandas as pd
import yfinance as yf
from backend.logger import setup_logger

logger = setup_logger("DataProviders")

class StockDataProvider(ABC):
    """
    Abstract base class for stock data providers.
    """
    @abstractmethod
    def get_history(self, ticker: str, start_date: str) -> pd.DataFrame:
        """
        Fetches historical stock data.

        Args:
            ticker (str): The stock ticker symbol.
            start_date (str): The start date for fetching data (YYYY-MM-DD).

        Returns:
            pd.DataFrame: A DataFrame containing the stock data with columns:
                          ["Open", "High", "Low", "Close", "Volume"]
                          and a DatetimeIndex.
        """
        pass

class YFinanceProvider(StockDataProvider):
    """
    Implementation of StockDataProvider using yfinance.
    """
    def get_history(self, ticker: str, start_date: str) -> pd.DataFrame:
        logger.info(f"Fetching data for {ticker} from {start_date} using yfinance...")
        try:
            df = yf.download(ticker, start=start_date, progress=False)
            
            if df.empty:
                logger.warning(f"No data found for {ticker} from {start_date}")
                return df

            # Validate columns (yfinance usually returns MultiIndex if multiple tickers, 
            # but here we fetch one. If it's single level, it's fine. 
            # If yfinance returns 'Adj Close', we might want to standardize, 
            # but existing code uses 'Close'. We'll stick to returning what yfinance gives 
            # but logged/checked.)
            
            # Keep consistent with previous yfinance behavior in this app
            return df
            
        except Exception as e:
            logger.error(f"Error fetching data for {ticker} using yfinance: {e}")
            raise e
