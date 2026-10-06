from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.mqtt.client import start_mqtt
from app.cv.service import camera_service

from app.api.sensors import router as sensors_router
from app.api.emergency import router as emergency_router
from app.api.security import router as security_router


# ---------------------------------------------------------
# Global MQTT client
# ---------------------------------------------------------

mqtt_client = None


# ---------------------------------------------------------
# Application Lifespan
# ---------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global mqtt_client

    # ---------------------------------------------
    # Start MQTT
    # ---------------------------------------------

    print("[SYSTEM] Starting MQTT...")

    mqtt_client = start_mqtt()

    # ---------------------------------------------
    # Start CV / Camera
    # ---------------------------------------------

    print("[SYSTEM] Starting CV camera service...")

    camera_service.start()

    print("[SYSTEM] Smart MCB services started.")

    yield

    # ---------------------------------------------
    # Stop CV / Camera
    # ---------------------------------------------

    print("[SYSTEM] Stopping CV camera service...")

    camera_service.stop()

    # ---------------------------------------------
    # Stop MQTT
    # ---------------------------------------------

    print("[SYSTEM] Stopping MQTT...")

    if mqtt_client:
        mqtt_client.loop_stop()
        mqtt_client.disconnect()

    print("[SYSTEM] Smart MCB services stopped.")


# ---------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------

app = FastAPI(
    title="Smart MCB Backend",
    version="1.0.0",
    lifespan=lifespan,
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.1.6:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API Routers
# ---------------------------------------------------------

app.include_router(sensors_router)
app.include_router(emergency_router)
app.include_router(security_router)


# ---------------------------------------------------------
# Root Endpoint
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "system": "Smart MCB",
        "status": "online",
        "mqtt": "active",
        "cv": "active",
    }