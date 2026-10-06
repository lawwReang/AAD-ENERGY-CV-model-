from fastapi import APIRouter, HTTPException

from app.sensors.service import get_latest_reading


router = APIRouter(
    prefix="/api/sensors",
    tags=["Sensors"],
)


@router.get("/latest")
def latest_readings():
    """Return the latest reading from all connected Smart MCB devices."""

    readings = get_latest_reading()

    return {
        "status": "ok",
        "devices": readings,
    }


@router.get("/{device_id}")
def device_reading(device_id: str):
    """Return the latest reading from a specific Smart MCB device."""

    reading = get_latest_reading(device_id)

    if reading is None:
        raise HTTPException(
            status_code=404,
            detail=f"No reading available for device {device_id}",
        )

    return {
        "status": "ok",
        "reading": reading,
    }