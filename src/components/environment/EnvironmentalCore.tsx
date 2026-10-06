import React from "react";
import { EnvironmentData, FacilitySettings } from "../../types";
import { Thermometer, Wind, Droplets, Activity } from "lucide-react";

interface EnvironmentalCoreProps {
  environment: EnvironmentData;
  settings?: FacilitySettings;
}

export const EnvironmentalCore: React.FC<EnvironmentalCoreProps> = ({
  environment,
  settings,
}) => {
  /*
   * --------------------------------------------------------------------------
   * SENSOR DATA
   * --------------------------------------------------------------------------
   *
   * These values will eventually come directly from:
   *
   * ESP32 → MQTT → FastAPI → React
   *
   * The component does NOT generate or modify sensor readings.
   */

  const hasTemperatureData = environment.lastUpdated !== "--:--:--";

  const hasGasData = environment.lastUpdated !== "--:--:--";

  const hasHumidityData = environment.lastUpdated !== "--:--:--";

  /*
   * --------------------------------------------------------------------------
   * STATUS
   * --------------------------------------------------------------------------
   *
   * Status values are expected to be determined by the backend.
   */

  const isTempCritical = environment.temperatureStatus === "CRITICAL";

  const isTempWarning = environment.temperatureStatus === "WARNING";

  const isGasCritical = environment.gasStatus === "CRITICAL";

  const isGasWarning = environment.gasStatus === "WARNING";

  /*
   * --------------------------------------------------------------------------
   * THRESHOLDS
   * --------------------------------------------------------------------------
   *
   * These defaults mirror FacilitySettings.
   *
   * The backend will eventually be the authoritative source for threshold
   * evaluation. The frontend uses these values only for visualization.
   */

  const tempWarningThreshold = settings?.tempWarningThreshold ?? 45;

  const tempCriticalThreshold = settings?.tempCriticalThreshold ?? 60;

  const gasWarningThreshold = settings?.gasWarningThreshold ?? 40;

  const gasCriticalThreshold = settings?.gasCriticalThreshold ?? 70;

  /*
   * --------------------------------------------------------------------------
   * VISUALIZATION RANGES
   * --------------------------------------------------------------------------
   */

  const tempPercent = Math.min(
    100,
    Math.max(0, (environment.temperature / 80) * 100),
  );

  const gasPercent = Math.min(100, Math.max(0, environment.gas));

  /*
   * --------------------------------------------------------------------------
   * OVERALL STATUS
   * --------------------------------------------------------------------------
   */

  const hasCriticalHazard = isTempCritical || isGasCritical;

  const hasWarning = isTempWarning || isGasWarning;

  const hasAnySensorData = hasTemperatureData || hasGasData || hasHumidityData;

  const overallStatus = !hasAnySensorData
    ? "WAITING FOR SENSOR DATA"
    : hasCriticalHazard
      ? "HAZARD ELEVATED"
      : hasWarning
        ? "WARNING"
        : "NOMINAL ATMOSPHERE";

  return (
    <div
      id="environmental-core-module"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3.5 font-mono select-none"
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 rounded-xs">
            <Activity className="w-3.5 h-3.5" />
          </div>

          <div>
            <div className="font-display-tech font-bold text-sm tracking-wider text-white uppercase">
              ENVIRONMENTAL CORE
            </div>

            <div className="text-[9px] text-zinc-500 tracking-wider">
              REAL-TIME HAZARD & ATMOSPHERE TELEMETRY
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] text-zinc-400">STATUS:</span>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
              hasCriticalHazard
                ? "bg-red-950 text-red-400 border border-red-500 animate-pulse"
                : hasWarning
                  ? "bg-amber-950/40 text-amber-400 border border-amber-500/40"
                  : !hasAnySensorData
                    ? "bg-zinc-900 text-zinc-400 border border-zinc-700"
                    : "bg-emerald-950/40 text-emerald-400 border border-emerald-500/40"
            }`}
          >
            {overallStatus}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* PRIMARY READINGS                                                   */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-4">
        {/* ================================================================ */}
        {/* TEMPERATURE                                                       */}
        {/* ================================================================ */}

        <div
          className={`relative overflow-hidden p-4 border rounded-xs transition-all ${
            isTempCritical
              ? "bg-red-950/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              : isTempWarning
                ? "bg-amber-950/20 border-amber-500/60"
                : "bg-[#05080d] border-zinc-800/90"
          }`}
        >
          {/* Radial Visualizer */}

          <div className="absolute right-2 top-2 pointer-events-none opacity-20">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="48"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-zinc-800"
              />

              <circle
                cx="64"
                cy="64"
                r="48"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - tempPercent / 100)}
                className={
                  isTempCritical
                    ? "text-red-500"
                    : isTempWarning
                      ? "text-amber-400"
                      : "text-cyan-400"
                }
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold tracking-widest uppercase">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              TEMPERATURE
            </div>

            <div className="mt-1 flex items-baseline justify-center font-display-tech font-bold tracking-tighter">
              <span
                className={`text-5xl sm:text-6xl ${
                  isTempCritical
                    ? "text-red-400 animate-pulse"
                    : isTempWarning
                      ? "text-amber-400"
                      : hasTemperatureData
                        ? "text-white"
                        : "text-zinc-600"
                }`}
              >
                {hasTemperatureData ? environment.temperature.toFixed(1) : "--"}
              </span>

              <span className="ml-1.5 text-xl font-mono text-zinc-400">
                {environment.temperatureUnit}
              </span>
            </div>

            <div className="mt-1">
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs border ${
                  isTempCritical
                    ? "bg-red-600 text-white border-red-400"
                    : isTempWarning
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : hasTemperatureData
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-zinc-900 text-zinc-500 border-zinc-700"
                }`}
              >
                {hasTemperatureData ? environment.temperatureStatus : "WAITING"}
              </span>
            </div>
          </div>

          {/* Temperature Threshold */}

          <div className="mt-3 pt-2.5 border-t border-zinc-800">
            <div className="flex justify-between text-[9px] text-zinc-400 uppercase tracking-wider mb-1 font-mono">
              <span className="text-emerald-400 font-semibold">
                SAFE (&lt;{tempWarningThreshold}°C)
              </span>

              <span className="text-amber-400 font-semibold">
                WARN ({tempWarningThreshold}-{tempCriticalThreshold}°C)
              </span>

              <span className="text-red-400 font-semibold">
                CRITICAL (&gt;{tempCriticalThreshold}°C)
              </span>
            </div>

            <div className="relative h-2 bg-zinc-900 border border-zinc-800 rounded-xs overflow-hidden">
              <div className="absolute inset-0 flex">
                <div
                  className="bg-emerald-500/30 border-r border-emerald-500/50"
                  style={{
                    width: `${(tempWarningThreshold / 80) * 100}%`,
                  }}
                />

                <div
                  className="bg-amber-500/30 border-r border-amber-500/50"
                  style={{
                    width: `${
                      ((tempCriticalThreshold - tempWarningThreshold) / 80) *
                      100
                    }%`,
                  }}
                />

                <div className="flex-1 bg-red-500/40" />
              </div>

              {hasTemperatureData && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_#fff] transition-all duration-300"
                  style={{
                    left: `${tempPercent}%`,
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* GAS                                                               */}
        {/* ================================================================ */}

        <div
          className={`relative overflow-hidden p-4 border rounded-xs transition-all ${
            isGasCritical
              ? "bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              : isGasWarning
                ? "bg-amber-950/20 border-amber-500/60"
                : "bg-[#05080d] border-zinc-800/90"
          }`}
        >
          <div className="absolute right-2 top-2 pointer-events-none opacity-20">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="48"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-zinc-800"
              />

              <circle
                cx="64"
                cy="64"
                r="48"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - gasPercent / 100)}
                className={
                  isGasCritical
                    ? "text-red-500"
                    : isGasWarning
                      ? "text-amber-400"
                      : "text-cyan-400"
                }
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold tracking-widest uppercase">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              GAS LEVEL
            </div>

            <div className="mt-1 flex items-baseline justify-center font-display-tech font-bold tracking-tighter">
              <span
                className={`text-5xl sm:text-6xl ${
                  isGasCritical
                    ? "text-red-400 animate-pulse"
                    : isGasWarning
                      ? "text-amber-400"
                      : hasGasData
                        ? "text-white"
                        : "text-zinc-600"
                }`}
              >
                {hasGasData ? environment.gas.toFixed(1) : "--"}
              </span>

              <span className="ml-1.5 text-xl font-mono text-zinc-400">
                {environment.gasUnit}
              </span>
            </div>

            <div className="mt-1">
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs border ${
                  isGasCritical
                    ? "bg-red-600 text-white border-red-400 animate-pulse"
                    : isGasWarning
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                      : hasGasData
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-zinc-900 text-zinc-500 border-zinc-700"
                }`}
              >
                {isGasCritical
                  ? "EMERGENCY: GAS LEAK"
                  : isGasWarning
                    ? "WARNING"
                    : hasGasData
                      ? "SAFE"
                      : "WAITING"}
              </span>
            </div>
          </div>

          {/* Gas Threshold */}

          <div className="mt-3 pt-2.5 border-t border-zinc-800">
            <div className="flex justify-between text-[9px] text-zinc-400 uppercase tracking-wider mb-1 font-mono">
              <span className="text-emerald-400 font-semibold">
                SAFE (&lt;{gasWarningThreshold})
              </span>

              <span className="text-amber-400 font-semibold">
                WARN ({gasWarningThreshold}-{gasCriticalThreshold})
              </span>

              <span className="text-red-400 font-semibold">
                CRITICAL (&gt;{gasCriticalThreshold})
              </span>
            </div>

            <div className="relative h-2 bg-zinc-900 border border-zinc-800 rounded-xs overflow-hidden">
              <div className="absolute inset-0 flex">
                <div
                  className="bg-emerald-500/30 border-r border-emerald-500/50"
                  style={{
                    width: `${gasWarningThreshold}%`,
                  }}
                />

                <div
                  className="bg-amber-500/30 border-r border-amber-500/50"
                  style={{
                    width: `${gasCriticalThreshold - gasWarningThreshold}%`,
                  }}
                />

                <div className="flex-1 bg-red-500/40" />
              </div>

              {hasGasData && (
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_#fff] transition-all duration-300"
                  style={{
                    left: `${gasPercent}%`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECONDARY SENSORS                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
        {/* HUMIDITY */}

        <div className="p-2.5 bg-[#05080d] border border-zinc-800/80 rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-950/40 text-blue-400 border border-blue-500/30 rounded-xs">
              <Droplets className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                HUMIDITY
              </div>

              <div
                className={`text-lg font-display-tech font-bold ${
                  hasHumidityData ? "text-zinc-100" : "text-zinc-600"
                }`}
              >
                {hasHumidityData ? environment.humidity.toFixed(1) : "--"}

                <span className="text-xs text-zinc-400 ml-1">
                  {environment.humidityUnit}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded-xs uppercase">
              {hasHumidityData ? environment.humidityStatus : "WAITING"}
            </span>

            <div className="text-[8px] text-zinc-500 mt-1">LIVE SENSOR</div>
          </div>
        </div>

        {/* SENSOR CONNECTION STATUS */}

        <div className="p-2.5 bg-[#05080d] border border-zinc-800/80 rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 rounded-xs">
              <Activity className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                SENSOR LINK
              </div>

              <div className="text-lg font-display-tech font-bold text-zinc-100">
                {hasAnySensorData ? "CONNECTED" : "STANDBY"}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider ${
                hasAnySensorData
                  ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-900 text-zinc-500 border border-zinc-700"
              }`}
            >
              {hasAnySensorData ? "ONLINE" : "WAITING"}
            </span>

            <div className="text-[8px] text-zinc-500 mt-1">MQTT TELEMETRY</div>
          </div>
        </div>
      </div>
    </div>
  );
};
