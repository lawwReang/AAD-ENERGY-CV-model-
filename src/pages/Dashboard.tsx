import React, { useEffect, useState } from "react";
import {
  EnvironmentData,
  SecurityStatus,
  McbDevice,
  AlertEvent,
  SystemHealthItem,
  ElectricalReading,
  FacilitySettings,
} from "../types";

import {
  environment as initialEnv,
  security as initialSec,
  devices as initialDevices,
  alerts as initialAlerts,
  systemHealth as initialHealth,
  electricalMetrics as initialElec,
  defaultSettings,
} from "../data/mockData";

import {
  fetchEnvironmentTelemetry,
  fetchEmergencyStatus,
  clearEmergency,
  fetchSecurityTelemetry,
  triggerManualSOS,
} from "../services/api";

// Components
import { TopCommandBar } from "../components/command/TopCommandBar";
import {
  LeftNavigation,
  NavSection,
} from "../components/command/LeftNavigation";
import { SystemHealthStrip } from "../components/command/SystemHealthStrip";

import { CameraViewport } from "../components/security/CameraViewport";
import { CameraDetailsPanel } from "../components/security/CameraDetailsPanel";
import { DetectionHud } from "../components/security/DetectionHud";
import { TheftProtectionPanel } from "../components/security/TheftProtectionPanel";

import { EnvironmentalCore } from "../components/environment/EnvironmentalCore";
import { LiveSensorGraph } from "../components/environment/LiveSensorGraph";

import { McbNetworkTopology } from "../components/devices/McbNetworkTopology";
import { ElectricalMetrics } from "../components/devices/ElectricalMetrics";

import { AlertStream } from "../components/alerts/AlertStream";

import { EmergencyControlPanel } from "../components/emergency/EmergencyControlPanel";
import { ExtinguisherModal } from "../components/emergency/ExtinguisherModal";
import { CriticalAlertBanner } from "../components/emergency/CriticalAlertBanner";

import { SettingsModal } from "../components/settings/SettingsModal";

