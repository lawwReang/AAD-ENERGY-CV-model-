import React, { useState, useEffect } from 'react';
import { 
  EnvironmentData, 
  SecurityStatus, 
  McbDevice, 
  AlertEvent, 
  SystemHealthItem, 
  ElectricalReading, 
  FacilitySettings 
} from '../types';
import { 
  environment as initialEnv, 
  security as initialSec, 
  devices as initialDevices, 
  alerts as initialAlerts, 
  systemHealth as initialHealth, 
  electricalMetrics as initialElec, 
  defaultSettings,
  historicalSensorData 
} from '../data/mockData';

// Components
import { TopCommandBar } from '../components/command/TopCommandBar';
import { LeftNavigation, NavSection } from '../components/command/LeftNavigation';
import { SystemHealthStrip } from '../components/command/SystemHealthStrip';
import { CameraViewport } from '../components/security/CameraViewport';
import { CameraDetailsPanel } from '../components/security/CameraDetailsPanel';
import { DetectionHud } from '../components/security/DetectionHud';
import { TheftProtectionPanel } from '../components/security/TheftProtectionPanel';
import { EnvironmentalCore } from '../components/environment/EnvironmentalCore';
import { LiveSensorGraph } from '../components/environment/LiveSensorGraph';
import { McbNetworkTopology } from '../components/devices/McbNetworkTopology';
import { ElectricalMetrics } from '../components/devices/ElectricalMetrics';
import { AlertStream } from '../components/alerts/AlertStream';
import { EmergencyControlPanel } from '../components/emergency/EmergencyControlPanel';
import { ExtinguisherModal } from '../components/emergency/ExtinguisherModal';
import { CriticalAlertBanner } from '../components/emergency/CriticalAlertBanner';
import { SettingsModal } from '../components/settings/SettingsModal';
import { SimulationBar, DemoScenario } from '../components/common/SimulationBar';

