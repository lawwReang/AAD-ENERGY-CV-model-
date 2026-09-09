import React from 'react';
import { ElectricalReading } from '../../types';
import { Zap, Gauge, BatteryCharging, Shield } from 'lucide-react';

interface ElectricalMetricsProps {
  metrics: ElectricalReading;
}

export const ElectricalMetrics: React.FC<ElectricalMetricsProps> = ({ metrics }) => {
  return (
    <div 
      id="electrical-telemetry-metrics"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3 font-mono select-none"
    >
      <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-zinc-900 border border-zinc-700/60 text-cyan-400 rounded-xs">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-display-tech font-bold tracking-wider text-zinc-300 uppercase">
              ELECTRICAL POWER TELEMETRY
            </div>
            <div className="text-[8px] text-zinc-500 tracking-wider">
              BUS SUB-METERING & POWER QUALITY
            </div>
          </div>
        </div>

        <span className="text-[9px] text-zinc-500 font-mono">
          PF: <span className="text-emerald-400 font-bold">{metrics.powerFactor}</span> • {metrics.frequency} Hz
        </span>
      </div>

      {/* The 4 requested metrics: Voltage, Current, Power, Energy */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        
        {/* Voltage */}
        <div className="p-2 bg-[#05080c] border border-zinc-850 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            VOLTAGE
          </div>
          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {metrics.voltage.toFixed(1)} <span className="text-[10px] text-zinc-400 font-normal">V</span>
          </div>
          <div className="text-[8px] text-emerald-400 mt-0.5">NOMINAL (±1.2%)</div>
        </div>

        {/* Current */}
        <div className="p-2 bg-[#05080c] border border-zinc-850 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            CURRENT
          </div>
          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {metrics.current.toFixed(2)} <span className="text-[10px] text-zinc-400 font-normal">A</span>
          </div>
          <div className="text-[8px] text-cyan-400 mt-0.5">SUM OF BRANCHES</div>
        </div>

        {/* Power */}
        <div className="p-2 bg-[#05080c] border border-zinc-850 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            POWER
          </div>
          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {metrics.power.toFixed(2)} <span className="text-[10px] text-zinc-400 font-normal">kW</span>
          </div>
          <div className="text-[8px] text-zinc-400 mt-0.5">ACTIVE DEMAND</div>
        </div>

        {/* Energy */}
        <div className="p-2 bg-[#05080c] border border-zinc-850 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            ENERGY
          </div>
          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {metrics.energy.toFixed(2)} <span className="text-[10px] text-zinc-400 font-normal">kWh</span>
          </div>
          <div className="text-[8px] text-zinc-500 mt-0.5">TODAY'S ACCUMULATION</div>
        </div>

      </div>
    </div>
  );
};
