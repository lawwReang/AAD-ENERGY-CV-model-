import React, { useState } from 'react';
import { 
  Video, 
  Cpu, 
  Eye, 
  Layers, 
  Compass, 
  Activity, 
  Server, 
  Sliders, 
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { SecurityStatus } from '../../types';

interface CameraDetailsPanelProps {
  security: SecurityStatus;
  activeCam?: string;
  onSelectCam?: (camId: string) => void;
  nightVision?: boolean;
  onToggleNightVision?: () => void;
  thermalMode?: boolean;
  onToggleThermalMode?: () => void;
  zoomLevel?: number;
  onCycleZoom?: () => void;
}

export const CameraDetailsPanel: React.FC<CameraDetailsPanelProps> = ({
  security,
  activeCam = 'CAM-01',
  onSelectCam,
  nightVision = false,
  onToggleNightVision,
  thermalMode = false,
  onToggleThermalMode,
  zoomLevel = 1,
  onCycleZoom,
}) => {
  const [isResyncing, setIsResyncing] = useState<boolean>(false);

  const cameras = [
    { id: 'CAM-01', name: 'MAIN ENTRANCE', resolution: '1080p @ 30FPS', location: 'Gate A - Exterior Portal', status: 'ACTIVE' },
    { id: 'CAM-02', name: 'MCB POWER VAULT', resolution: '1080p @ 30FPS', location: 'Basement Vault 03', status: 'ACTIVE' },
    { id: 'CAM-03', name: 'PERIMETER NORTH', resolution: '720p @ 30FPS', location: 'North Fenceline Sector 4', status: 'STANDBY' },
  ];

  const handleResync = () => {
    setIsResyncing(true);
    setTimeout(() => setIsResyncing(false), 600);
  };

  return (
    <div 
      id="camera-technical-details-panel"
      className="bg-[#090d14] border border-zinc-800 rounded-sm p-3.5 space-y-3 font-mono select-none"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-950/40 border border-cyan-500/40 rounded-xs text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-display-tech font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>CAMERA FEED SPECIFICATIONS & OPTICAL CONTROLS</span>
            </div>
            <div className="text-[10px] text-zinc-400">
              Hardware streaming telemetry, PTZ optical configuration, and edge computer vision parameters.
            </div>
          </div>
        </div>

        <button
          id="resync-stream-btn"
          onClick={handleResync}
          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 rounded-xs text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Resynchronize stream buffer"
        >
          <RefreshCw className={`w-3 h-3 ${isResyncing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>RESYNC FEED</span>
        </button>
      </div>

      {/* Row 1: Camera Channel Switcher & Mode Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        
        {/* Camera Selectors */}
        <div className="md:col-span-7 bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-2">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400" />
              SELECT ACTIVE CAMERA FEED CHANNEL
            </span>
            <span className="text-[9px] text-emerald-400">3 CHANNELS ONLINE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {cameras.map((cam) => {
              const isSelected = activeCam === cam.id;
              return (
                <button
                  key={cam.id}
                  id={`select-cam-${cam.id}`}
                  onClick={() => onSelectCam && onSelectCam(cam.id)}
                  className={`p-2 rounded-xs border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-500/60 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>{cam.id}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-500'}`} />
                  </div>
                  <div className="text-[10px] text-white font-semibold mt-0.5 truncate">
                    {cam.name}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate mt-0.5">
                    {cam.resolution}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optical & Sensor Mode Controls */}
        <div className="md:col-span-5 bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-2">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>OPTICAL SENSOR MODES</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-0.5">
            {/* IR Night Vision Toggle */}
            <button
              id="optics-nv-toggle"
              onClick={onToggleNightVision}
              className={`p-2 rounded-xs border text-center transition-all cursor-pointer ${
                nightVision
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="text-[10px] font-bold">IR NV</div>
              <div className="text-[8px] uppercase mt-0.5">{nightVision ? 'ENABLED' : 'OFF'}</div>
            </button>

            {/* Thermal Mode Toggle */}
            <button
              id="optics-thermal-toggle"
              onClick={onToggleThermalMode}
              className={`p-2 rounded-xs border text-center transition-all cursor-pointer ${
                thermalMode
                  ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="text-[10px] font-bold">THERMAL</div>
              <div className="text-[8px] uppercase mt-0.5">{thermalMode ? 'ACTIVE' : 'OFF'}</div>
            </button>

            {/* Zoom Cycle */}
            <button
              id="optics-zoom-toggle"
              onClick={onCycleZoom}
              className="p-2 rounded-xs border bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-center transition-all cursor-pointer"
            >
              <div className="text-[10px] font-bold">ZOOM</div>
              <div className="text-[8px] uppercase text-cyan-400 mt-0.5">{zoomLevel}X OPTICAL</div>
            </button>
          </div>
        </div>

      </div>

      {/* Row 2: Stream Protocol Details & Edge CV Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Stream Telemetry */}
        <div className="bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-1.5">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Server className="w-3 h-3 text-cyan-400" />
            <span>RTSP STREAM SPECS</span>
          </div>
          <div className="space-y-1 text-[10px] pt-1 text-zinc-300">
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">ENDPOINT:</span>
              <span className="text-cyan-300 font-bold">rtsp://192.168.4.12:554/ch1</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">CODEC / BITRATE:</span>
              <span>H.265 (HEVC) • 4.2 Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">LATENCY / FPS:</span>
              <span className="text-emerald-400 font-semibold">33 ms • {security.fps} FPS</span>
            </div>
          </div>
        </div>

        {/* Edge CV Inferencing Details */}
        <div className="bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-1.5">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>EDGE CV INFERENCE ENGINE</span>
          </div>
          <div className="space-y-1 text-[10px] pt-1 text-zinc-300">
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">MODEL ARCH:</span>
              <span className="text-zinc-200">YOLOv8-Safety-INT8</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">INFERENCE SPEED:</span>
              <span className="text-cyan-300">12 ms / frame</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">DETECTION CLASSES:</span>
              <span>Person, Weapon, Fire/Smoke</span>
            </div>
          </div>
        </div>

        {/* Optical Sensor Orientation */}
        <div className="bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-1.5">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>OPTICAL FIELD OF VIEW</span>
          </div>
          <div className="space-y-1 text-[10px] pt-1 text-zinc-300">
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">HORIZONTAL FOV:</span>
              <span className="text-zinc-200">112° Ultra-Wide Lens</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">AZIMUTH ANGLE:</span>
              <span>184° South-Southwest</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">DECLINATION TILT:</span>
              <span>-12° Pitch Down</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
