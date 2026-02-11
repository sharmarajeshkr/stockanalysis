from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import stocks, funds, analysis

app = FastAPI(title="Stock & Mutual Fund Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stocks.router, prefix="/api/stocks", tags=["Stocks"])
# app.include_router(funds.router, prefix="/api/funds", tags=["Mutual Funds"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Stock & Mutual Fund Analysis API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
