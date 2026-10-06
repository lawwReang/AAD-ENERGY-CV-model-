from datetime import datetime, timezone
from typing import Any


_sos_active = False
_last_sos: dict[str, Any] | None = None


def trigger_sos(
    *,
    sos_type: str,
    reason: str,
    device_id: str = "MCB-001",
    sensor: str = "manual",
    value: float = 0.0,
) -> dict[str, Any]:
    """
    Trigger an SOS event.

    Once active, the SOS remains active until explicitly cleared
    through the emergency reset endpoint.
    """
    global _sos_active, _last_sos

    # Never overwrite an already-active SOS.
    if _sos_active:
        return _last_sos or {
            "active": True,
            "triggered": False,
        }

    _sos_active = True

    _last_sos = {
        "active": True,
        "triggered": True,
        "type": sos_type,
        "reason": reason,
        "device_id": device_id,
        "sensor": sensor,
        "value": value,
        "triggered_at": datetime.now(timezone.utc).isoformat(),
    }

    return _last_sos


def trigger_automatic_sos(
    reason: str,
    device_id: str,
    sensor: str,
    value: float,
) -> dict[str, Any]:
    """
    Trigger an automatic SOS from sensors/CV.
    """
    return trigger_sos(
        sos_type="AUTOMATIC",
        reason=reason,
        device_id=device_id,
        sensor=sensor,
        value=value,
    )


def trigger_manual_sos(
    reason: str = "Manual emergency SOS activated",
    device_id: str = "MCB-001",
) -> dict[str, Any]:
    """
    Trigger a manual SOS from the dashboard/user.
    """
    return trigger_sos(
        sos_type="MANUAL",
        reason=reason,
        device_id=device_id,
        sensor="manual",
        value=0.0,
    )


def clear_sos() -> None:
    """
    Explicitly clear the active SOS.
    """
    global _sos_active, _last_sos

    _sos_active = False
    _last_sos = None


def is_sos_active() -> bool:
    return _sos_active


def get_sos_status() -> dict[str, Any]:
    return {
        "active": _sos_active,
        "details": _last_sos,
    }