import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Activity, Clock, SlidersHorizontal, RefreshCw } from 'lucide-react';

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
}

export const LiveSensorGraph: React.FC<LiveSensorGraphProps> = ({ 
  data,
  currentTemp = 38.4,
  currentGas = 214,
}) => {
  const [timeRange, setTimeRange] = useState<'NOW' | '5 MIN' | '15 MIN' | '30 MIN' | '1 HR'>('NOW');
  const [activeSignal, setActiveSignal] = useState<'ALL' | 'TEMP' | 'GAS'>('ALL');

  const ranges = ['NOW', '5 MIN', '15 MIN', '30 MIN', '1 HR'] as const;

  // Custom high-tech dark tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#05080c]/95 border border-zinc-700/80 p-2.5 rounded-xs font-mono text-xs shadow-xl backdrop-blur-xs">
          <div className="text-[10px] text-zinc-400 border-b border-zinc-800 pb-1 mb-1.5 flex items-center justify-between gap-3">
            <span>TIMESTAMP:</span>
            <span className="text-zinc-200 font-bold">{label}</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5 text-[11px]">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: entry.color }} />
                <span className="uppercase font-semibold">{entry.name}:</span>
              </span>
              <span className="font-bold text-white">
                {entry.value}{entry.name === 'Temperature' ? '°C' : '%'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
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
              DUAL-CHANNEL ANALOG & IONIZATION TELEMETRY STREAM
            </div>
          </div>
        </div>

        {/* Technical Timeframe Selector (NOW, 5 MIN, 15 MIN, 30 MIN, 1 HR) */}
        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 p-0.5 rounded-xs text-[10px]">
          <span className="px-2 text-zinc-500 uppercase tracking-widest text-[9px] hidden sm:inline">
            RANGE:
          </span>
          {ranges.map((range) => (
            <button
              key={range}
              id={`time-range-btn-${range.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-0.5 rounded-xs uppercase tracking-wider font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
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
          <button
            onClick={() => setActiveSignal(activeSignal === 'TEMP' ? 'ALL' : 'TEMP')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-xs border transition-colors ${
              activeSignal === 'TEMP' || activeSignal === 'ALL'
                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                : 'text-zinc-600 border-zinc-850'
            }`}
          >
            <span className="w-2.5 h-1 bg-cyan-400 rounded-xs" />
            <span>TEMPERATURE (°C)</span>
            <span className="font-bold text-zinc-200 ml-1">{currentTemp.toFixed(1)}°C</span>
          </button>

          <button
            onClick={() => setActiveSignal(activeSignal === 'GAS' ? 'ALL' : 'GAS')}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-xs border transition-colors ${
              activeSignal === 'GAS' || activeSignal === 'ALL'
                ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                : 'text-zinc-600 border-zinc-850'
            }`}
          >
            <span className="w-2.5 h-1 bg-amber-400 rounded-xs" />
            <span>GAS LEVEL (%)</span>
            <span className="font-bold text-zinc-200 ml-1">{currentGas.toFixed(1)}%</span>
          </button>
        </div>

        <div className="text-[9px] text-zinc-500 tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>ADC RESOLUTION: 16-BIT • SAMPLING: 250Hz</span>
        </div>
      </div>

      {/* Recharts Timeline */}
      <div className="w-full h-52 sm:h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#182232" vertical={false} />
            
            <XAxis 
              dataKey="time" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false}
              fontFamily="var(--font-mono)"
            />
            
            {/* Left Y Axis for Temperature */}
            <YAxis 
              yAxisId="left" 
              domain={[20, 80]} 
              stroke="#06b6d4" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              fontFamily="var(--font-mono)"
              tickFormatter={(v) => `${v}°C`}
            />

            {/* Right Y Axis for Gas % */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 100]} 
              stroke="#f59e0b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              fontFamily="var(--font-mono)"
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Temperature Line */}
            {(activeSignal === 'ALL' || activeSignal === 'TEMP') && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="temp" 
                name="Temperature"
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#06b6d4' }}
                activeDot={{ r: 5, fill: '#22d3ee', stroke: '#fff', strokeWidth: 1 }}
                isAnimationActive={true}
              />
            )}

            {/* Gas Level Line */}
            {(activeSignal === 'ALL' || activeSignal === 'GAS') && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="gas" 
                name="Gas Level"
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#f59e0b' }}
                activeDot={{ r: 5, fill: '#fbbf24', stroke: '#fff', strokeWidth: 1 }}
                isAnimationActive={true}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
