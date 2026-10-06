import React from "react";
import { McbDevice } from "../../types";
import { Cpu, Power } from "lucide-react";

interface McbNetworkTopologyProps {
  devices: McbDevice[];
  onToggleBreaker: (id: string) => void;
  onTripBreaker?: (id: string) => void;
}

export const McbNetworkTopology: React.FC<McbNetworkTopologyProps> = ({
  devices,
  onToggleBreaker,
}) => {
  const onlineDevices = devices.filter((device) => device.status === "ONLINE");

  const trippedDevices = devices.filter(
    (device) => device.status === "TRIPPED",
  );

  const offlineDevices = devices.filter(
    (device) => device.status === "OFFLINE",
  );

  const hasLoadTelemetry = onlineDevices.some(
    (device) => Number.isFinite(device.currentLoad) && device.currentLoad > 0,
  );

  const totalCurrentLoad = onlineDevices.reduce(
    (total, device) =>
      total + (Number.isFinite(device.currentLoad) ? device.currentLoad : 0),
    0,
  );

  return (
    <div
      id="mcb-network-topology"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3.5 font-mono select-none"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 rounded-xs">
            <Cpu className="w-3.5 h-3.5" />
          </div>

          <div>
            <div className="font-display-tech font-bold text-sm tracking-wider text-white uppercase">
              SMART MCB TOPOLOGY & SWITCH MATRIX
            </div>

            <div className="text-[9px] text-zinc-500 tracking-wider">
              BREAKER DEVICE STATUS & CONTROL
            </div>
          </div>
        </div>

        {/* Device counts */}
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ONLINE ({onlineDevices.length})
          </span>

          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            OFFLINE ({offlineDevices.length})
          </span>

          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            TRIPPED ({trippedDevices.length})
          </span>
        </div>
      </div>

      {/* Distribution status */}
      <div className="flex flex-wrap items-center gap-3 mb-3 bg-[#05080c] border border-zinc-800/80 px-3 py-2 rounded-xs">
        <div className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[10px] tracking-wider rounded-xs uppercase">
          MAIN DISTRIBUTION PANEL
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400">
          <span>
            TOTAL LOAD:{" "}
            <span
              className={
                hasLoadTelemetry
                  ? "text-white font-bold"
                  : "text-zinc-600 font-bold"
              }
            >
              {hasLoadTelemetry ? `${totalCurrentLoad.toFixed(1)} A` : "--"}
            </span>
          </span>

          <span className="text-zinc-700">|</span>

          <span>
            TELEMETRY:{" "}
            <span
              className={
                hasLoadTelemetry
                  ? "text-emerald-400 font-bold"
                  : "text-amber-400 font-bold"
              }
            >
              {hasLoadTelemetry ? "AVAILABLE" : "WAITING FOR IOT"}
            </span>
          </span>
        </div>
      </div>

      {/* No devices */}
      {devices.length === 0 ? (
        <div className="border border-zinc-800 bg-[#05080c] rounded-xs py-10 text-center">
          <Cpu className="w-6 h-6 text-zinc-700 mx-auto mb-2" />

          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            NO MCB DEVICES CONFIGURED
          </div>

          <div className="text-[9px] text-zinc-600 mt-1 uppercase tracking-wider">
            WAITING FOR DEVICE TELEMETRY
          </div>
        </div>
      ) : (
        /* Device cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
          {devices.map((device, index) => {
            const isOnline = device.status === "ONLINE";
            const isTripped = device.status === "TRIPPED";

            const hasCurrent =
              isOnline &&
              Number.isFinite(device.currentLoad) &&
              device.currentLoad > 0;

            const hasTemperature =
              isOnline &&
              Number.isFinite(device.temperature) &&
              device.temperature > 0;

            const hasCapacity =
              Number.isFinite(device.maxCapacity) && device.maxCapacity > 0;

            const loadPercent =
              hasCurrent && hasCapacity
                ? Math.min(
                    100,
                    Math.round((device.currentLoad / device.maxCapacity) * 100),
                  )
                : 0;

            return (
              <div
                key={device.id}
                id={`mcb-device-card-${device.id.toLowerCase()}`}
                className={`relative p-3 border rounded-xs transition-all flex flex-col justify-between ${
                  isTripped
                    ? "bg-red-950/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                    : isOnline
                      ? "bg-[#06090e] border-zinc-800/90 hover:border-zinc-700"
                      : "bg-[#040609] border-zinc-800 opacity-70"
                }`}
              >
                {/* Node indicator */}
                <div className="flex items-center justify-between text-[9px] text-zinc-500 border-b border-zinc-800 pb-1.5 mb-2">
                  <span className="font-semibold text-zinc-300">
                    NODE {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="text-zinc-700">────</span>

                    <span
                      className={`w-2 h-2 rounded-full ${
                        isTripped
                          ? "bg-red-500 animate-pulse"
                          : isOnline
                            ? "bg-emerald-400"
                            : "bg-zinc-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Device identity */}
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display-tech font-bold text-sm text-white tracking-wider truncate">
                      {device.id}
                    </span>

                    <span
                      className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-xs border shrink-0 ${
                        isTripped
                          ? "bg-red-600 text-white border-red-400"
                          : isOnline
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {device.status}
                    </span>
                  </div>

                  <div
                    className="text-[10px] text-zinc-300 font-medium truncate mt-0.5"
                    title={device.name}
                  >
                    {device.name}
                  </div>

                  <div className="text-[8px] text-zinc-500 truncate">
                    {device.circuit}
                  </div>
                </div>

                {/* Telemetry */}
                <div className="my-2.5 pt-2 border-t border-zinc-800 space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">TEMP:</span>

                    <span
                      className={
                        hasTemperature
                          ? "text-cyan-300 font-mono font-bold"
                          : "text-zinc-600 font-mono font-bold"
                      }
                    >
                      {hasTemperature
                        ? `${device.temperature.toFixed(1)}°C`
                        : "--"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">LOAD:</span>

                    <span
                      className={
                        hasCurrent
                          ? "text-zinc-200 font-mono font-bold"
                          : "text-zinc-600 font-mono font-bold"
                      }
                    >
                      {hasCurrent ? `${device.currentLoad.toFixed(1)}A` : "--"}
                    </span>
                  </div>

                  {/* Load indicator */}
                  <div className="w-full h-1 bg-zinc-900 rounded-xs overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        loadPercent > 80
                          ? "bg-red-500"
                          : loadPercent > 60
                            ? "bg-amber-400"
                            : "bg-cyan-400"
                      }`}
                      style={{
                        width: hasCurrent ? `${loadPercent}%` : "0%",
                      }}
                    />
                  </div>

                  {!hasCurrent && (
                    <div className="text-[7px] text-zinc-600 uppercase tracking-wider text-right">
                      NO LOAD TELEMETRY
                    </div>
                  )}
                </div>

                {/* Breaker control */}
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-1">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider">
                    BREAKER SWITCH
                  </span>

                  <button
                    id={`toggle-mcb-switch-${device.id.toLowerCase()}`}
                    onClick={() => onToggleBreaker(device.id)}
                    className={`relative px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded-xs border uppercase transition-all shadow-xs flex items-center gap-1.5 ${
                      isTripped
                        ? "bg-red-950 text-red-300 border-red-500 hover:bg-red-900"
                        : device.switchState
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-500 hover:bg-emerald-900"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
                    }`}
                    title={
                      isTripped
                        ? "Reset tripped breaker"
                        : device.switchState
                          ? "Open breaker"
                          : "Close breaker"
                    }
                  >
                    <Power className="w-3 h-3" />

                    <span>
                      {isTripped
                        ? "RESET"
                        : device.switchState
                          ? "CLOSED"
                          : "OPEN"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
