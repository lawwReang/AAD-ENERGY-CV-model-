from datetime import datetime, timezone
from typing import Any


# Latest sensor reading for each Smart MCB device.
# Example:
# {
#     "MCB-001": {
#         "device_id": "MCB-001",
#         "temperature": 38.4,
#         "humidity": 52.1,
#         "gas": 214,
#         "received_at": "..."
#     }
# }
_latest_readings: dict[str, dict[str, Any]] = {}


def update_reading(reading: dict[str, Any]) -> None:
    """Store the latest reading received from an IoT device."""

    device_id = reading["device_id"]

    _latest_readings[device_id] = {
        **reading,
        "received_at": datetime.now(timezone.utc).isoformat(),
    }


def get_latest_reading(
    device_id: str | None = None,
) -> dict[str, Any] | None:

    """Return the latest reading for one device."""

    if device_id:
        return _latest_readings.get(device_id)

    return _latest_readings