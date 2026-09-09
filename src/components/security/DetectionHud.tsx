import React from 'react';
import { SecurityStatus } from '../../types';
import { User, ShieldAlert, Video, AlertCircle, CheckCircle } from 'lucide-react';

interface DetectionHudProps {
  security: SecurityStatus;
}

export const DetectionHud: React.FC<DetectionHudProps> = ({ security }) => {
  return (
    <div 
      id="detection-hud"
      className="grid grid-cols-3 gap-2 font-mono select-none"
    >
      {/* 1. Person Telemetry */}
      <div className={`p-2.5 border transition-all ${
        security.personDetected > 0
          ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-300'
          : 'bg-[#080d14] border-zinc-800/80 text-zinc-400'
      } rounded-xs`}>
        <div className="flex items-center justify-between text-[10px] tracking-wider text-zinc-400 uppercase">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            PERSON
          </span>
          <span className="text-[9px] text-zinc-500">OPTICAL CV</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-display-tech text-2xl font-bold tracking-tight text-white">
            {String(security.personDetected).padStart(2, '0')}
          </span>
          <span className={`text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-xs ${
            security.personDetected > 0 
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' 
              : 'bg-zinc-800 text-zinc-400'
          }`}>
            {security.personDetected > 0 ? 'DETECTED' : 'CLEAR'}
          </span>
        </div>
        <div className="mt-1 text-[9px] text-zinc-500 truncate">
          CONF: {security.personConfidence}% • SECTOR: PORTAL 1
        </div>
      </div>

      {/* 2. Firearm Telemetry */}
      <div className={`p-2.5 border transition-all ${
        security.firearmDetected > 0
          ? 'bg-red-950/40 border-red-500 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          : 'bg-[#080d14] border-zinc-800/80 text-zinc-400'
      } rounded-xs`}>
        <div className="flex items-center justify-between text-[10px] tracking-wider uppercase">
          <span className="flex items-center gap-1.5 text-red-400 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            FIREARM
          </span>
          <span className="text-[9px] text-zinc-500">WEAPON AI</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className={`font-display-tech text-2xl font-bold tracking-tight ${
            security.firearmDetected > 0 ? 'text-red-400' : 'text-white'
          }`}>
            {String(security.firearmDetected).padStart(2, '0')}
          </span>
          <span className={`text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-xs ${
            security.firearmDetected > 0 
              ? 'bg-red-600 text-white' 
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            {security.firearmDetected > 0 ? 'CRITICAL' : 'CLEAR'}
          </span>
        </div>
        <div className="mt-1 text-[9px] text-zinc-500 truncate">
          {security.firearmDetected > 0 
            ? `ALERT: CONF ${security.firearmConfidence}% TRIGGERED` 
            : 'NO THREAT CLASSIFIED'
          }
        </div>
      </div>

      {/* 3. Camera Telemetry */}
      <div className="p-2.5 bg-[#080d14] border border-zinc-800/80 text-zinc-400 rounded-xs">
        <div className="flex items-center justify-between text-[10px] tracking-wider text-zinc-400 uppercase">
          <span className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            CAMERA
          </span>
          <span className="text-[9px] text-zinc-500">RTSP-01</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-display-tech text-xl font-bold tracking-wider text-emerald-400">
            {security.cameraStatus}
          </span>
          <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 border border-zinc-700/60 rounded-xs">
            {security.fps} FPS
          </span>
        </div>
        <div className="mt-1 text-[9px] text-zinc-500 flex items-center justify-between">
          <span>CODEC: H.265+</span>
          <span className="text-emerald-500">● 100% BITRATE</span>
        </div>
      </div>
    </div>
  );
};
