import React from 'react';
import { ShieldCheck, ShieldX, Lock, Unlock, AlertTriangle, Radio } from 'lucide-react';
import { SecurityStatus } from '../../types';

interface TheftProtectionPanelProps {
  security: SecurityStatus;
  onToggleTheftProtection: (armed: boolean) => void;
  onSimulateIntruderToggle?: () => void;
}

export const TheftProtectionPanel: React.FC<TheftProtectionPanelProps> = ({
  security,
  onToggleTheftProtection,
  onSimulateIntruderToggle,
}) => {
  const isArmed = security.theftProtectionArmed;
  const hasIntruder = security.intruderDetected;

  return (
    <div 
      id="theft-protection-panel"
      className={`border rounded-xs p-3 font-mono transition-all select-none ${
        hasIntruder && isArmed
          ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.35)]'
          : isArmed
          ? 'bg-[#080d14] border-zinc-800/90'
          : 'bg-[#080b0f] border-zinc-850 opacity-80'
      }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-xs border ${
            hasIntruder && isArmed
              ? 'bg-red-900/60 border-red-500 text-red-300 animate-pulse'
              : isArmed
              ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-400'
              : 'bg-zinc-850 border-zinc-700 text-zinc-500'
          }`}>
            {isArmed ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </div>
          <div>
            <div className="text-[11px] font-display-tech font-bold tracking-wider text-zinc-100 uppercase">
              THEFT PROTECTION SYSTEM
            </div>
            <div className="text-[9px] text-zinc-500 tracking-wider">
              PERIMETER BEAM & TAMPER RADAR
            </div>
          </div>
        </div>

        {/* The requested On/Off Switch */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-bold uppercase">
            {isArmed ? 'ARMED' : 'DISARMED'}
          </span>
          <button
            id="theft-arm-toggle-switch"
            onClick={() => onToggleTheftProtection(!isArmed)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-xs border transition-colors duration-200 ease-in-out focus:outline-none ${
              isArmed 
                ? 'bg-cyan-600 border-cyan-400' 
                : 'bg-zinc-800 border-zinc-700'
            }`}
            role="switch"
            aria-checked={isArmed}
          >
            <span
              className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-xs bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-[2px] ${
                isArmed ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Status Bar: Area Safe vs Intruder There */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className={`p-2 rounded-xs border flex items-center gap-2.5 ${
          !isArmed 
            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500' 
            : hasIntruder 
            ? 'bg-red-900/40 border-red-500/80 text-red-200 animate-pulse' 
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
        }`}>
          {hasIntruder && isArmed ? (
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
            <div className={`text-xs font-bold font-display-tech tracking-wider uppercase ${
              !isArmed 
                ? 'text-zinc-500' 
                : hasIntruder 
                ? 'text-red-400' 
                : 'text-emerald-400'
            }`}>
              {!isArmed ? 'PROTECTION OFF' : hasIntruder ? 'INTRUDER DETECTED' : 'AREA SAFE'}
            </div>
          </div>
        </div>

        {/* Intruder details / Simulation test toggle */}
        <div className="p-2 bg-zinc-900/60 border border-zinc-800/80 rounded-xs flex items-center justify-between text-[10px]">
          <div>
            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">RADAR ZONE</div>
            <div className="text-zinc-200 font-semibold truncate">
              {hasIntruder && isArmed ? security.intruderLocation || 'SECTOR-02 PERIMETER' : 'ALL 4 SECTORS NORMAL'}
            </div>
          </div>

          {onSimulateIntruderToggle && (
            <button
              id="simulate-intruder-btn"
              onClick={onSimulateIntruderToggle}
              className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider rounded-xs border transition-colors ${
                hasIntruder
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  : 'bg-red-950/30 hover:bg-red-900/40 text-red-300 border-red-500/40'
              }`}
            >
              {hasIntruder ? 'CLEAR TEST' : 'TEST INTRUDER'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
