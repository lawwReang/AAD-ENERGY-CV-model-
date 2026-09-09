/**
 * Smart MCB Command Center — Future Integration API Bridge
 * 
 * ARCHITECTURAL PLACEHOLDER:
 * In production, this module will bridge the React frontend with the FastAPI / MQTT
 * edge gateway running on the industrial edge controller.
 * 
 * Future pipeline:
 * React UI  <-->  FastAPI REST / WebSocket  <-->  Modbus RTU / MQTT  <-->  Smart MCBs & Sensors
 */

import { 
  EnvironmentData, 
  McbDevice, 
  AlertEvent, 
  SecurityStatus, 
  ElectricalReading 
} from '../types';
import { 
  environment as mockEnv, 
  devices as mockDevices, 
  alerts as mockAlerts, 
  security as mockSec, 
  electricalMetrics as mockElec 
} from '../data/mockData';

// Placeholder for future backend URL configuration
export const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Fetch real-time environmental telemetry (Temperature, Gas, Humidity, Fire)
 * Future implementation: GET /api/v1/sensors/environment
 */
export async function fetchEnvironmentTelemetry(): Promise<EnvironmentData> {
  // PLACEHOLDER: returns local mock data until FastAPI backend is attached
  return Promise.resolve({ ...mockEnv });
}

/**
 * Fetch MCB network topology & switch load telemetry
 * Future implementation: GET /api/v1/mcb/devices
 */
export async function fetchMcbDevices(): Promise<McbDevice[]> {
  // PLACEHOLDER: returns local mock data
  return Promise.resolve([...mockDevices]);
}

/**
 * Send actuation command to flip or trip an MCB breaker switch
 * Future implementation: POST /api/v1/mcb/{id}/actuate
 */
export async function toggleMcbBreaker(
  deviceId: string, 
  targetState: boolean
): Promise<{ success: boolean; deviceId: string; newState: boolean }> {
  // PLACEHOLDER: simulates breaker relay actuation
  console.log(`[API MOCK] Actuating Breaker ${deviceId} -> ${targetState ? 'CLOSED' : 'OPEN'}`);
  return Promise.resolve({
    success: true,
    deviceId,
    newState: targetState,
  });
}

/**
 * Fetch live security camera telemetry & computer vision inferences
 * Future implementation: GET /api/v1/security/telemetry
 */
export async function fetchSecurityTelemetry(): Promise<SecurityStatus> {
  return Promise.resolve({ ...mockSec });
}

/**
 * Trigger physical automated fire extinguisher discharge
 * Future implementation: POST /api/v1/emergency/extinguisher/discharge
 */
export async function triggerExtinguisherDischarge(
  authorizedPin: string
): Promise<{ success: boolean; message: string; timestamp: string }> {
  console.log(`[API MOCK] Fire extinguisher discharge triggered with authorized PIN: ${authorizedPin}`);
  return Promise.resolve({
    success: true,
    message: 'Nitrogen & Clean-Agent Solenoids Actuated. Fire suppression sequence started.',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Fetch electrical power analyzer readings (Voltage, Current, Power, Energy)
 * Future implementation: GET /api/v1/power/readings
 */
export async function fetchElectricalReadings(): Promise<ElectricalReading> {
  return Promise.resolve({ ...mockElec });
}

/**
 * Fetch chronological event stream logs
 * Future implementation: GET /api/v1/events/stream
 */
export async function fetchEventStream(): Promise<AlertEvent[]> {
  return Promise.resolve([...mockAlerts]);
}
