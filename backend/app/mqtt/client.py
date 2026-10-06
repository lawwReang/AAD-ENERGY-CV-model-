import logging
import threading

import paho.mqtt.client as mqtt

from app.sensors.service import update_reading
from app.safety.engine import evaluate_environment
from app.emergency.service import trigger_automatic_sos

BROKER_HOST = "localhost"
BROKER_PORT = 1883

MQTT_TOPIC = "aade/mcb/#"   

DEVICE_ID = "MCB-001"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------
# Latest MQTT state
# ---------------------------------------------------------

_latest_state = {
    "device_id": DEVICE_ID,
    "temperature": 0.0,
    "humidity": 0.0,
    "gas": 0.0,
    "mcb_status": "UNKNOWN",
    "gas_emergency": "OFF",
    "sos": "OFF",
    "buzzer": "OFF",
}

_state_lock = threading.Lock()


# ---------------------------------------------------------
# MQTT CONNECT
# ---------------------------------------------------------

def on_connect(client, userdata, flags, reason_code, properties=None):
    if reason_code == 0:
        logger.info("Connected to MQTT broker")
        client.subscribe(MQTT_TOPIC)
        logger.info("Subscribed to %s", MQTT_TOPIC)
    else:
        logger.error("MQTT connection failed: %s", reason_code)


# ---------------------------------------------------------
# MQTT MESSAGE
# ---------------------------------------------------------

def on_message(client, userdata, message):
    topic = message.topic
    raw_value = message.payload.decode("utf-8").strip()

    logger.info(
        "MQTT message | topic=%s | value=%s",
        topic,
        raw_value,
    )

    try:
        # -------------------------------------------------
        # GAS
        # -------------------------------------------------

        if topic == "aade/mcb/gas":
            value = float(raw_value)

            with _state_lock:
                _latest_state["gas"] = value

        # -------------------------------------------------
        # TEMPERATURE
        # -------------------------------------------------

        elif topic == "aade/mcb/temperature":
            value = float(raw_value)

            with _state_lock:
                _latest_state["temperature"] = value

        # -------------------------------------------------
        # HUMIDITY
        # -------------------------------------------------

        elif topic == "aade/mcb/humidity":
            value = float(raw_value)

            with _state_lock:
                _latest_state["humidity"] = value

        # -------------------------------------------------
        # MCB STATUS
        # -------------------------------------------------

        elif topic == "aade/mcb/status":

            with _state_lock:
                _latest_state["mcb_status"] = raw_value

        # -------------------------------------------------
        # GAS EMERGENCY
        # -------------------------------------------------

        elif topic == "aade/mcb/gas_emergency":

            with _state_lock:
                _latest_state["gas_emergency"] = raw_value

        # -------------------------------------------------
        # SOS
        # -------------------------------------------------

        elif topic == "aade/mcb/sos":

            with _state_lock:
                _latest_state["sos"] = raw_value

        # -------------------------------------------------
        # BUZZER
        # -------------------------------------------------

        elif topic == "aade/mcb/buzzer":

            with _state_lock:
                _latest_state["buzzer"] = raw_value

        else:
            logger.info("Ignoring MQTT topic: %s", topic)
            return

        process_sensor_state()

    except ValueError:
        logger.error(
            "Invalid numeric value | topic=%s | value=%s",
            topic,
            raw_value,
        )

    except Exception:
        logger.exception("Error processing MQTT message")


# ---------------------------------------------------------
# PROCESS COMPLETE SENSOR STATE
# ---------------------------------------------------------

def process_sensor_state():

    with _state_lock:
        state = dict(_latest_state)

    temperature = float(state["temperature"])
    humidity = float(state["humidity"])
    gas = float(state["gas"])

    # -----------------------------------------------------
    # Safety evaluation
    # -----------------------------------------------------

    status = evaluate_environment(
        temperature=temperature,
        gas=gas,
        humidity=humidity,
    )

    # -----------------------------------------------------
    # Automatic SOS
    # -----------------------------------------------------

    if status["temperature_status"] == "CRITICAL":

        trigger_automatic_sos(
            reason="Temperature exceeded critical threshold",
            device_id=state["device_id"],
            sensor="temperature",
            value=temperature,
        )

    elif status["gas_status"] == "CRITICAL":

        trigger_automatic_sos(
            reason="Gas level exceeded critical threshold",
            device_id=state["device_id"],
            sensor="gas",
            value=gas,
        )

    # -----------------------------------------------------
    # Prepare reading for API
    # -----------------------------------------------------

    reading = {
        **state,

        "temperature_status":
            status["temperature_status"],

        "gas_status":
            status["gas_status"],

        "humidity_status":
            status["humidity_status"],
    }

    update_reading(reading)

    logger.info(
        "Sensor state updated | "
        "temperature=%s (%s) | "
        "humidity=%s (%s) | "
        "gas=%s (%s) | "
        "MCB=%s | "
        "SOS=%s",
        temperature,
        status["temperature_status"],
        humidity,
        status["humidity_status"],
        gas,
        status["gas_status"],
        state["mcb_status"],
        state["sos"],
    )


# ---------------------------------------------------------
# START MQTT
# ---------------------------------------------------------

def start_mqtt():

    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2,
        client_id="smart-mcb-backend",
    )

    client.on_connect = on_connect
    client.on_message = on_message

    logger.info(
        "Connecting to MQTT broker at %s:%s",
        BROKER_HOST,
        BROKER_PORT,
    )

    client.connect(
        BROKER_HOST,
        BROKER_PORT,
        keepalive=60,
    )

    client.loop_start()

    return client