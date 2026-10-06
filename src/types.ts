export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
export type AlertCategory = 'SYSTEM' | 'SENSOR' | 'SECURITY' | 'MCB' | 'EMERGENCY';

export interface AlertEvent {
  id: string;
  timestamp: string;
  category: AlertCategory;
  severity: AlertSeverity;
  message: string;
  acknowledged?: boolean;
}

export interface EnvironmentData {
  temperature: number;
  temperatureUnit: string;
  temperatureStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  gas: number;
  gasUnit: string;
  gasStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  humidity: number;
  humidityUnit: string;
  humidityStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  fireStatus: 'SAFE' | 'EMERGENCY';
  fireOpticalReading: number; // 0-100%
  lastUpdated: string;
}

export interface ElectricalReading {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerFactor: number;
}

export interface McbDevice {
  id: string;
  name: string;
  circuit: string;
  status: 'ONLINE' | 'OFFLINE' | 'TRIPPED';
  switchState: boolean; // on or off
  currentLoad: number; // in Amperese
  maxCapacity: number; // in Amperes
  temperature: number; // °C
  connectedTo: string;
  tripReason?: string;
  lastToggled?: string;
}

export interface SecurityStatus {
  cameraStatus: "ONLINE" | "STANDBY" | "OFFLINE";
  fps: number;
  activeCameraId: string;

  personDetected: number;
  knifeDetected: number;

  personConfidence: number;
  knifeConfidence: number;

  theftProtectionArmed: boolean;

  intruderDetected: boolean;
  intruderLocation?: string;

  cvEngineStatus: "ACTIVE" | "STANDBY" | "DEGRADED";
}

export interface SystemHealthItem {
  id: string;
  name: string;
  status: 'CONNECTED' | 'NOT CONNECTED' | 'STANDBY' | 'WAITING FOR IOT';
  indicatorColor: 'emerald' | 'amber' | 'rose' | 'zinc';
  note: string;
}

export interface FacilitySettings {
  tempWarningThreshold: number;
  tempCriticalThreshold: number;
  gasWarningThreshold: number;
  gasCriticalThreshold: number;
  cvConfidenceThreshold: number;
  extinguisherPin: string;
  audioAlarmEnabled: boolean;
  autoTripOnCriticalGas: boolean;
  autoTripOnFire: boolean;
  pollingRateMs: number;
  nightVisionMode: boolean;
  reticleOverlay: boolean;
}
