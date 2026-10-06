/**
 * Smart MCB Command Center — API Bridge
 *
 * Current pipeline:
 * React UI  <-->  FastAPI REST  <-->  MQTT  <-->  ESP32 / Sensors
 *
 * Connected:
 * - Environmental telemetry
 * - Safety threshold status
 * - Emergency / automatic SOS status
 *
 * Still pending:
 * - MCB control
 * - Security / CV telemetry
 * - Electrical telemetry
 * - Event persistence
 * - Physical extinguisher control
 */

import {
  EnvironmentData,
  McbDevice,
  AlertEvent,
  SecurityStatus,
  ElectricalReading,
} from "../types";

import {
  environment as mockEnv,
  devices as mockDevices,
  alerts as mockAlerts,
  security as mockSec,
  electricalMetrics as mockElec,
} from "../data/mockData";

/**
 * FastAPI backend.
 *
 * Current backend:
 * http://127.0.0.1:8000
 */
export const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Backend response from:
 * GET /api/sensors/latest
 */
interface LatestSensorsResponse {
  status: string;
  devices: Record<string, SensorReading>;
}

/**
 * Raw sensor reading received from FastAPI.
 */
interface SensorReading {
  device_id: string;

  temperature?: number;
  humidity?: number;
  gas?: number;

  temperature_status?: "NORMAL" | "WARNING" | "CRITICAL";
  humidity_status?: "NORMAL" | "WARNING" | "CRITICAL";
  gas_status?: "NORMAL" | "WARNING" | "CRITICAL";

  received_at?: string;
}

/**
 * Emergency / SOS details returned by FastAPI.
 */
export interface EmergencyDetails {
  active: boolean;
  triggered: boolean;
  type: "AUTOMATIC" | "MANUAL";
  reason: string;
  device_id: string;
  sensor: string;
  value: number;
  triggered_at: string;
}

/**
 * Backend response from:
 * GET /api/emergency/status
 */
export interface EmergencyStatusResponse {
  active: boolean;
  details: EmergencyDetails | null;
}

/**
 * Fetch real-time environmental telemetry.
 *
 * Pipeline:
 *
 * ESP32
 *   ↓ MQTT
 * Mosquitto
 *   ↓
 * FastAPI
 *   ↓ GET /api/sensors/latest
 * React
 */
export async function fetchEnvironmentTelemetry(): Promise<EnvironmentData> {
  const response = await fetch(`${API_BASE_URL}/api/sensors/latest`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch sensor telemetry: HTTP ${response.status}`,
    );
  }

  const data: LatestSensorsResponse = await response.json();

  const deviceIds = Object.keys(data.devices);

  if (deviceIds.length === 0) {
    throw new Error("No sensor readings available");
  }

  const reading = data.devices[deviceIds[0]];

  const temperature = reading.temperature ?? 0;
  const humidity = reading.humidity ?? 0;
  const gas = reading.gas ?? 0;

  return {
    temperature,
    temperatureUnit: "°C",
    temperatureStatus: reading.temperature_status ?? "NORMAL",

    humidity,
    humidityUnit: "% RH",
    humidityStatus: reading.humidity_status ?? "NORMAL",

    gas,
    gasUnit: "%",
    gasStatus: reading.gas_status ?? "NORMAL",

    fireStatus: "SAFE",
    fireOpticalReading: 0,

    lastUpdated: reading.received_at ?? new Date().toISOString(),
  };
}

/**
 * Fetch current emergency / SOS state.
 *
 * Pipeline:
 *
 * Critical sensor condition
 *   ↓
 * FastAPI Safety Engine
 *   ↓
 * Automatic SOS
 *   ↓
 * GET /api/emergency/status
 *   ↓
 * React
 */
export async function fetchEmergencyStatus(): Promise<EmergencyStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/emergency/status`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch emergency status: HTTP ${response.status}`,
    );
  }

  return response.json();
}

/**
 * Trigger a manual emergency / SOS.
 *
 * POST /api/emergency/sos
 */
export async function triggerManualSOS(): Promise<EmergencyStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/api/emergency/sos`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to trigger emergency SOS: HTTP ${response.status}`);
  }

  return response.json();
}


/**
 * Clear the current emergency / SOS state.
 *
 * POST /api/emergency/clear
 */
export async function clearEmergency(): Promise<{
  status: string;
  message: string;
  active: boolean;
}> {
  const response = await fetch(`${API_BASE_URL}/api/emergency/clear`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to clear emergency: HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch MCB network topology & switch load telemetry.
 *
 * NOT CONNECTED YET.
 */
export async function fetchMcbDevices(): Promise<McbDevice[]> {
  return Promise.resolve([...mockDevices]);
}

/**
 * Send actuation command to flip or trip an MCB breaker switch.
 *
 * NOT CONNECTED YET.
 */
export async function toggleMcbBreaker(
  deviceId: string,
  targetState: boolean,
): Promise<{
  success: boolean;
  deviceId: string;
  newState: boolean;
}> {
  console.log(
    `[API PLACEHOLDER] MCB actuation requested: ${deviceId} -> ${
      targetState ? "CLOSED" : "OPEN"
    }`,
  );

  return Promise.resolve({
    success: false,
    deviceId,
    newState: targetState,
  });
}

/**
 * Fetch live security camera telemetry & computer vision inferences.
 *
 * NOT CONNECTED YET.
 */
export async function fetchSecurityTelemetry(): Promise<SecurityStatus> {
  const response = await fetch(`${API_BASE_URL}/api/security/status`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch security telemetry: HTTP ${response.status}`,
    );
  }

  const data = await response.json();

  return {
    cameraStatus: data.camera_status,
    fps: 0,
    activeCameraId: "CAM-01",

    personDetected: data.person_detected,
    knifeDetected: data.knife_detected,

    personConfidence: data.person_confidence * 100,
    knifeConfidence: data.knife_confidence *100,

    theftProtectionArmed: true,

    intruderDetected: data.person_detected > 0 && data.knife_detected > 0,

    intruderLocation:
      data.person_detected > 0 && data.knife_detected > 0
        ? "MAIN ENTRANCE PORTAL"
        : undefined,

    cvEngineStatus: data.cv_engine_status,
  };
}

/**
 * Trigger physical automated fire extinguisher discharge.
 *
 * NOT CONNECTED YET.
 */
export async function triggerExtinguisherDischarge(
  authorizedPin: string,
): Promise<{
  success: boolean;
  message: string;
  timestamp: string;
}> {
  console.log(
    `[API PLACEHOLDER] Extinguisher authorization requested. PIN length: ${authorizedPin.length}`,
  );

  return Promise.resolve({
    success: false,
    message: "Hardware actuator is not connected.",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Fetch electrical power analyzer readings.
 *
 * NOT CONNECTED YET.
 */
export async function fetchElectricalReadings(): Promise<ElectricalReading> {
  return Promise.resolve({ ...mockElec });
}

/**
 * Fetch chronological event stream logs.
 *
 * NOT CONNECTED YET.
 */
export async function fetchEventStream(): Promise<AlertEvent[]> {
  return Promise.resolve([...mockAlerts]);
}
