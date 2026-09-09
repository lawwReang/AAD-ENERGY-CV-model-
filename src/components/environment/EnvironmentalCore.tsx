import React from 'react';
import { EnvironmentData } from '../../types';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';

interface EnvironmentalCoreProps {
  environment: EnvironmentData;
}

export const EnvironmentalCore: React.FC<EnvironmentalCoreProps> = ({ environment }) => {
  const isTempCritical = environment.temperatureStatus === 'CRITICAL';
  const isTempWarning = environment.temperatureStatus === 'WARNING';

  const isGasCritical = environment.gasStatus === 'CRITICAL';
  const isGasWarning = environment.gasStatus === 'WARNING';

  const isFireEmergency = environment.fireStatus === 'EMERGENCY';

  // Calculate percentage for radial visualizer & indicator:
  // Temp 0-80°C (e.g. 38.4°C is 48%)
  const tempPercent = Math.min(100, Math.max(0, (environment.temperature / 80) * 100));
  // Gas 0-100% (e.g. 21.4%)
  const gasPercent = Math.min(100, Math.max(0, environment.gas));
  // Humidity 0-100%
  const humidityPercent = environment.humidity;

  return (
    <div 
      id="environmental-core-module"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3.5 font-mono select-none"
    >
      {/* Header */}
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
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
            isFireEmergency || isGasCritical || isTempCritical
              ? 'bg-red-950 text-red-400 border border-red-500 animate-pulse'
              : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40'
          }`}>
            {isFireEmergency || isGasCritical || isTempCritical ? 'HAZARD ELEVATED' : 'NOMINAL ATMOSPHERE'}
          </span>
        </div>
      </div>

      {/* OVERSIZED PRIMARY READINGS: TEMPERATURE & GAS LEVEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-4">
        
        {/* TEMPERATURE CARD */}
        <div className={`relative overflow-hidden p-4 border rounded-xs transition-all ${
          isTempCritical
            ? 'bg-red-950/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
            : isTempWarning
            ? 'bg-amber-950/20 border-amber-500/60'
            : 'bg-[#05080d] border-zinc-800/90'
        }`}>
          {/* Subtle Radial Visualizer Behind Value */}
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
                className={isTempCritical ? 'text-red-500' : isTempWarning ? 'text-amber-400' : 'text-cyan-400'}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold tracking-widest uppercase">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              TEMPERATURE
            </div>

            {/* Huge Number */}
            <div className="mt-1 flex items-baseline justify-center font-display-tech font-bold tracking-tighter">
              <span className={`text-5xl sm:text-6xl ${
                isTempCritical ? 'text-red-400 animate-pulse' : isTempWarning ? 'text-amber-400' : 'text-white'
              }`}>
                {environment.temperature.toFixed(1)}
              </span>
              <span className="ml-1.5 text-xl font-mono text-zinc-400">
                {environment.temperatureUnit}
              </span>
            </div>

            {/* Status Label */}
            <div className="mt-1">
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs border ${
                isTempCritical
                  ? 'bg-red-600 text-white border-red-400'
                  : isTempWarning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {environment.temperatureStatus}
              </span>
            </div>
          </div>

          {/* SAFETY THRESHOLD RING / BAR for Temperature */}
          <div className="mt-3 pt-2.5 border-t border-zinc-850">
            <div className="flex justify-between text-[9px] text-zinc-400 uppercase tracking-wider mb-1 font-mono">
              <span className="text-emerald-400 font-semibold">SAFE (&lt;45°C)</span>
              <span className="text-amber-400 font-semibold">WARN (45-60°C)</span>
              <span className="text-red-400 font-semibold">CRITICAL (&gt;60°C)</span>
            </div>
            {/* Technical continuous threshold line with marker */}
            <div className="relative h-2 bg-zinc-900 border border-zinc-800 rounded-xs overflow-hidden">
              {/* Threshold color zones */}
              <div className="absolute inset-0 flex">
                <div className="w-[56%] bg-emerald-500/30 border-r border-emerald-500/50" />
                <div className="w-[19%] bg-amber-500/30 border-r border-amber-500/50" />
                <div className="w-[25%] bg-red-500/40" />
              </div>
              {/* Dynamic needle/marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_#fff] transition-all duration-300"
                style={{ left: `${tempPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* GAS LEVEL CARD */}
        <div className={`relative overflow-hidden p-4 border rounded-xs transition-all ${
          isGasCritical
            ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
            : isGasWarning
            ? 'bg-amber-950/20 border-amber-500/60'
            : 'bg-[#05080d] border-zinc-800/90'
        }`}>
          {/* Subtle Radial Visualizer Behind Value */}
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
                className={isGasCritical ? 'text-red-500' : isGasWarning ? 'text-amber-400' : 'text-cyan-400'}
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center py-2">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold tracking-widest uppercase">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              GAS LEVEL
            </div>

            {/* Huge Number */}
            <div className="mt-1 flex items-baseline justify-center font-display-tech font-bold tracking-tighter">
              <span className={`text-5xl sm:text-6xl ${
                isGasCritical ? 'text-red-400 animate-pulse' : isGasWarning ? 'text-amber-400' : 'text-white'
              }`}>
                {environment.gas.toFixed(1)}
              </span>
              <span className="ml-1.5 text-xl font-mono text-zinc-400">
                {environment.gasUnit}
              </span>
            </div>

            {/* Status Label (safe/emergency) */}
            <div className="mt-1">
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-xs border ${
                isGasCritical
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : isGasWarning
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {isGasCritical ? 'EMERGENCY: GAS LEAK' : isGasWarning ? 'WARNING' : 'SAFE'}
              </span>
            </div>
          </div>

          {/* SAFETY THRESHOLD RING / BAR for Gas */}
          <div className="mt-3 pt-2.5 border-t border-zinc-850">
            <div className="flex justify-between text-[9px] text-zinc-400 uppercase tracking-wider mb-1 font-mono">
              <span className="text-emerald-400 font-semibold">SAFE (&lt;40%)</span>
              <span className="text-amber-400 font-semibold">WARN (40-70%)</span>
              <span className="text-red-400 font-semibold">CRITICAL (&gt;70%)</span>
            </div>
            {/* Technical continuous threshold line with marker */}
            <div className="relative h-2 bg-zinc-900 border border-zinc-800 rounded-xs overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="w-[40%] bg-emerald-500/30 border-r border-emerald-500/50" />
                <div className="w-[30%] bg-amber-500/30 border-r border-amber-500/50" />
                <div className="w-[30%] bg-red-500/40" />
              </div>
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_#fff] transition-all duration-300"
                style={{ left: `${gasPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* SECONDARY ATMOSPHERIC SENSORS: HUMIDITY & FIRE DETECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
        
        {/* Humidity sensor */}
        <div className="p-2.5 bg-[#05080d] border border-zinc-800/80 rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-950/40 text-blue-400 border border-blue-500/30 rounded-xs">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                HUMIDITY
              </div>
              <div className="text-lg font-display-tech font-bold text-zinc-100">
                {environment.humidity.toFixed(1)} <span className="text-xs text-zinc-400">{environment.humidityUnit}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded-xs uppercase">
              {environment.humidityStatus}
            </span>
            <div className="text-[8px] text-zinc-500 mt-1">
              CONDENSATION: LOW
            </div>
          </div>
        </div>

        {/* Fire detection sensor (safe / emergency) */}
        <div className={`p-2.5 border rounded-xs flex items-center justify-between transition-all ${
          isFireEmergency
            ? 'bg-red-950/40 border-red-500 text-red-200 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            : 'bg-[#05080d] border-zinc-800/80 text-zinc-300'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-xs border ${
              isFireEmergency 
                ? 'bg-red-600 text-white border-red-400' 
                : 'bg-orange-950/40 text-orange-400 border-orange-500/30'
            }`}>
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                FIRE DETECTION
              </div>
              <div className={`text-lg font-display-tech font-bold ${
                isFireEmergency ? 'text-red-400' : 'text-zinc-100'
              }`}>
                {isFireEmergency ? 'FIRE OUTBREAK' : 'OPTICAL SAFE'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs uppercase tracking-wider ${
              isFireEmergency 
                ? 'bg-red-600 text-white border border-red-400' 
                : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
            }`}>
              {environment.fireStatus}
            </span>
            <div className="text-[8px] text-zinc-500 mt-1">
              IR OPTIC: {environment.fireOpticalReading}%
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
