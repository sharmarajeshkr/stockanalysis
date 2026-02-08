from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import pandas as pd

# Add parent directory to path to import from root modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import run_analysis
from sector_analysis import get_sector_analysis
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
        # Try to read from CSV first for speed, or run analysis if needed
        # For now, let's trigger the analysis to ensure freshness, or can implement caching
        # Calling the refactored function
        data = get_sector_analysis()
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
