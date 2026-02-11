from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_funds():
    return {"message": "Funds API - Coming Soon"}
