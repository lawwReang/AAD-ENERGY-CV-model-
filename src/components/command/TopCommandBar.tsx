import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Wifi, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Radio,
  AlertTriangle
} from 'lucide-react';

interface TopCommandBarProps {
  onOpenSettings: () => void;
  isEmergencyActive: boolean;
  activeScenarioName: string;
  onResetEmergency: () => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  onOpenSettings,
  isEmergencyActive,
  activeScenarioName,
  onResetEmergency,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('18:54:21');
  const [currentDate, setCurrentDate] = useState<string>('09 SEP 2026');
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(12);

  // Live ticking clock adhering to 09 SEP 2026
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Format time as HH:mm:ss
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      // Slight jitter on latency for realism
      setLatencyMs(Math.floor(11 + Math.random() * 4));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header 
      id="top-command-bar"
      className={`border-b transition-colors duration-300 select-none ${
        isEmergencyActive 
          ? 'bg-[#15070a] border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
          : 'bg-[#080d14] border-zinc-800/90'
      }`}
    >
      <div className="w-full px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Branding & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-r border-zinc-800 pr-4">
            <div className={`p-1.5 rounded-sm border ${
              isEmergencyActive 
                ? 'bg-red-950/80 border-red-500 text-red-400' 
                : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display-tech font-bold text-sm tracking-wider text-white">SMART</span>
                <span className="font-mono-tech text-xs font-semibold px-1 py-0.5 bg-zinc-800/80 text-cyan-400 border border-zinc-700/60 rounded-xs">
                  MCB
                </span>
              </div>
              <div className="text-[9px] tracking-widest text-zinc-400 font-mono uppercase">
                INTELLIGENT SAFETY SYSTEM
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
            <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300">
              FACILITY: SUBSTATION-04A
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">BUS: 400V DUAL-FEED</span>
          </div>
        </div>

        {/* Center: Mission / Facility Command Center */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/90 border border-zinc-800 rounded-sm">
            <Radio className={`w-3.5 h-3.5 ${isEmergencyActive ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className="font-mono text-[11px] tracking-widest text-zinc-200 uppercase font-semibold">
              FACILITY COMMAND CENTER
            </span>
            <span className="text-zinc-600">•</span>
            <span className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded-xs ${
              isEmergencyActive 
                ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isEmergencyActive ? 'CRITICAL ALERT ACTIVE' : 'TELEMETRY ACTIVE'}
            </span>
          </div>

          {isEmergencyActive && (
            <button
              id="top-emergency-reset-btn"
              onClick={onResetEmergency}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 rounded-xs transition-colors shadow-sm"
            >
              <AlertTriangle className="w-3 h-3" />
              RESET OVERRIDE
            </button>
          )}
        </div>

        {/* Right: Operational Status, Ticking Clock, Controls */}
        <div className="flex items-center gap-3 font-mono">
          
          {/* Subtle connection ping */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-zinc-400 border border-zinc-800 px-2 py-0.5 bg-zinc-900/60 rounded-xs">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span>LINK: <span className="text-zinc-200">{latencyMs}ms</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Operational Status */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-xs">
            <span className={`w-2 h-2 rounded-full ${isEmergencyActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[10px] tracking-wider text-zinc-200 font-semibold uppercase">
              {isEmergencyActive ? 'ALERT STATE' : 'SYSTEM OPERATIONAL'}
            </span>
          </div>

          {/* Date & Live Clock */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 rounded-xs">
            <span className="text-zinc-400 text-[10px] tracking-wider">{currentDate}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-cyan-400 font-mono font-bold text-xs tracking-widest tabular-nums">
              {currentTime}
            </span>
          </div>

          {/* Audio Mute & Settings quick toggle */}
          <div className="flex items-center gap-1 border-l border-zinc-800 pl-2">
            <button
              id="top-audio-toggle-btn"
              onClick={() => setAudioMuted(!audioMuted)}
              title={audioMuted ? 'Unmute alert chimes' : 'Mute alert chimes'}
              className="p-1 text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800 rounded-xs transition-colors"
            >
              {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              id="top-settings-btn"
              onClick={onOpenSettings}
              title="Command Center Calibration & Thresholds"
              className="p-1 text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800 rounded-xs transition-colors flex items-center gap-1"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
