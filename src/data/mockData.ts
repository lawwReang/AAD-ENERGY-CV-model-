import { 
  EnvironmentData, 
  McbDevice, 
  AlertEvent, 
  SecurityStatus, 
  SystemHealthItem, 
  ElectricalReading,
  FacilitySettings 
} from '../types';

export const environment: EnvironmentData = {
  temperature: 38.4,
  temperatureUnit: '°C',
  temperatureStatus: 'NORMAL',
  gas: 21.4,
  gasUnit: '%',
  gasStatus: 'NORMAL',
  humidity: 48.2,
  humidityUnit: '% RH',
  humidityStatus: 'NORMAL',
  fireStatus: 'SAFE',
  fireOpticalReading: 2, // 2% baseline safe
  lastUpdated: '18:54:21',
};

export const security: SecurityStatus = {
  cameraStatus: 'ONLINE',
  fps: 30,
  activeCameraId: 'CAM-01',
  personDetected: 1,
  firearmDetected: 0,
  firearmConfidence: 0,
  personConfidence: 94,
  theftProtectionArmed: true,
  intruderDetected: false,
  intruderLocation: 'SECTOR-02 PERIMETER',
  cvEngineStatus: 'ACTIVE',
};

export const devices: McbDevice[] = [
  {
    id: 'MCB-01',
    name: 'MAIN FEEDER A',
    circuit: '400V 3-PHASE INCOMING',
    status: 'ONLINE',
    switchState: true,
    currentLoad: 14.8,
    maxCapacity: 32.0,
    temperature: 38.4,
    connectedTo: 'MAIN GRID BUS',
    lastToggled: '18:12:00',
  },
  {
    id: 'MCB-02',
    name: 'HVAC & COOLING TOWER',
    circuit: '230V CHILLER UNIT',
    status: 'ONLINE',
    switchState: true,
    currentLoad: 8.2,
    maxCapacity: 20.0,
    temperature: 36.8,
    connectedTo: 'FEEDER-01',
    lastToggled: '17:45:10',
  },
  {
    id: 'MCB-03',
    name: 'LIGHTING & AUX VAULT',
    circuit: '230V AUXILIARY',
    status: 'OFFLINE',
    switchState: false,
    currentLoad: 0.0,
    maxCapacity: 16.0,
    temperature: 24.1,
    connectedTo: 'FEEDER-01',
    lastToggled: '14:20:00',
  },
  {
    id: 'MCB-04',
    name: 'HEAVY MACHINERY BAY',
    circuit: '400V SERVO DRIVES',
    status: 'ONLINE',
    switchState: true,
    currentLoad: 12.4,
    maxCapacity: 25.0,
    temperature: 41.2,
    connectedTo: 'MAIN GRID BUS',
    lastToggled: '16:00:30',
  },
  {
    id: 'MCB-05',
    name: 'SERVER RACK & UPS',
    circuit: '230V CRITICAL POWER',
    status: 'ONLINE',
    switchState: true,
    currentLoad: 6.5,
    maxCapacity: 16.0,
    temperature: 31.0,
    connectedTo: 'UPS LINE 1',
    lastToggled: '12:00:00',
  },
  {
    id: 'MCB-06',
    name: 'AUTOMATED EXTINGUISHER',
    circuit: '24V DC ACTUATOR BUS',
    status: 'ONLINE',
    switchState: true,
    currentLoad: 0.8,
    maxCapacity: 10.0,
    temperature: 26.5,
    connectedTo: 'SAFETY BACKUP',
    lastToggled: '08:00:00',
  },
];

export const alerts: AlertEvent[] = [
  {
    id: 'evt-101',
    timestamp: '18:54:18',
    category: 'SYSTEM',
    severity: 'INFO',
    message: 'Sensor telemetry heartbeat acknowledged by bus gateway',
    acknowledged: true,
  },
  {
    id: 'evt-102',
    timestamp: '18:53:41',
    category: 'SENSOR',
    severity: 'INFO',
    message: 'Temperature stabilized at nominal operating threshold 38.4°C',
    acknowledged: true,
  },
  {
    id: 'evt-103',
    timestamp: '18:52:09',
    category: 'SECURITY',
    severity: 'WARNING',
    message: 'Person detected in restricted entry portal — CAM-01 (Confidence: 94%)',
    acknowledged: false,
  },
  {
    id: 'evt-104',
    timestamp: '18:50:42',
    category: 'SENSOR',
    severity: 'SUCCESS',
    message: 'Atmospheric gas ionization sensor normal (214 ppm CO/VOC)',
    acknowledged: true,
  },
  {
    id: 'evt-105',
    timestamp: '18:48:17',
    category: 'MCB',
    severity: 'INFO',
    message: 'Smart Breaker MCB-001 connected on Modbus-RTU node 0x2A',
    acknowledged: true,
  },
  {
    id: 'evt-106',
    timestamp: '18:42:05',
    category: 'SECURITY',
    severity: 'INFO',
    message: 'Optical perimeter scan completed with 0 anomalies logged',
    acknowledged: true,
  },
];

export const systemHealth: SystemHealthItem[] = [
  {
    id: 'sh-1',
    name: 'BACKEND',
    status: 'NOT CONNECTED',
    indicatorColor: 'amber',
    note: 'FastAPI bridge awaiting network socket'
  },
  {
    id: 'sh-2',
    name: 'SENSORS',
    status: 'WAITING FOR IOT',
    indicatorColor: 'amber',
    note: 'MQTT broker / ESP32 mesh standby'
  },
  {
    id: 'sh-3',
    name: 'CAMERA',
    status: 'NOT CONNECTED',
    indicatorColor: 'amber',
    note: 'RTSP video stream emulated locally'
  },
  {
    id: 'sh-4',
    name: 'CV ENGINE',
    status: 'STANDBY',
    indicatorColor: 'emerald',
    note: 'YOLOv8 safety model simulated'
  },
  {
    id: 'sh-5',
    name: 'DATABASE',
    status: 'NOT CONNECTED',
    indicatorColor: 'zinc',
    note: 'Local in-memory telemetry buffer'
  }
];

export const electricalMetrics: ElectricalReading = {
  voltage: 231.4,
  current: 4.82,
  power: 1.11,
  energy: 8.42,
  frequency: 50.02,
  powerFactor: 0.98,
};

export const defaultSettings: FacilitySettings = {
  tempWarningThreshold: 45.0,
  tempCriticalThreshold: 60.0,
  gasWarningThreshold: 40.0,
  gasCriticalThreshold: 70.0,
  cvConfidenceThreshold: 80,
  extinguisherPin: '1234',
  audioAlarmEnabled: true,
  autoTripOnCriticalGas: true,
  autoTripOnFire: true,
  pollingRateMs: 2000,
  nightVisionMode: false,
  reticleOverlay: true,
};

export const historicalSensorData = [
  { time: '18:24', temp: 36.2, gas: 19.8, humidity: 47.5 },
  { time: '18:29', temp: 36.8, gas: 20.4, humidity: 48.0 },
  { time: '18:34', temp: 37.1, gas: 21.0, humidity: 48.1 },
  { time: '18:39', temp: 37.5, gas: 21.8, humidity: 47.9 },
  { time: '18:44', temp: 38.0, gas: 22.2, humidity: 48.3 },
  { time: '18:49', temp: 38.2, gas: 21.6, humidity: 48.2 },
  { time: '18:54', temp: 38.4, gas: 21.4, humidity: 48.2 },
];