export const Dashboard: React.FC = () => {
  // Primary States
  const [envData, setEnvData] = useState<EnvironmentData>({ ...initialEnv });
  const [securityData, setSecurityData] = useState<SecurityStatus>({ ...initialSec });
  const [mcbDevices, setMcbDevices] = useState<McbDevice[]>([...initialDevices]);
  const [eventLogs, setEventLogs] = useState<AlertEvent[]>([...initialAlerts]);
  const [healthItems, setHealthItems] = useState<SystemHealthItem[]>([...initialHealth]);
  const [powerMetrics, setPowerMetrics] = useState<ElectricalReading>({ ...initialElec });
  const [settings, setSettings] = useState<FacilitySettings>({ ...defaultSettings });
  const [sensorHistory, setSensorHistory] = useState([...historicalSensorData]);

  // UI Navigation & Modals
  const [activeNav, setActiveNav] = useState<NavSection>('overview');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExtinguisherModalOpen, setIsExtinguisherModalOpen] = useState<boolean>(false);
  const [extinguisherDischarged, setExtinguisherDischarged] = useState<boolean>(false);

  // Camera Optical & Feed Controls State
  const [activeCam, setActiveCam] = useState<string>('CAM-01');
  const [nightVision, setNightVision] = useState<boolean>(false);
  const [thermalMode, setThermalMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleToggleNightVision = () => {
    setNightVision(prev => {
      const next = !prev;
      if (next) setThermalMode(false);
      return next;
    });
  };

  const handleToggleThermalMode = () => {
    setThermalMode(prev => {
      const next = !prev;
      if (next) setNightVision(false);
      return next;
    });
  };

  const handleCycleZoom = () => {
    setZoomLevel(prev => (prev === 1 ? 1.5 : prev === 1.5 ? 2.0 : 1));
  };

  // Emergency & Simulation Scenario State
  const [activeScenario, setActiveScenario] = useState<DemoScenario>('NOMINAL');
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [criticalBanner, setCriticalBanner] = useState<{
    show: boolean;
    title: string;
    location: string;
    confidence?: number;
    details?: string;
  } | null>(null);

  // Subtle live sensor fluctuation timer for realism
  useEffect(() => {
    const interval = setInterval(() => {
      // Small jitter around current temperature & gas if not in overridden crisis
      if (activeScenario === 'NOMINAL') {
        setEnvData((prev) => {
          const jitterTemp = Number((38.2 + Math.random() * 0.5).toFixed(1));
          const jitterGas = Number((21.0 + Math.random() * 0.8).toFixed(1));
          const jitterHum = Number((48.0 + Math.random() * 0.6).toFixed(1));
          return {
            ...prev,
            temperature: jitterTemp,
            gas: jitterGas,
            humidity: jitterHum,
          };
        });

        // Electrical load subtle jitter
        setPowerMetrics((prev) => ({
          ...prev,
          voltage: Number((231.0 + Math.random() * 0.8).toFixed(1)),
          current: Number((4.75 + Math.random() * 0.15).toFixed(2)),
          power: Number((1.10 + Math.random() * 0.03).toFixed(2)),
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeScenario]);

  // Helper to log a new real-time event to stream
  const logEvent = (category: AlertEvent['category'], severity: AlertEvent['severity'], message: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newEvent: AlertEvent = {
      id: `evt-${Date.now()}`,
      timestamp: timeStr,
      category,
      severity,
      message,
      acknowledged: false,
    };
    setEventLogs((prev) => [newEvent, ...prev]);
  };

  // Scenario Switcher Logic
  const handleSelectScenario = (scenario: DemoScenario) => {
    setActiveScenario(scenario);

    if (scenario === 'NOMINAL') {
      setIsEmergencyActive(false);
      setCriticalBanner(null);
      setEnvData({ ...initialEnv });
      setSecurityData({ ...initialSec });
      setMcbDevices([...initialDevices]);
      logEvent('SYSTEM', 'SUCCESS', 'System returned to nominal operating status.');
    } else if (scenario === 'INTRUDER') {
      setIsEmergencyActive(true);
      setSecurityData((prev) => ({
        ...prev,
        theftProtectionArmed: true,
        intruderDetected: true,
        intruderLocation: 'SECTOR-02 PERIMETER (GATE 4)',
        personDetected: 2,
        personConfidence: 96,
      }));
      setCriticalBanner({
        show: true,
        title: 'SECURITY BREACH: INTRUDER DETECTED',
        location: 'SECTOR-02 PERIMETER (GATE 4)',
        confidence: 96,
        details: 'Theft protection radar triggered unauthorized boundary crossing',
      });
      logEvent('SECURITY', 'CRITICAL', '🚨 INTRUDER ALERT: Theft protection trip in Sector-02 Perimeter.');
    } else if (scenario === 'GAS_LEAK') {
      setIsEmergencyActive(true);
      setEnvData((prev) => ({
        ...prev,
        gas: 88.4,
        gasStatus: 'CRITICAL',
      }));
      // Auto-trip non-critical breakers if setting enabled
      if (settings.autoTripOnCriticalGas) {
        setMcbDevices((prev) =>
          prev.map((d) =>
            d.id === 'MCB-02' || d.id === 'MCB-04'
              ? { ...d, status: 'TRIPPED', switchState: false, tripReason: 'GAS HAZARD AUTO-INTERLOCK' }
              : d
          )
        );
      }
      setCriticalBanner({
        show: true,
        title: 'CRITICAL EVENT: HAZARDOUS GAS LEAK DETECTED',
        location: 'ELECTRICAL VAULT & SUBSTATION 04A',
        details: 'Gas concentration 88.4%. Interlock isolation triggered.',
      });
      logEvent('EMERGENCY', 'CRITICAL', '🚨 DANGER: Flammable gas threshold breached (88.4%). Automated MCB interlock trip.');
    } else if (scenario === 'FIRE_OUTBREAK') {
      setIsEmergencyActive(true);
      setEnvData((prev) => ({
        ...prev,
        temperature: 68.2,
        temperatureStatus: 'CRITICAL',
        fireStatus: 'EMERGENCY',
        fireOpticalReading: 94,
      }));
      // Auto-trip main feeder if fire outbreak
      if (settings.autoTripOnFire) {
        setMcbDevices((prev) =>
          prev.map((d) =>
            d.id === 'MCB-01'
              ? { ...d, status: 'TRIPPED', switchState: false, tripReason: 'FIRE FLAME TRIP' }
              : d
          )
        );
      }
      setCriticalBanner({
        show: true,
        title: 'CRITICAL EVENT: THERMAL FIRE DETECTED',
        location: 'MCB POWER VAULT & CHILLER BUS',
        confidence: 94,
        details: 'Thermal signature elevated to 68.2°C. Extinguisher armed.',
      });
      logEvent('EMERGENCY', 'CRITICAL', '🔥 FIRE OUTBREAK: Thermal level at 68.2°C. Main Feeder MCB-01 isolated.');
    } else if (scenario === 'FIREARM_DETECTED') {
      setIsEmergencyActive(true);
      setSecurityData((prev) => ({
        ...prev,
        personDetected: 1,
        firearmDetected: 1,
        firearmConfidence: 91,
      }));
      setCriticalBanner({
        show: true,
        title: 'CRITICAL EVENT: FIREARM DETECTED',
        location: 'CAM-01 MAIN ENTRANCE',
        confidence: 91,
        details: 'YOLOv8 CV weapon classification verified. Control room lockdown initiated.',
      });
      logEvent('SECURITY', 'CRITICAL', '🚨 WEAPON DETECTED: Firearm identified on CAM-01 (Confidence: 91%).');
    }
  };

  // Toggle MCB Breaker switch
  const handleToggleBreaker = (id: string) => {
    setMcbDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.switchState;
          const nextStatus = nextState ? 'ONLINE' : 'OFFLINE';
          logEvent('MCB', 'INFO', `Breaker ${d.id} (${d.name}) manually switched ${nextState ? 'CLOSED' : 'OPEN'}.`);
          return {
            ...d,
            switchState: nextState,
            status: nextStatus,
            currentLoad: nextState ? (d.maxCapacity * 0.45) : 0,
          };
        }
        return d;
      })
    );
  };

  // Toggle Theft Protection Arming
  const handleToggleTheftProtection = (armed: boolean) => {
    setSecurityData((prev) => ({
      ...prev,
      theftProtectionArmed: armed,
      intruderDetected: armed ? prev.intruderDetected : false,
    }));
    logEvent('SECURITY', armed ? 'SUCCESS' : 'WARNING', `Theft protection system ${armed ? 'ARMED' : 'DISARMED'}.`);
  };

  // Simulate Intruder Toggle from Theft panel
  const handleSimulateIntruder = () => {
    if (securityData.intruderDetected) {
      setSecurityData((prev) => ({ ...prev, intruderDetected: false }));
      if (activeScenario === 'INTRUDER') {
        setIsEmergencyActive(false);
        setCriticalBanner(null);
        setActiveScenario('NOMINAL');
      }
      logEvent('SECURITY', 'SUCCESS', 'Theft perimeter radar cleared. Sector safe.');
    } else {
      handleSelectScenario('INTRUDER');
    }
  };

  // Physical SOS Trigger
  const handleTriggerSos = () => {
    setIsEmergencyActive(true);
    setCriticalBanner({
      show: true,
      title: 'MANUAL SOS COMMAND TRIGGERED',
      location: 'CONTROL ROOM CONSOLE — OPERATOR OVERRIDE',
      details: 'Facility-wide emergency evacuation alarm activated. Local demo control.',
    });
    logEvent('EMERGENCY', 'CRITICAL', '🆘 OPERATOR SOS: Manual emergency override button pressed.');
  };

  // Successful Extinguisher Discharge
  const handleExtinguisherSuccess = () => {
    setExtinguisherDischarged(true);
    // Extinguish any fire and drop temperature
    setEnvData((prev) => ({
      ...prev,
      fireStatus: 'SAFE',
      fireOpticalReading: 0,
      temperature: 28.5,
      temperatureStatus: 'NORMAL',
    }));
    // Trip extinguisher MCB and Feeder
    setMcbDevices((prev) =>
      prev.map((d) =>
        d.id === 'MCB-06' || d.id === 'MCB-01'
          ? { ...d, switchState: false, status: 'TRIPPED', tripReason: 'EXTINGUISHER DISCHARGED' }
          : d
      )
    );
    // Add critical event
    logEvent('EMERGENCY', 'SUCCESS', '🧯 SUPPRESSION COMPLETE: Clean-agent nitrogen canisters discharged. Fire hazard quenched.');
    // Dismiss emergency banner if it was fire
    if (activeScenario === 'FIRE_OUTBREAK') {
      setTimeout(() => {
        setIsEmergencyActive(false);
        setCriticalBanner(null);
        setActiveScenario('NOMINAL');
      }, 3000);
    }
  };

  // Acknowledge alert event
  const handleAcknowledgeEvent = (id: string) => {
    setEventLogs((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, acknowledged: true } : evt))
    );
  };

  const handleClearAcknowledged = () => {
    setEventLogs((prev) => prev.filter((evt) => !evt.acknowledged));
  };

  // Count unread
  const unreadCount = eventLogs.filter((evt) => !evt.acknowledged).length;

  return (
    <div 
      id="smart-mcb-command-center-root"
      className={`min-h-screen flex flex-col bg-[#06090e] text-zinc-100 ${
        isEmergencyActive ? 'emergency-active' : ''
      }`}
    >
      {/* Top Command Bar */}
      <TopCommandBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        isEmergencyActive={isEmergencyActive}
        activeScenarioName={activeScenario}
        onResetEmergency={() => handleSelectScenario('NOMINAL')}
      />

      {/* Interactive Scenario Demonstration Bar */}
      <SimulationBar
        activeScenario={activeScenario}
        onSelectScenario={handleSelectScenario}
        onReset={() => handleSelectScenario('NOMINAL')}
      />

      {/* Critical Alert Override Banner (Visible when emergency is triggered) */}
      {criticalBanner?.show && (
        <CriticalAlertBanner
          title={criticalBanner.title}
          location={criticalBanner.location}
          confidence={criticalBanner.confidence}
          details={criticalBanner.details}
          onViewCamera={() => setActiveNav('security')}
          onDismiss={() => {
            setCriticalBanner(null);
            setIsEmergencyActive(false);
          }}
        />
      )}

      {/* Main Workspace Body with Left Navigation + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Narrow Technical Navigation */}
        <LeftNavigation
          activeSection={activeNav}
          onSelectSection={(section) => {
            if (section === 'settings') {
              setIsSettingsOpen(true);
            } else {
              setActiveNav(section);
            }
          }}
          unreadAlertCount={unreadCount}
          systemHealthPercent={99.8}
        />

        {/* Central Dynamic Content Area */}
        <main 
          id="command-workspace-content"
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-tech-grid"
        >
          
          {/* OVERVIEW / DEFAULT COMMAND CENTER COMPOSITION */}
          {activeNav === 'overview' && (
            <div className="space-y-4">
              
              {/* UPPER SECTION: Hero Security Camera (Pure Feed + Scan) + Environmental Core Side-by-Side on Desktop */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                
                {/* Left 7 Columns: Clean Camera Viewport with Live Scan (Zero Clutter, Zero Details) */}
                <div className="xl:col-span-7">
                  <CameraViewport
                    security={securityData}
                    currentTime={envData.lastUpdated}
                    isEmergencyActive={isEmergencyActive}
                    activeCam={activeCam}
                    nightVision={nightVision}
                    thermalMode={thermalMode}
                    zoomLevel={zoomLevel}
                  />
                </div>

                {/* Right 5 Columns: Environmental Core & Emergency Controls (SOS Only) */}
                <div className="xl:col-span-5 space-y-3">
                  <EnvironmentalCore environment={envData} />
                  
                  {/* Emergency Controls (Manual System SOS Only on Overview) */}
                  <EmergencyControlPanel
                    onTriggerSos={handleTriggerSos}
                    isEmergencyActive={isEmergencyActive}
                    showExtinguisher={false}
                    showSos={true}
                  />
                </div>

              </div>

            </div>
          )}

          {/* SECURITY FOCUSED VIEW - Comprehensive Security Command Center */}
          {activeNav === 'security' && (
            <div className="space-y-4">
              {/* Camera Feed Viewport */}
              <CameraViewport
                security={securityData}
                currentTime={envData.lastUpdated}
                isEmergencyActive={isEmergencyActive}
                activeCam={activeCam}
                nightVision={nightVision}
                thermalMode={thermalMode}
                zoomLevel={zoomLevel}
              />

              {/* Dedicated Camera Specifications, Optical Controls & Streaming Telemetry Section */}
              <CameraDetailsPanel
                security={securityData}
                activeCam={activeCam}
                onSelectCam={setActiveCam}
                nightVision={nightVision}
                onToggleNightVision={handleToggleNightVision}
                thermalMode={thermalMode}
                onToggleThermalMode={handleToggleThermalMode}
                zoomLevel={zoomLevel}
                onCycleZoom={handleCycleZoom}
              />

              {/* Detection HUD & Security Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 space-y-3">
                  <DetectionHud security={securityData} />
                  <TheftProtectionPanel
                    security={securityData}
                    onToggleTheftProtection={handleToggleTheftProtection}
                    onSimulateIntruderToggle={handleSimulateIntruder}
                  />
                </div>
                <div className="lg:col-span-6">
                  <AlertStream
                    events={eventLogs.filter(e => e.type === 'FIREARM' || e.type === 'INTRUSION' || e.type === 'SECURITY' || e.type === 'EMERGENCY')}
                    onAcknowledge={handleAcknowledgeEvent}
                    onClearAcknowledged={handleClearAcknowledged}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ENVIRONMENT FOCUSED VIEW */}
          {activeNav === 'environment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-7">
                  <EnvironmentalCore environment={envData} />
                </div>
                <div className="xl:col-span-5">
                  <EmergencyControlPanel
                    onTriggerSos={handleTriggerSos}
                    onOpenExtinguisherModal={() => setIsExtinguisherModalOpen(true)}
                    isEmergencyActive={isEmergencyActive}
                    extinguisherDischarged={extinguisherDischarged}
                    showExtinguisher={true}
                    showSos={false}
                  />
                </div>
              </div>

              <LiveSensorGraph 
                data={sensorHistory} 
                currentTemp={envData.temperature} 
                currentGas={envData.gas} 
              />
            </div>
          )}

          {/* ALERTS / EVENT STREAM FULL VIEW */}
          {activeNav === 'alerts' && (
            <div className="space-y-4">
              <AlertStream
                events={eventLogs}
                onAcknowledge={handleAcknowledgeEvent}
                onClearAcknowledged={handleClearAcknowledged}
              />
            </div>
          )}

          {/* DEVICES / MCB MATRIX FULL VIEW */}
          {activeNav === 'devices' && (
            <div className="space-y-4">
              <McbNetworkTopology
                devices={mcbDevices}
                onToggleBreaker={handleToggleBreaker}
              />
              <ElectricalMetrics metrics={powerMetrics} />
            </div>
          )}

          {/* POWER & ELECTRICAL SUB-METERING FULL VIEW */}
          {activeNav === 'power' && (
            <div className="space-y-4">
              <div className="bg-[#090d14] border border-zinc-800 p-3.5 rounded-xs font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-display-tech font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>ELECTRICAL POWER TELEMETRY & SUB-METERING</span>
                  </div>
                  <div className="text-zinc-400 mt-0.5 text-[11px]">
                    Real-time 3-phase load profiling, active/reactive power metrics, and harmonic power factor diagnostics.
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-xs text-cyan-300 font-bold">
                    MAIN FEEDER BUS 01
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-xs text-emerald-400 font-bold">
                    ONLINE • 50.0 Hz
                  </span>
                </div>
              </div>

              <ElectricalMetrics metrics={powerMetrics} />

              <McbNetworkTopology
                devices={mcbDevices}
                onToggleBreaker={handleToggleBreaker}
              />
            </div>
          )}

          {/* HISTORY AUDIT VIEW */}
          {activeNav === 'history' && (
            <div className="space-y-4">
              <div className="bg-[#080d14] border border-zinc-800 p-4 rounded-sm font-mono text-xs">
                <div className="text-sm font-display-tech font-bold text-white uppercase mb-2">
                  HISTORICAL TELEMETRY AUDIT LOG
                </div>
                <div className="text-zinc-400 mb-4">
                  Substation 04A non-volatile sensor telemetry archived over 24-hour cycle.
                </div>
                <LiveSensorGraph 
                  data={sensorHistory} 
                  currentTemp={envData.temperature} 
                  currentGas={envData.gas} 
                />
              </div>

              <AlertStream
                events={eventLogs}
                onAcknowledge={handleAcknowledgeEvent}
                onClearAcknowledged={handleClearAcknowledged}
              />
            </div>
          )}

        </main>
      </div>

      {/* Bottom Industrial System Health Strip */}
      <SystemHealthStrip items={healthItems} />

      {/* Extinguisher PIN Authorization Modal */}
      <ExtinguisherModal
        isOpen={isExtinguisherModalOpen}
        onClose={() => setIsExtinguisherModalOpen(false)}
        onSuccessDischarge={handleExtinguisherSuccess}
        correctPin={settings.extinguisherPin}
      />

      {/* Settings Calibration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(updated) => {
          setSettings(updated);
          logEvent('SYSTEM', 'SUCCESS', 'Facility calibration parameters updated.');
        }}
      />

    </div>
  );
};
