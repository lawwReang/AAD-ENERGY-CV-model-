import React, { useState } from "react";
import {
  Video,
  Cpu,
  Eye,
  Compass,
  Server,
  Sliders,
  RefreshCw,
  Radio,
} from "lucide-react";
import { SecurityStatus } from "../../types";

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
  activeCam = "CAM-01",
  onSelectCam,
  nightVision = false,
  onToggleNightVision,
  thermalMode = false,
  onToggleThermalMode,
  zoomLevel = 1,
  onCycleZoom,
}) => {
  const [isResyncing, setIsResyncing] = useState(false);

  const cameraOnline = security.cameraStatus === "ONLINE";

  const cameras = [
    {
      id: "CAM-01",
      name: "PRIMARY CAMERA",
      location: "Camera stream pending",
    },
  ];

  const handleResync = () => {
    setIsResyncing(true);

    /*
     * Temporary UI feedback.
     * Later this will trigger an actual camera/CV stream reconnect.
     */
    setTimeout(() => {
      setIsResyncing(false);
    }, 600);
  };

  const fps = security.fps > 0 ? `${security.fps} FPS` : "--";

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
            <div className="text-xs font-display-tech font-bold text-white uppercase tracking-wider">
              CAMERA & CV CONTROLS
            </div>

            <div className="text-[10px] text-zinc-400">
              Camera controls and computer vision service status.
            </div>
          </div>
        </div>

        <button
          id="resync-stream-btn"
          onClick={handleResync}
          className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 rounded-xs text-[10px] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reconnect camera stream"
        >
          <RefreshCw
            className={`w-3 h-3 ${
              isResyncing ? "animate-spin text-cyan-400" : ""
            }`}
          />

          <span>RESYNC FEED</span>
        </button>
      </div>

      {/* Camera Channel & Mode Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Camera Selector */}
        <div className="md:col-span-7 bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-2">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400" />
              CAMERA CHANNEL
            </span>

            <span
              className={cameraOnline ? "text-emerald-400" : "text-zinc-600"}
            >
              {cameraOnline ? "ONLINE" : "WAITING FOR CAMERA"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {cameras.map((cam) => {
              const isSelected = activeCam === cam.id;

              return (
                <button
                  key={cam.id}
                  id={`select-cam-${cam.id}`}
                  onClick={() => onSelectCam?.(cam.id)}
                  className={`p-2 rounded-xs border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-950/30 border-cyan-500/60 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span>{cam.id}</span>

                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        cameraOnline
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-zinc-600"
                      }`}
                    />
                  </div>

                  <div className="text-[10px] text-white font-semibold mt-0.5 truncate">
                    {cam.name}
                  </div>

                  <div className="text-[9px] text-zinc-500 truncate mt-0.5">
                    {cam.location}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Camera Controls */}
        <div className="md:col-span-5 bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-2">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>CAMERA CONTROLS</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-0.5">
            {/* Night Vision */}
            <button
              id="optics-nv-toggle"
              onClick={onToggleNightVision}
              className={`p-2 rounded-xs border text-center transition-all cursor-pointer ${
                nightVision
                  ? "bg-emerald-950/40 border-emerald-500 text-emerald-300"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="text-[10px] font-bold">IR NV</div>

              <div className="text-[8px] uppercase mt-0.5">
                {nightVision ? "ENABLED" : "OFF"}
              </div>
            </button>

            {/* Thermal */}
            <button
              id="optics-thermal-toggle"
              onClick={onToggleThermalMode}
              className={`p-2 rounded-xs border text-center transition-all cursor-pointer ${
                thermalMode
                  ? "bg-amber-950/40 border-amber-500 text-amber-300"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="text-[10px] font-bold">THERMAL</div>

              <div className="text-[8px] uppercase mt-0.5">
                {thermalMode ? "ACTIVE" : "OFF"}
              </div>
            </button>

            {/* Zoom */}
            <button
              id="optics-zoom-toggle"
              onClick={onCycleZoom}
              className="p-2 rounded-xs border bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-center transition-all cursor-pointer"
            >
              <div className="text-[10px] font-bold">ZOOM</div>

              <div className="text-[8px] uppercase text-cyan-400 mt-0.5">
                {zoomLevel}X
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Camera / CV Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Camera Stream Status */}
        <div className="bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-1.5">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Server className="w-3 h-3 text-cyan-400" />
            <span>CAMERA STREAM</span>
          </div>

          <div className="space-y-1 text-[10px] pt-1 text-zinc-300">
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">CAMERA:</span>

              <span className="text-cyan-300 font-bold">
                {security.activeCameraId}
              </span>
            </div>

            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">STATUS:</span>

              <span
                className={
                  cameraOnline
                    ? "text-emerald-400 font-semibold"
                    : "text-zinc-500"
                }
              >
                {security.cameraStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">FRAME RATE:</span>

              <span>{fps}</span>
            </div>
          </div>
        </div>

        {/* CV Engine */}
        <div className="bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs space-y-1.5">
          <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>COMPUTER VISION ENGINE</span>
          </div>

          <div className="space-y-1 text-[10px] pt-1 text-zinc-300">
            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">MODEL:</span>

              <span className="text-zinc-200">YOLOv8n</span>
            </div>

            <div className="flex justify-between border-b border-zinc-800/60 pb-1">
              <span className="text-zinc-500">ENGINE:</span>

              <span className="text-zinc-200">{security.cvEngineStatus}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">CLASSES:</span>

              <span>Person, Knife</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optical Information */}
      <div className="bg-[#05080c] border border-zinc-800/80 p-2.5 rounded-xs">
        <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5 mb-2">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span>OPTICAL INFORMATION</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[9px]">
          <div className="border border-zinc-800/70 p-2 rounded-xs">
            <div className="text-zinc-600 uppercase">FIELD OF VIEW</div>

            <div className="text-zinc-400 mt-1">NOT CONFIGURED</div>
          </div>

          <div className="border border-zinc-800/70 p-2 rounded-xs">
            <div className="text-zinc-600 uppercase">ORIENTATION</div>

            <div className="text-zinc-400 mt-1">NOT CONFIGURED</div>
          </div>

          <div className="border border-zinc-800/70 p-2 rounded-xs">
            <div className="text-zinc-600 uppercase">OPTICAL PROFILE</div>

            <div className="text-zinc-400 mt-1">CAMERA DEPENDENT</div>
          </div>
        </div>
      </div>
    </div>
  );
};
