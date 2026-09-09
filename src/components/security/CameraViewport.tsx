import React from 'react';
import { 
  Video, 
  Crosshair, 
  AlertTriangle,
  Radio
} from 'lucide-react';
import { SecurityStatus } from '../../types';

interface CameraViewportProps {
  security: SecurityStatus;
  currentTime?: string;
  isEmergencyActive?: boolean;
  activeCam?: string;
  nightVision?: boolean;
  thermalMode?: boolean;
  zoomLevel?: number;
}

export const CameraViewport: React.FC<CameraViewportProps> = ({
  security,
  currentTime = '18:54:21',
  isEmergencyActive = false,
  activeCam = 'CAM-01',
  nightVision = false,
  thermalMode = false,
  zoomLevel = 1,
}) => {
  return (
    <div 
      id="camera-viewport-card"
      className="relative bg-[#05080c] border border-zinc-800 rounded-sm overflow-hidden flex flex-col group select-none shadow-md"
    >
      {/* Precision Corner Brackets */}
      <div className="corner-bracket-tl pointer-events-none" />
      <div className="corner-bracket-tr pointer-events-none" />
      <div className="corner-bracket-bl pointer-events-none" />
      <div className="corner-bracket-br pointer-events-none" />

      {/* Clean Uncluttered Header Bar: Just Feed Identity & Live Scan Status */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#080d14]/95 border-b border-zinc-800/80 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-cyan-950/40 border border-cyan-500/40 rounded-xs text-cyan-400">
            <Video className="w-3.5 h-3.5" />
          </div>
          <span className="font-display-tech font-bold text-xs text-white uppercase tracking-wider">
            LIVE CAMERA FEED
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-[11px] font-mono text-zinc-300 tracking-wider">
            {activeCam} • MAIN ENTRANCE PORTAL
          </span>
        </div>

        {/* Live Scan State Badge */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-950/40 border border-cyan-500/40 rounded-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-cyan-300 tracking-widest">
              SCANNING
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-red-950/30 border border-red-500/30 rounded-xs text-red-400 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            LIVE REC
          </div>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div 
        className={`relative w-full aspect-video min-h-[280px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-center overflow-hidden transition-all duration-300 ${
          thermalMode 
            ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-amber-950' 
            : nightVision 
            ? 'bg-[#021808]' 
            : 'bg-[#03060a]'
        }`}
      >
        {/* Animated Laser Scan Beam Sweeping Across the Feed */}
        <div className="camera-scan-beam" />
        <div className="camera-scan-halo" />

        {/* CRT Scanline Filter */}
        <div className="absolute inset-0 surveillance-scanline pointer-events-none z-10" />

        {/* Technical Sub-Grid Background */}
        <div className={`absolute inset-0 bg-tech-grid opacity-25 pointer-events-none ${
          nightVision ? 'filter sepia hue-rotate-90' : ''
        }`} />

        {/* Surveillance Scene Graphic Canvas */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
            
            {/* Facility Hallway Perspective Scene */}
            <div className="absolute inset-0 opacity-25 pointer-events-none flex items-center justify-center">
              <svg className="w-full h-full text-zinc-600" viewBox="0 0 800 500" preserveAspectRatio="none">
                {/* Corridor Perspective Lines */}
                <line x1="0" y1="0" x2="320" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="800" y1="0" x2="480" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="500" x2="320" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="800" y1="500" x2="480" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                {/* Portal Frame */}
                <rect x="320" y="200" width="160" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="350" y="220" width="100" height="80" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
                {/* Ground grid */}
                <line x1="200" y1="500" x2="350" y2="300" stroke="currentColor" strokeWidth="0.5" />
                <line x1="400" y1="500" x2="400" y2="300" stroke="currentColor" strokeWidth="0.5" />
                <line x1="600" y1="500" x2="450" y2="300" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Central Optical Reticle Crosshair */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
              <div className="relative w-20 h-20 border border-cyan-400/30 rounded-full flex items-center justify-center">
                <div className="w-1 h-3 bg-cyan-400/60 absolute -top-1.5" />
                <div className="w-1 h-3 bg-cyan-400/60 absolute -bottom-1.5" />
                <div className="w-3 h-1 bg-cyan-400/60 absolute -left-1.5" />
                <div className="w-3 h-1 bg-cyan-400/60 absolute -right-1.5" />
                <div className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full" />
              </div>
            </div>

            {/* Sleek Minimalist Person Target Framing (When detected) */}
            {security.personDetected > 0 && (
              <div 
                className="absolute left-[28%] top-[24%] w-[160px] h-[220px] border border-cyan-400/80 bg-cyan-500/10 pointer-events-none z-15 shadow-[0_0_15px_rgba(6,182,212,0.25)] rounded-xs"
              >
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />

                <div className="absolute -top-4 left-0 bg-cyan-500 text-black font-mono font-bold text-[9px] px-1.5 py-0.2 tracking-wider uppercase">
                  PERSON
                </div>
              </div>
            )}

            {/* Sleek Minimalist Weapon Threat Framing (When detected) */}
            {security.firearmDetected > 0 && (
              <div 
                className="absolute right-[24%] top-[38%] w-[120px] h-[100px] border-2 border-red-500 bg-red-600/20 animate-pulse pointer-events-none z-15 shadow-[0_0_20px_rgba(239,68,68,0.5)] rounded-xs"
              >
                <div className="absolute -top-5 left-0 bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.2 tracking-widest uppercase flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>FIREARM</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Minimal Non-Intrusive Bottom Status Strip */}
        <div className="absolute bottom-2 left-3 right-3 z-20 pointer-events-none flex items-center justify-between font-mono text-[9px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">FPS: {security.fps}</span>
            <span>•</span>
            <span className="text-zinc-400">RES: 1080P</span>
          </div>
          <div>
            {currentTime} UTC
          </div>
        </div>

      </div>
    </div>
  );
};