export const Dashboard: React.FC = () => {
  // ---------------------------------------------------------------------------
  // DATA STATE
  // ---------------------------------------------------------------------------

  const [envData, setEnvData] = useState<EnvironmentData>({
    ...initialEnv,
  });

  const [securityData, setSecurityData] = useState<SecurityStatus>({
    ...initialSec,
  });

  const [mcbDevices] = useState<McbDevice[]>([...initialDevices]);

  const [eventLogs, setEventLogs] = useState<AlertEvent[]>([...initialAlerts]);

  const [healthItems] = useState<SystemHealthItem[]>([...initialHealth]);

  const [powerMetrics] = useState<ElectricalReading>({
    ...initialElec,
  });

  const [settings, setSettings] = useState<FacilitySettings>({
    ...defaultSettings,
  });

  // Real sensor history will be populated once backend history storage exists.
  const [sensorHistory] = useState<
    Array<{
      time: string;
      temp: number;
      humidity: number;
      gas: number;
    }>
  >([]);

  // ---------------------------------------------------------------------------
  // SENSOR CONNECTION STATE
  // ---------------------------------------------------------------------------

  const [sensorConnected, setSensorConnected] = useState(false);
  const [sensorLoading, setSensorLoading] = useState(true);
  const [sensorError, setSensorError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // BACKEND SOS STATE
  // ---------------------------------------------------------------------------

  const [sosActive, setSosActive] = useState(false);

  const [sosDetails, setSosDetails] = useState<{
    type: "AUTOMATIC" | "MANUAL";
    reason: string;
    device_id: string;
    sensor: string;
    value: number;
    triggered_at: string;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // UI STATE
  // ---------------------------------------------------------------------------

  const [activeNav, setActiveNav] = useState<NavSection>("overview");

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isExtinguisherModalOpen, setIsExtinguisherModalOpen] = useState(false);

  const [extinguisherDischarged, setExtinguisherDischarged] = useState(false);

  // ---------------------------------------------------------------------------
  // CAMERA STATE
  // ---------------------------------------------------------------------------

  const [activeCam, setActiveCam] = useState("CAM-01");

  const [nightVision, setNightVision] = useState(false);

  const [thermalMode, setThermalMode] = useState(false);

  const [zoomLevel, setZoomLevel] = useState(1);

  // ---------------------------------------------------------------------------
  // EMERGENCY UI STATE
  // ---------------------------------------------------------------------------

  const [isEmergencyActive, setIsEmergencyActive] = useState(false);

  const [criticalBanner, setCriticalBanner] = useState<{
    show: boolean;
    title: string;
    location: string;
    confidence?: number;
    details?: string;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // LIVE SENSOR + EMERGENCY POLLING
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    // -------------------------------------------------------------------------
    // ENVIRONMENT TELEMETRY
    // -------------------------------------------------------------------------

    const loadEnvironmentTelemetry = async () => {
      try {
        const telemetry = await fetchEnvironmentTelemetry();

        if (!isMounted) {
          return;
        }

        setEnvData(telemetry);
        setSensorConnected(true);
        setSensorError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSensorConnected(false);

        setSensorError(
          error instanceof Error
            ? error.message
            : "Unable to connect to sensor backend.",
        );
      } finally {
        if (isMounted) {
          setSensorLoading(false);
        }
      }
    };
    const loadSecurityTelemetry = async () => {
      try {
        const telemetry = await fetchSecurityTelemetry();

        if (!isMounted) {
          return;
        }

        setSecurityData(telemetry);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch security telemetry:", error);
      }
    };

    // -------------------------------------------------------------------------
    // EMERGENCY / SOS STATUS
    // -------------------------------------------------------------------------

    const loadEmergencyStatus = async () => {
      try {
        const emergency = await fetchEmergencyStatus();

        if (!isMounted) {
          return;
        }

        setSosActive(emergency.active);
        setSosDetails(emergency.details);

        // IMPORTANT:
        // The backend is the source of truth for emergency state.
        //
        // When FastAPI says SOS is active, synchronize the
        // UI emergency state as well.
        setIsEmergencyActive(emergency.active);

        // ---------------------------------------------------------------
        // AUTOMATIC SOS BANNER
        // ---------------------------------------------------------------

        if (emergency.active && emergency.details) {
          setCriticalBanner({
            show: true,

            title:
              emergency.details.type === "AUTOMATIC"
                ? "AUTOMATIC SOS TRIGGERED"
                : "MANUAL SOS ACTIVE",

            location: `DEVICE ${emergency.details.device_id}`,

            details: emergency.details.reason,
          });
        }

        // ---------------------------------------------------------------
        // CLEAR BANNER WHEN EMERGENCY IS INACTIVE
        // ---------------------------------------------------------------

        if (!emergency.active) {
          setCriticalBanner(null);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to fetch emergency status:", error);
      }
    };

    // -------------------------------------------------------------------------
    // INITIAL FETCH
    // -------------------------------------------------------------------------

    loadEnvironmentTelemetry();
    loadEmergencyStatus();
    loadSecurityTelemetry();

    // -------------------------------------------------------------------------
    // POLL EVERY 2 SECONDS
    // -------------------------------------------------------------------------

    const intervalId = window.setInterval(() => {
      loadEnvironmentTelemetry();
      loadEmergencyStatus();
      loadSecurityTelemetry();
    }, 2000);

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // CAMERA CONTROLS
  // ---------------------------------------------------------------------------

  const handleToggleNightVision = () => {
    setNightVision((previous) => {
      const next = !previous;

      if (next) {
        setThermalMode(false);
      }

      return next;
    });
  };

  const handleToggleThermalMode = () => {
    setThermalMode((previous) => {
      const next = !previous;

      if (next) {
        setNightVision(false);
      }

      return next;
    });
  };

  const handleCycleZoom = () => {
    setZoomLevel((previous) => {
      if (previous === 1) return 1.5;
      if (previous === 1.5) return 2.0;
      return 1;
    });
  };

  // ---------------------------------------------------------------------------
  // EVENT LOGGING
  // ---------------------------------------------------------------------------

  const logEvent = (
    category: AlertEvent["category"],
    severity: AlertEvent["severity"],
    message: string,
  ) => {
    const now = new Date();

    const timeStr =
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}:` +
      `${String(now.getSeconds()).padStart(2, "0")}`;

    const newEvent: AlertEvent = {
      id: `evt-${Date.now()}`,
      timestamp: timeStr,
      category,
      severity,
      message,
      acknowledged: false,
    };

    setEventLogs((previous) => [newEvent, ...previous]);
  };

  // ---------------------------------------------------------------------------
  // MCB BREAKER CONTROL
  // ---------------------------------------------------------------------------

  const handleToggleBreaker = (id: string) => {
    console.log(`[MCB CONTROL] Breaker control requested: ${id}`);

    logEvent(
      "MCB",
      "INFO",
      `Breaker control request received for ${id}. Hardware controller is not connected.`,
    );
  };

  // ---------------------------------------------------------------------------
  // THEFT PROTECTION
  // ---------------------------------------------------------------------------

  const handleToggleTheftProtection = (armed: boolean) => {
    setSecurityData((previous) => ({
      ...previous,
      theftProtectionArmed: armed,
      intruderDetected: armed ? previous.intruderDetected : false,
    }));

    logEvent(
      "SECURITY",
      armed ? "SUCCESS" : "WARNING",
      `Theft protection system ${armed ? "ARMED" : "DISARMED"}.`,
    );
  };

  // ---------------------------------------------------------------------------
  // MANUAL SOS
  // ---------------------------------------------------------------------------

  const handleTriggerSos = async () => {
    try {
      const emergency = await triggerManualSOS();

      setSosActive(emergency.active);
      setSosDetails(emergency.details);
      setIsEmergencyActive(emergency.active);

      if (emergency.active) {
        setCriticalBanner({
          show: true,
          title: "MANUAL SOS COMMAND TRIGGERED",
          location: "CONTROL ROOM CONSOLE — OPERATOR OVERRIDE",
          details:
            emergency.details?.reason || "Manual emergency override requested.",
        });
      }

      logEvent(
        "EMERGENCY",
        "CRITICAL",
        "OPERATOR SOS: Manual emergency override button pressed.",
      );
    } catch (error) {
      console.error("Failed to trigger manual SOS:", error);

      logEvent("EMERGENCY", "WARNING", "OPERATOR SOS request failed.");
    }
  };

  // ---------------------------------------------------------------------------
  // EMERGENCY RESET
  // ---------------------------------------------------------------------------

  const handleResetEmergency = async () => {
    try {
      await clearEmergency();

      setSosActive(false);
      setSosDetails(null);
      setIsEmergencyActive(false);
      setCriticalBanner(null);

      logEvent("EMERGENCY", "SUCCESS", "Emergency state cleared by operator.");
    } catch (error) {
      console.error("Failed to clear emergency:", error);

      logEvent("EMERGENCY", "WARNING", "Emergency reset request failed.");
    }
  };

  // ---------------------------------------------------------------------------
  // EXTINGUISHER
  // ---------------------------------------------------------------------------

  const handleExtinguisherSuccess = () => {
    setExtinguisherDischarged(true);

    logEvent(
      "EMERGENCY",
      "SUCCESS",
      "Suppression actuation request authorized. Hardware actuator is awaiting integration.",
    );

    setIsEmergencyActive(false);
    setCriticalBanner(null);
  };

  // ---------------------------------------------------------------------------
  // ALERT CONTROLS
  // ---------------------------------------------------------------------------

  const handleAcknowledgeEvent = (id: string) => {
    setEventLogs((previous) =>
      previous.map((event) =>
        event.id === id
          ? {
              ...event,
              acknowledged: true,
            }
          : event,
      ),
    );
  };

  const handleClearAcknowledged = () => {
    setEventLogs((previous) => previous.filter((event) => !event.acknowledged));
  };

  const unreadCount = eventLogs.filter((event) => !event.acknowledged).length;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div
      id="smart-mcb-command-center-root"
      className={`min-h-screen flex flex-col bg-[#06090e] text-zinc-100 ${
        isEmergencyActive ? "emergency-active" : ""
      }`}
    >
      {/* ------------------------------------------------------------------- */}
      {/* TOP COMMAND BAR                                                     */}
      {/* ------------------------------------------------------------------- */}

      <TopCommandBar
        onOpenSettings={() => setIsSettingsOpen(true)}
        isEmergencyActive={isEmergencyActive}
        activeScenarioName="LIVE"
        onResetEmergency={handleResetEmergency}
      />

      {/* ------------------------------------------------------------------- */}
      {/* SENSOR CONNECTION STATUS                                            */}
      {/* ------------------------------------------------------------------- */}

      {sensorError && (
        <div className="mx-3 mt-3 sm:mx-4">
          <div className="border border-amber-900/60 bg-amber-950/20 px-3 py-2 rounded-xs font-mono text-[10px] text-amber-400 uppercase tracking-wider">
            SENSOR TELEMETRY OFFLINE — FASTAPI/MQTT DATA UNAVAILABLE
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* CRITICAL ALERT BANNER                                                */}
      {/* ------------------------------------------------------------------- */}

      {criticalBanner?.show && (
        <CriticalAlertBanner
          title={criticalBanner.title}
          location={criticalBanner.location}
          confidence={criticalBanner.confidence}
          details={criticalBanner.details}
          onViewCamera={() => setActiveNav("security")}
          onDismiss={() => {
            // Dismissing the visual banner does NOT
            // clear the backend SOS state.
            //
            // The emergency remains active until
            // the operator resets it.
            setCriticalBanner(null);
          }}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* MAIN WORKSPACE                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT NAVIGATION */}

        <LeftNavigation
          activeSection={activeNav}
          onSelectSection={(section) => {
            if (section === "settings") {
              setIsSettingsOpen(true);
            } else {
              setActiveNav(section);
            }
          }}
          unreadAlertCount={unreadCount}
          systemHealthPercent={sensorConnected ? 100 : 0}
        />

        {/* CONTENT */}

        <main
          id="command-workspace-content"
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-tech-grid"
        >
          {/* =============================================================== */}
          {/* OVERVIEW                                                         */}
          {/* =============================================================== */}

          {activeNav === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
                {/* CAMERA */}

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

                {/* ENVIRONMENT + SOS */}

                <div className="xl:col-span-5 space-y-3">
                  <EnvironmentalCore
                    environment={envData}
                    settings={settings}
                  />

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

          {/* =============================================================== */}
          {/* SECURITY                                                         */}
          {/* =============================================================== */}

          {activeNav === "security" && (
            <div className="space-y-4">
              <CameraViewport
                security={securityData}
                currentTime={envData.lastUpdated}
                isEmergencyActive={isEmergencyActive}
                activeCam={activeCam}
                nightVision={nightVision}
                thermalMode={thermalMode}
                zoomLevel={zoomLevel}
              />

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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 space-y-3">
                  <DetectionHud security={securityData} />

                  <TheftProtectionPanel
                    security={securityData}
                    onToggleTheftProtection={handleToggleTheftProtection}
                  />
                </div>

                <div className="lg:col-span-6">
                  <AlertStream
                    events={eventLogs.filter(
                      (event) =>
                        event.category === "SECURITY" ||
                        event.category === "EMERGENCY",
                    )}
                    onAcknowledge={handleAcknowledgeEvent}
                    onClearAcknowledged={handleClearAcknowledged}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* ENVIRONMENT                                                      */}
          {/* =============================================================== */}

          {activeNav === "environment" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                <div className="xl:col-span-7">
                  <EnvironmentalCore
                    environment={envData}
                    settings={settings}
                  />
                </div>

                <div className="xl:col-span-5">
                  <EmergencyControlPanel
                    onTriggerSos={handleTriggerSos}
                    onOpenExtinguisherModal={() =>
                      setIsExtinguisherModalOpen(true)
                    }
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
                gasUnit={envData.gasUnit}
              />
            </div>
          )}

          {/* =============================================================== */}
          {/* ALERTS                                                           */}
          {/* =============================================================== */}

          {activeNav === "alerts" && (
            <div className="space-y-4">
              <AlertStream
                events={eventLogs}
                onAcknowledge={handleAcknowledgeEvent}
                onClearAcknowledged={handleClearAcknowledged}
              />
            </div>
          )}

          {/* =============================================================== */}
          {/* DEVICES                                                          */}
          {/* =============================================================== */}

          {activeNav === "devices" && (
            <div className="space-y-4">
              <McbNetworkTopology
                devices={mcbDevices}
                onToggleBreaker={handleToggleBreaker}
              />

              <ElectricalMetrics metrics={powerMetrics} />
            </div>
          )}

          {/* =============================================================== */}
          {/* POWER                                                            */}
          {/* =============================================================== */}

          {activeNav === "power" && (
            <div className="space-y-4">
              <div className="bg-[#090d14] border border-zinc-800 p-3.5 rounded-xs font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-display-tech font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

                    <span>ELECTRICAL POWER TELEMETRY & SUB-METERING</span>
                  </div>

                  <div className="text-zinc-400 mt-0.5 text-[11px]">
                    Electrical telemetry interface. Awaiting live hardware data.
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-xs text-cyan-300 font-bold">
                    MAIN FEEDER BUS 01
                  </span>

                  <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-xs text-zinc-400 font-bold">
                    TELEMETRY STANDBY
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

          {/* =============================================================== */}
          {/* HISTORY                                                          */}
          {/* =============================================================== */}

          {activeNav === "history" && (
            <div className="space-y-4">
              <div className="bg-[#080d14] border border-zinc-800 p-4 rounded-sm font-mono text-xs">
                <div className="text-sm font-display-tech font-bold text-white uppercase mb-2">
                  HISTORICAL TELEMETRY AUDIT LOG
                </div>

                <div className="text-zinc-400 mb-4">
                  Historical sensor telemetry interface. Awaiting persistent
                  backend storage.
                </div>

                <LiveSensorGraph
                  data={sensorHistory}
                  currentTemp={envData.temperature}
                  currentGas={envData.gas}
                  gasUnit={envData.gasUnit}
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

      {/* ------------------------------------------------------------------- */}
      {/* SYSTEM HEALTH                                                       */}
      {/* ------------------------------------------------------------------- */}

      <SystemHealthStrip items={healthItems} />

      {/* ------------------------------------------------------------------- */}
      {/* EXTINGUISHER MODAL                                                  */}
      {/* ------------------------------------------------------------------- */}

      <ExtinguisherModal
        isOpen={isExtinguisherModalOpen}
        onClose={() => setIsExtinguisherModalOpen(false)}
        onSuccessDischarge={handleExtinguisherSuccess}
        correctPin={settings.extinguisherPin}
      />

      {/* ------------------------------------------------------------------- */}
      {/* SETTINGS                                                            */}
      {/* ------------------------------------------------------------------- */}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(updated) => {
          setSettings(updated);

          logEvent(
            "SYSTEM",
            "SUCCESS",
            "Facility calibration parameters updated.",
          );
        }}
      />
    </div>
  );
};
