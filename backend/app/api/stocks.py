from fastapi import APIRouter, HTTPException, Query
import yfinance as yf
import pandas as pd
from typing import List, Optional

router = APIRouter()

# Top Indian stocks to monitor for market overview (Proxy for "Most Bought" / "Movers")
NIFTY_TOP_20 = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
    "HINDUNILVR.NS", "ITC.NS", "SBIN.NS", "BHARTIARTL.NS", "KOTAKBANK.NS",
    "LT.NS", "AXISBANK.NS", "ASIANPAINT.NS", "MARUTI.NS", "TITAN.NS",
    "BAJFINANCE.NS", "WIPRO.NS", "M&M.NS", "ULTRACEMCO.NS", "SUNPHARMA.NS"
]

@router.get("/market-status")
def get_market_status():
    """
    Fetch batch data for top stocks and categorize them into:
    - Most Bought (Active by Volume)
    - Top Gainers
    - Top Losers
    """
    try:
        # Download batch data for 1 day
        tickers_str = " ".join(NIFTY_TOP_20)
        data = yf.download(NIFTY_TOP_20, period="1d", group_by='ticker')
        
        market_data = []
        
        for symbol in NIFTY_TOP_20:
            try:
                # yf.download multi-index handling
                if len(NIFTY_TOP_20) > 1:
                    hist = data[symbol]
                else:
                    hist = data
                
                if not hist.empty:
                    # Get latest available row
                    row = hist.iloc[-1]
                    prev_close = row['Open'] # Approx for intraday change if 'Prev Close' not available
                    # Better to fetch info if needed, but slow. Using intraday open vs close for speed.
                    
                    price = float(row['Close'])
                    change = price - float(row['Open'])
                    p_change = (change / float(row['Open'])) * 100
                    volume = int(row['Volume'])
                    
                    market_data.append({
                        "symbol": symbol.replace('.NS', ''),
                        "name": symbol.replace('.NS', ''), # Placeholder name
                        "price": f"{price:,.2f}",
                        "change": f"{change:+.2f} ({p_change:+.2f}%)",
                        "isPositive": change >= 0,
                        "volume": volume,
                        "raw_change": p_change
                    })
            except Exception as e:
                continue

        # Sort lists
        # Most Bought -> approximated by Volume
        most_active = sorted(market_data, key=lambda x: x['volume'], reverse=True)[:5]
        
        # Gainers
        gainers = sorted([x for x in market_data if x['isPositive']], key=lambda x: x['raw_change'], reverse=True)[:5]
        
        # Losers
        losers = sorted([x for x in market_data if not x['isPositive']], key=lambda x: x['raw_change'])[:5]
        
        return {
            "most_bought": most_active,
            "gainers": gainers,
            "losers": losers
        }

    except Exception as e:
        print(f"Error fetching market status: {e}")
        # Fallback empty structure
        return {"most_bought": [], "gainers": [], "losers": []}

@router.get("/search/{symbol}")
def search_stock(symbol: str):
    """
    Search for a stock by symbol and return basic info.
    """
    try:
        # Append .NS if looking like an Indian ticker without suffix
        search_sym = symbol.upper()
        if not search_sym.endswith(".NS") and not search_sym.endswith(".BO") and len(search_sym) < 10:
             # Default to NSE for this app context
             search_sym += ".NS"

        ticker = yf.Ticker(search_sym)
        
        # Fast info fetch
        info = ticker.info
        
        # 1 Month history for chart
        history = ticker.history(period="1mo")
        
        history_data = []
        for index, row in history.iterrows():
            history_data.append({
                "date": index.strftime("%d/%m"),
                "close": float(row["Close"])
            })

        current_price = info.get("currentPrice") or info.get("regularMarketPrice") or history['Close'].iloc[-1]
        currency = info.get("currency", "INR")
        symbol_display = symbol.upper()
        
        # Calculate daily change
        previous_close = info.get("previousClose") or history['Open'].iloc[-1]
        change_val = current_price - previous_close
        change_pct = (change_val / previous_close) * 100
        change_str = f"{change_val:+.2f} ({change_pct:+.2f}%)"

        return {
            "symbol": symbol_display,
            "name": info.get("longName", symbol_display),
            "price": f"{current_price:,.2f}",
            "currency": currency,
            "change": change_str,
            "market_cap": f"{info.get('marketCap', 0) / 10000000:.2f}Cr", # Approx Cr formatting
            "pe": f"{info.get('trailingPE', 0):.2f}",
            "sector": info.get("sector", "Unknown"),
            "summary": info.get("longBusinessSummary", "No summary available."),
            "history": history_data
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock not found: {str(e)}")

@router.get("/trending")
def get_trending_stocks():
    # Reuse market status for trending if needed, or just return top gainers
    status = get_market_status()
    return status.get("gainers", [])
