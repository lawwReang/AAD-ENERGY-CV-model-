import React from 'react';
import { McbDevice } from '../../types';
import { Cpu, Power, Zap, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

interface McbNetworkTopologyProps {
  devices: McbDevice[];
  onToggleBreaker: (id: string) => void;
  onTripBreaker?: (id: string) => void;
}

export const McbNetworkTopology: React.FC<McbNetworkTopologyProps> = ({
  devices,
  onToggleBreaker,
  onTripBreaker,
}) => {
  return (
    <div 
      id="mcb-network-topology"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3.5 font-mono select-none"
    >
      {/* Topology Header */}
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
              BUS-CONNECTED INTELLIGENT MINIATURE CIRCUIT BREAKERS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ONLINE ({devices.filter(d => d.status === 'ONLINE').length})
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            OFFLINE ({devices.filter(d => d.status === 'OFFLINE').length})
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            TRIPPED ({devices.filter(d => d.status === 'TRIPPED').length})
          </span>
        </div>
      </div>

      {/* Industrial Bus Topology Visualizer & Interactive Switches */}
      <div className="relative">
        
        {/* Main Feeder Bus Header Bar */}
        <div className="flex items-center gap-3 mb-3 bg-[#05080c] border border-zinc-800/80 px-3 py-2 rounded-xs">
          <div className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[10px] tracking-wider rounded-xs uppercase">
            MAIN DISTRIBUTION PANEL
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400">
            <span>FEEDER BUS: 400V 3Ø 50Hz</span>
            <span className="text-zinc-600">|</span>
            <span>TOTAL BUS LOAD: <span className="text-white font-bold">
              {devices.reduce((acc, d) => acc + (d.status === 'ONLINE' ? d.currentLoad : 0), 0).toFixed(1)} A
            </span></span>
          </div>
          <div className="ml-auto text-[9px] text-zinc-500 font-mono">
            MODBUS-RTU RS485
          </div>
        </div>

        {/* Horizontal Topology Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
          {devices.map((device, index) => {
            const isOnline = device.status === 'ONLINE';
            const isTripped = device.status === 'TRIPPED';
            const loadPercent = Math.min(100, Math.round((device.currentLoad / device.maxCapacity) * 100));

            return (
              <div 
                key={device.id}
                id={`mcb-device-card-${device.id.toLowerCase()}`}
                className={`relative p-3 border rounded-xs transition-all flex flex-col justify-between ${
                  isTripped 
                    ? 'bg-red-950/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]' 
                    : isOnline
                    ? 'bg-[#06090e] border-zinc-800/90 hover:border-zinc-700'
                    : 'bg-[#040609] border-zinc-850 opacity-70'
                }`}
              >
                {/* Circuit line connecting indicator */}
                <div className="flex items-center justify-between text-[9px] text-zinc-500 border-b border-zinc-850 pb-1.5 mb-2">
                  <span className="font-semibold text-zinc-300">NODE 0{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-600">────</span>
                    <span className={`w-2 h-2 rounded-full ${
                      isTripped ? 'bg-red-500 animate-ping' : isOnline ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-zinc-600'
                    }`} />
                  </div>
                </div>

                {/* Device Header */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display-tech font-bold text-sm text-white tracking-wider">
                      {device.id}
                    </span>
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.2 rounded-xs border ${
                      isTripped 
                        ? 'bg-red-600 text-white border-red-400' 
                        : isOnline
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {device.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-zinc-300 font-medium truncate mt-0.5" title={device.name}>
                    {device.name}
                  </div>
                  <div className="text-[8px] text-zinc-500 truncate">
                    {device.circuit}
                  </div>
                </div>

                {/* Metrics: Temperature & Current Load */}
                <div className="my-2.5 pt-2 border-t border-zinc-850 space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">TEMP:</span>
                    <span className={`font-mono font-bold ${
                      isOnline ? 'text-cyan-300' : 'text-zinc-500'
                    }`}>
                      {isOnline ? `${device.temperature.toFixed(1)}°C` : '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">LOAD:</span>
                    <span className={`font-mono font-bold ${
                      isOnline ? 'text-zinc-200' : 'text-zinc-500'
                    }`}>
                      {isOnline ? `${device.currentLoad.toFixed(1)}A / ${device.maxCapacity}A` : '0.0A'}
                    </span>
                  </div>

                  {/* Load progress line */}
                  <div className="w-full h-1 bg-zinc-900 rounded-xs overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        loadPercent > 80 ? 'bg-red-500' : loadPercent > 60 ? 'bg-amber-400' : 'bg-cyan-400'
                      }`}
                      style={{ width: isOnline ? `${loadPercent}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* Interactive MCB Breaker Switch Actuator */}
                <div className="pt-2 border-t border-zinc-850 flex items-center justify-between gap-1">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider">
                    BREAKER SWITCH
                  </span>

                  <button
                    id={`toggle-mcb-switch-${device.id.toLowerCase()}`}
                    onClick={() => onToggleBreaker(device.id)}
                    className={`relative px-2.5 py-1 text-[10px] font-mono font-bold tracking-wider rounded-xs border uppercase transition-all shadow-xs flex items-center gap-1.5 ${
                      isTripped
                        ? 'bg-red-950 text-red-300 border-red-500 hover:bg-red-900'
                        : device.switchState
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 hover:bg-emerald-900'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                    }`}
                    title={isTripped ? 'Reset Tripped Breaker' : device.switchState ? 'Trip/Open Breaker' : 'Close/Turn On Breaker'}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isTripped ? 'RESET' : device.switchState ? 'CLOSED' : 'OPEN'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
