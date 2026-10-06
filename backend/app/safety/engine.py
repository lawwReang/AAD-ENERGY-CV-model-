from typing import Literal

SensorStatus = Literal["NORMAL", "WARNING", "CRITICAL"]

TEMP_WARNING = 45.0
TEMP_CRITICAL = 60.0

GAS_WARNING = 40.0
GAS_CRITICAL = 70.0


def evaluate_temperature(value: float) -> SensorStatus:
    if value >= TEMP_CRITICAL:
        return "CRITICAL"

    if value >= TEMP_WARNING:
        return "WARNING"

    return "NORMAL"


def evaluate_gas(value: float) -> SensorStatus:
    if value >= GAS_CRITICAL:                                 
        return "CRITICAL"

    if value >= GAS_WARNING:
        return "WARNING"

    return "NORMAL"


def evaluate_humidity(value: float) -> SensorStatus:
    # Humidity safety thresholds are not finalized yet.
    return "NORMAL"


def evaluate_environment(
    temperature: float,
    gas: float,
    humidity: float,
) -> dict[str, SensorStatus]:

    return {
        "temperature_status": evaluate_temperature(temperature),
        "gas_status": evaluate_gas(gas),
        "humidity_status": evaluate_humidity(humidity),
    }