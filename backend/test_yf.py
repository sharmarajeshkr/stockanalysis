
import yfinance as yf
import pandas as pd

tickers = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'ICICIBANK.NS', 'HINDUNILVR.NS', 'ITC.NS', 'SBIN.NS']
print(f"Downloading data for: {tickers}")

try:
    data = yf.download(tickers, period='1d', group_by='ticker')
    print("Download complete.")
    
    # Process data to get latest price and change
    results = []
    for ticker in tickers:
        try:
            # yf.download structure depends on version, handling multi-index
            if len(tickers) > 1:
                hist = data[ticker]
            else:
                hist = data

            if not hist.empty:
                current = hist['Close'].iloc[-1]
                open_price = hist['Open'].iloc[-1]
                change = current - open_price
                change_pct = (change / open_price) * 100
                results.append(f"{ticker}: {current:.2f} ({change_pct:.2f}%)")
        except Exception as e:
            print(f"Error processing {ticker}: {e}")

    print("\nResults:")
    for r in results:
        print(r)

except Exception as e:
    print(f"Batch download failed: {e}")
