import React from "react";
import { ElectricalReading } from "../../types";
import { Zap } from "lucide-react";

interface ElectricalMetricsProps {
  metrics: ElectricalReading;
}

export const ElectricalMetrics: React.FC<ElectricalMetricsProps> = ({
  metrics,
}) => {
  const hasVoltage = Number.isFinite(metrics.voltage) && metrics.voltage > 0;
  const hasCurrent = Number.isFinite(metrics.current) && metrics.current > 0;
  const hasPower = Number.isFinite(metrics.power) && metrics.power > 0;
  const hasEnergy = Number.isFinite(metrics.energy) && metrics.energy > 0;
  const hasFrequency =
    Number.isFinite(metrics.frequency) && metrics.frequency > 0;
  const hasPowerFactor =
    Number.isFinite(metrics.powerFactor) && metrics.powerFactor > 0;

  const formatValue = (value: number, available: boolean, decimals: number) => {
    return available ? value.toFixed(decimals) : "--";
  };

  return (
    <div
      id="electrical-telemetry-metrics"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3 font-mono select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-zinc-900 border border-zinc-700/60 text-cyan-400 rounded-xs">
            <Zap className="w-3.5 h-3.5" />
          </div>

          <div>
            <div className="text-[11px] font-display-tech font-bold tracking-wider text-zinc-300 uppercase">
              ELECTRICAL POWER TELEMETRY
            </div>

            <div className="text-[8px] text-zinc-500 tracking-wider">
              ELECTRICAL MEASUREMENT BUS
            </div>
          </div>
        </div>

        <span className="text-[9px] text-zinc-500 font-mono">
          PF:{" "}
          <span
            className={
              hasPowerFactor
                ? "text-emerald-400 font-bold"
                : "text-zinc-600 font-bold"
            }
          >
            {hasPowerFactor ? metrics.powerFactor.toFixed(2) : "--"}
          </span>
          {" • "}
          {hasFrequency ? `${metrics.frequency.toFixed(1)} Hz` : "-- Hz"}
        </span>
      </div>

      {/* Electrical metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        {/* Voltage */}
        <div className="p-2 bg-[#05080c] border border-zinc-800 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            VOLTAGE
          </div>

          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {formatValue(metrics.voltage, hasVoltage, 1)}{" "}
            <span className="text-[10px] text-zinc-400 font-normal">
              {hasVoltage ? "V" : ""}
            </span>
          </div>

          <div className="text-[8px] text-zinc-500 mt-0.5 uppercase">
            {hasVoltage ? "LIVE READING" : "WAITING FOR IOT"}
          </div>
        </div>

        {/* Current */}
        <div className="p-2 bg-[#05080c] border border-zinc-800 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            CURRENT
          </div>

          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {formatValue(metrics.current, hasCurrent, 2)}{" "}
            <span className="text-[10px] text-zinc-400 font-normal">
              {hasCurrent ? "A" : ""}
            </span>
          </div>

          <div className="text-[8px] text-zinc-500 mt-0.5 uppercase">
            {hasCurrent ? "LIVE READING" : "WAITING FOR IOT"}
          </div>
        </div>

        {/* Power */}
        <div className="p-2 bg-[#05080c] border border-zinc-800 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            POWER
          </div>

          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {formatValue(metrics.power, hasPower, 2)}{" "}
            <span className="text-[10px] text-zinc-400 font-normal">
              {hasPower ? "kW" : ""}
            </span>
          </div>

          <div className="text-[8px] text-zinc-500 mt-0.5 uppercase">
            {hasPower ? "LIVE READING" : "WAITING FOR IOT"}
          </div>
        </div>

        {/* Energy */}
        <div className="p-2 bg-[#05080c] border border-zinc-800 rounded-xs">
          <div className="text-[9px] uppercase tracking-wider text-zinc-500">
            ENERGY
          </div>

          <div className="mt-0.5 font-display-tech text-base sm:text-lg font-bold text-white">
            {formatValue(metrics.energy, hasEnergy, 2)}{" "}
            <span className="text-[10px] text-zinc-400 font-normal">
              {hasEnergy ? "kWh" : ""}
            </span>
          </div>

          <div className="text-[8px] text-zinc-500 mt-0.5 uppercase">
            {hasEnergy ? "LIVE READING" : "WAITING FOR IOT"}
          </div>
        </div>
      </div>
    </div>
  );
};
