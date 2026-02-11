from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import analyze_stock_data

router = APIRouter()

class AnalysisRequest(BaseModel):
    symbol: str
    stock_data: dict

@router.post("/generate")
async def generate_analysis(request: AnalysisRequest):
    """
    Generate AI analysis for a given stock based on its data.
    """
    try:
        analysis = await analyze_stock_data(request.symbol, request.stock_data)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
