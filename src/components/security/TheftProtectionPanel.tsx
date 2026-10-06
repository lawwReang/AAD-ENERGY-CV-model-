import React from "react";
import {
  ShieldCheck,
  ShieldX,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";
import { SecurityStatus } from "../../types";

interface TheftProtectionPanelProps {
  security: SecurityStatus;
  onToggleTheftProtection: (armed: boolean) => void;
}

export const TheftProtectionPanel: React.FC<TheftProtectionPanelProps> = ({
  security,
  onToggleTheftProtection,
}) => {
  const isArmed = security.theftProtectionArmed;
  const hasIntruder = security.intruderDetected;

  const threatActive = isArmed && hasIntruder;

  return (
    <div
      id="theft-protection-panel"
      className={`border rounded-xs p-3 font-mono transition-all select-none ${
        threatActive
          ? "bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]"
          : isArmed
            ? "bg-[#080d14] border-zinc-800/90"
            : "bg-[#080b0f] border-zinc-850 opacity-80"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`p-1 rounded-xs border ${
              threatActive
                ? "bg-red-900/60 border-red-500 text-red-300 animate-pulse"
                : isArmed
                  ? "bg-cyan-950/50 border-cyan-500/40 text-cyan-400"
                  : "bg-zinc-850 border-zinc-700 text-zinc-500"
            }`}
          >
            {isArmed ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </div>

          <div>
            <div className="text-[11px] font-display-tech font-bold tracking-wider text-zinc-100 uppercase">
              THEFT PROTECTION SYSTEM
            </div>

            <div className="text-[9px] text-zinc-500 tracking-wider">
              SECURITY MONITORING & CV INTEGRATION
            </div>
          </div>
        </div>

        {/* Arm / Disarm */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-bold uppercase">
            {isArmed ? "ARMED" : "DISARMED"}
          </span>

          <button
            id="theft-arm-toggle-switch"
            onClick={() => onToggleTheftProtection(!isArmed)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-xs border transition-colors duration-200 ease-in-out focus:outline-none ${
              isArmed
                ? "bg-cyan-600 border-cyan-400"
                : "bg-zinc-800 border-zinc-700"
            }`}
            role="switch"
            aria-checked={isArmed}
            aria-label="Toggle theft protection"
          >
            <span
              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-xs bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-[2px] ${
                isArmed ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          className={`p-2 rounded-xs border flex items-center gap-2.5 ${
            !isArmed
              ? "bg-zinc-900/50 border-zinc-800 text-zinc-500"
              : threatActive
                ? "bg-red-900/40 border-red-500/80 text-red-200 animate-pulse"
                : "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
          }`}
        >
          {threatActive ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 animate-bounce" />
          ) : isArmed ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <ShieldX className="w-5 h-5 text-zinc-500 shrink-0" />
          )}

          <div className="min-w-0">
            <div className="text-[9px] uppercase tracking-wider text-zinc-400 font-medium">
              AREA MONITORING STATUS
            </div>

            <div
              className={`text-xs font-bold font-display-tech tracking-wider uppercase ${
                !isArmed
                  ? "text-zinc-500"
                  : threatActive
                    ? "text-red-400"
                    : "text-emerald-400"
              }`}
            >
              {!isArmed
                ? "PROTECTION OFF"
                : threatActive
                  ? "THREAT DETECTED"
                  : "AREA MONITORED"}
            </div>
          </div>
        </div>

        {/* Detection Information */}
        <div className="p-2 bg-zinc-900/60 border border-zinc-800/80 rounded-xs flex items-center justify-between text-[10px]">
          <div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">
              DETECTION STATUS
            </div>

            <div className="text-zinc-200 font-semibold truncate">
              {!isArmed
                ? "MONITORING DISABLED"
                : hasIntruder
                  ? security.intruderLocation || "THREAT LOCATION PENDING"
                  : "NO THREAT DETECTED"}
            </div>
          </div>

          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              !isArmed
                ? "bg-zinc-600"
                : threatActive
                  ? "bg-red-500 animate-pulse"
                  : "bg-emerald-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
