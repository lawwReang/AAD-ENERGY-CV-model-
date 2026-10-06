import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Activity } from "lucide-react";

interface SensorDataPoint {
  time: string;
  temp: number;
  gas: number;
  humidity: number;
}

interface LiveSensorGraphProps {
  data: SensorDataPoint[];
  currentTemp?: number;
  currentGas?: number;
  gasUnit?: string;
}

export const LiveSensorGraph: React.FC<LiveSensorGraphProps> = ({
  data,
  currentTemp,
  currentGas,
  gasUnit = "",
}) => {
  const [timeRange, setTimeRange] = useState<
    "NOW" | "5 MIN" | "15 MIN" | "30 MIN" | "1 HR"
  >("NOW");

  const [activeSignal, setActiveSignal] = useState<"ALL" | "TEMP" | "GAS">(
    "ALL",
  );

  const ranges = ["NOW", "5 MIN", "15 MIN", "30 MIN", "1 HR"] as const;

  const hasData = data.length > 0;

  /*
   * Time-range filtering will be connected to the backend
   * history endpoint later.
   *
   * For now, the selected range is kept as UI state without
   * pretending that we have historical data.
   */
  const displayedData = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    return (
      <div className="bg-[#05080c]/95 border border-zinc-700/80 p-2.5 rounded-xs font-mono text-xs shadow-xl backdrop-blur-xs">
        <div className="text-[10px] text-zinc-400 border-b border-zinc-800 pb-1 mb-1.5 flex items-center justify-between gap-3">
          <span>TIMESTAMP:</span>
          <span className="text-zinc-200 font-bold">{label}</span>
        </div>

        {payload.map((entry: any, index: number) => (
          <div
            key={`item-${index}`}
            className="flex items-center justify-between gap-4 py-0.5 text-[11px]"
          >
            <span
              className="flex items-center gap-1.5"
              style={{ color: entry.color }}
            >
              <span
                className="w-2 h-2 rounded-xs"
                style={{ backgroundColor: entry.color }}
              />

              <span className="uppercase font-semibold">{entry.name}:</span>
            </span>

            <span className="font-bold text-white">
              {typeof entry.value === "number"
                ? entry.value.toFixed(1)
                : entry.value}

              {entry.name === "Temperature" && "°C"}

              {entry.name === "Gas Level" && gasUnit && ` ${gasUnit}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      id="live-sensor-graph-container"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3.5 font-mono select-none"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 rounded-xs">
            <Activity className="w-3.5 h-3.5" />
          </div>

          <div>
            <div className="font-display-tech font-bold text-sm tracking-wider text-white uppercase">
              LIVE ENVIRONMENTAL SIGNAL
            </div>

            <div className="text-[9px] text-zinc-500 tracking-wider">
              REAL-TIME SENSOR TELEMETRY
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-0.5 rounded-xs text-[10px]">
          <span className="px-2 text-zinc-500 uppercase tracking-widest text-[9px] hidden sm:inline">
            RANGE:
          </span>

          {ranges.map((range) => (
            <button
              key={range}
              id={`time-range-btn-${range.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-0.5 rounded-xs uppercase tracking-wider font-semibold transition-colors ${
                timeRange === range
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Channel Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] mb-2 px-1">
        <div className="flex items-center gap-3">
          {/* Temperature */}
          <button
            onClick={() =>
              setActiveSignal(activeSignal === "TEMP" ? "ALL" : "TEMP")
            }
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-xs border transition-colors ${
              activeSignal === "TEMP" || activeSignal === "ALL"
                ? "bg-cyan-950/40 text-cyan-300 border-cyan-500/40"
                : "text-zinc-600 border-zinc-850"
            }`}
          >
            <span className="w-2.5 h-1 bg-cyan-400 rounded-xs" />

            <span>TEMPERATURE (°C)</span>

            <span className="font-bold text-zinc-200 ml-1">
              {typeof currentTemp === "number"
                ? `${currentTemp.toFixed(1)}°C`
                : "--"}
            </span>
          </button>

          {/* Gas */}
          <button
            onClick={() =>
              setActiveSignal(activeSignal === "GAS" ? "ALL" : "GAS")
            }
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-xs border transition-colors ${
              activeSignal === "GAS" || activeSignal === "ALL"
                ? "bg-amber-950/40 text-amber-300 border-amber-500/40"
                : "text-zinc-600 border-zinc-850"
            }`}
          >
            <span className="w-2.5 h-1 bg-amber-400 rounded-xs" />

            <span>
              GAS LEVEL
              {gasUnit ? ` (${gasUnit})` : ""}
            </span>

            <span className="font-bold text-zinc-200 ml-1">
              {typeof currentGas === "number"
                ? `${currentGas.toFixed(1)}${gasUnit ? ` ${gasUnit}` : ""}`
                : "--"}
            </span>
          </button>
        </div>

        {/* Connection Status */}
        <div className="text-[9px] text-zinc-500 tracking-wider flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasData ? "bg-emerald-400 animate-ping" : "bg-zinc-600"
            }`}
          />

          <span>
            {hasData ? "TELEMETRY STREAM ACTIVE" : "WAITING FOR SENSOR DATA"}
          </span>
        </div>
      </div>

      {/* Graph / Empty State */}
      <div className="w-full h-52 sm:h-64 relative">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center border border-dashed border-zinc-800/80 rounded-sm">
            <Activity className="w-5 h-5 text-zinc-700 mb-2" />

            <div className="text-[10px] tracking-widest text-zinc-500">
              WAITING FOR SENSOR DATA
            </div>

            <div className="text-[8px] tracking-wider text-zinc-700 mt-1">
              MQTT TELEMETRY NOT RECEIVED
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayedData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#182232"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                fontFamily="var(--font-mono)"
              />

              {/* Temperature Axis */}
              <YAxis
                yAxisId="left"
                domain={["auto", "auto"]}
                stroke="#06b6d4"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="var(--font-mono)"
                tickFormatter={(value) => `${value}°C`}
              />

              {/* Gas Axis */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={["auto", "auto"]}
                stroke="#f59e0b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                fontFamily="var(--font-mono}"
                tickFormatter={(value) =>
                  gasUnit ? `${value} ${gasUnit}` : `${value}`
                }
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Temperature */}
              {(activeSignal === "ALL" || activeSignal === "TEMP") && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{
                    r: 2.5,
                    fill: "#06b6d4",
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#22d3ee",
                    stroke: "#fff",
                    strokeWidth: 1,
                  }}
                  isAnimationActive={true}
                />
              )}

              {/* Gas */}
              {(activeSignal === "ALL" || activeSignal === "GAS") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="gas"
                  name="Gas Level"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{
                    r: 2.5,
                    fill: "#f59e0b",
                  }}
                  activeDot={{
                    r: 5,
                    fill: "#fbbf24",
                    stroke: "#fff",
                    strokeWidth: 1,
                  }}
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
