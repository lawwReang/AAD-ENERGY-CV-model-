from fastapi import APIRouter

from app.emergency.service import (
    get_sos_status,
    clear_sos,
    trigger_manual_sos,
)


router = APIRouter(
    prefix="/api/emergency",
    tags=["Emergency"],
)


@router.get("/status")
def emergency_status():
    return get_sos_status()


@router.post("/sos")
def emergency_sos():
    return trigger_manual_sos()


@router.post("/clear")
def emergency_clear():
    clear_sos()

    return {
        "status": "ok",
        "message": "Emergency state cleared",
        "active": False,
    }