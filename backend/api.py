from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import pandas as pd

# Add parent directory to path to import from root modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import run_analysis

# from sector_analysis import get_sector_analysis # Deprecated
from backend.logger import setup_logger

logger = setup_logger("API")

app = FastAPI(title="Stock Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    logger.info("Health check requested")
    return {"status": "ok"}

@app.get("/api/sector-analysis")
def sector_analysis_endpoint():
    logger.info("Request: GET /api/sector-analysis")
    try:
        csv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sector_results.csv")
        
        if not os.path.exists(csv_path):
             # Trigger analysis if file doesn't exist? Or just return empty/error.
             # Better to return error or empty list and let user run prediction manually or via another endpoint.
             logger.warning("sector_results.csv not found.")
             return []

        df = pd.read_csv(csv_path)
        
        # Renaissance columns to match frontend expectations
        # Frontend expects: Ticker, Price, 30d_Change, Prediction, Confidence, CV_Accuracy
        # CSV has: Ticker, Price, Prediction, Confidence, 30d_Hist_Return
        
        df.rename(columns={"30d_Hist_Return": "30d_Change"}, inplace=True)
        
        # Add missing columns
        if "CV_Accuracy" not in df.columns:
            df["CV_Accuracy"] = 0.0 # Placeholder
            
        data = df.to_dict(orient="records")
        logger.info(f"Returning sector analysis for {len(data)} stocks")
        return data
    except Exception as e:
        logger.error(f"Error in sector-analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analyze/{ticker}")
def analyze_stock_endpoint(ticker: str):
    logger.info(f"Request: GET /api/analyze/{ticker}")
    try:
        result = run_analysis(ticker)
        if not result:
             logger.warning(f"Analysis failed for {ticker}: Insufficient data or symbol not found.")
             raise HTTPException(status_code=404, detail=f"Could not analyze {ticker}. Insufficient data or symbol not found.")
        logger.info(f"Successfully analyzed {ticker}")
        return result
    except Exception as e:
        logger.error(f"Error in analyze-stock {ticker}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
