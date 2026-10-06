import React from "react";
import { Video, AlertTriangle } from "lucide-react";
import { SecurityStatus } from "../../types";
const CAMERA_STREAM_URL = "http://127.0.0.1:8000/api/security/video";

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
  currentTime = "--:--:--",
  isEmergencyActive = false,
  activeCam = "CAM-01",
  nightVision = false,
  thermalMode = false,
  zoomLevel = 1,
}) => {
  const cameraOnline = security.cameraStatus === "ONLINE";

 

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

      {/* Header */}
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

        {/* Camera Status */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-xs border ${
              cameraOnline
                ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                : "bg-zinc-950 border-zinc-800 text-zinc-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                cameraOnline ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
              }`}
            />

            <span className="font-bold tracking-widest">
              {cameraOnline ? "LIVE" : "STANDBY"}
            </span>
          </div>

          {isEmergencyActive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-950/40 border border-red-500/40 rounded-xs text-red-400 font-bold tracking-wider">
              <AlertTriangle className="w-2.5 h-2.5" />
              ALERT
            </div>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div
        className={`relative w-full aspect-video min-h-[280px] sm:min-h-[360px] md:min-h-[420px] flex items-center justify-center overflow-hidden transition-all duration-300 ${
          thermalMode
            ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-amber-950"
            : nightVision
              ? "bg-[#021808]"
              : "bg-[#03060a]"
        }`}
      >
        {/* 
          CAMERA FEED PLACEHOLDER

          This area is intentionally empty until the real
          OpenCV / YOLO camera pipeline is connected.

          Later this will become something like:

          <img src={cameraStreamUrl} ... />

          or a video/WebSocket stream.
        */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* REAL CAMERA STREAM */}
          <img
            src={CAMERA_STREAM_URL}
            alt="Smart MCB live security camera"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="relative w-full h-full flex items-center justify-center">
            {/* Technical Grid */}
            <div
              className={`absolute inset-0 bg-tech-grid opacity-25 pointer-events-none ${
                nightVision ? "filter sepia hue-rotate-90" : ""
              }`}
            />

            {/* Camera Standby State */}
            {!cameraOnline && (
              <div className="absolute inset-0 z-30 bg-[#03060a]/80 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 border border-zinc-700 rounded-sm flex items-center justify-center mb-4">
                  <Video className="w-6 h-6 text-zinc-600" />
                </div>

                <div className="font-display-tech text-sm tracking-[0.2em] text-zinc-500 uppercase">
                  CAMERA STANDBY
                </div>

                <div className="font-mono text-[9px] tracking-wider text-zinc-700 mt-2 uppercase">
                  Waiting for CV camera stream
                </div>
              </div>
            )}

            {/* Real Detection Overlay Placeholder */}
            {cameraOnline && (
              <>
              

               
              </>
            )}

            {/* Optical Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
              <div className="relative w-20 h-20 border border-cyan-400/30 rounded-full flex items-center justify-center">
                <div className="w-1 h-3 bg-cyan-400/60 absolute -top-1.5" />
                <div className="w-1 h-3 bg-cyan-400/60 absolute -bottom-1.5" />
                <div className="w-3 h-1 bg-cyan-400/60 absolute -left-1.5" />
                <div className="w-3 h-1 bg-cyan-400/60 absolute -right-1.5" />
                <div className="w-1.5 h-1.5 bg-cyan-400/80 rounded-full" />
              </div>
            </div>

            {/* Scan Effects */}
            {cameraOnline && (
              <>
                <div className="camera-scan-beam" />
                <div className="camera-scan-halo" />
              </>
            )}

            {/* Scanline Filter */}
            <div className="absolute inset-0 surveillance-scanline pointer-events-none z-10" />
          </div>
        </div>

        {/* Bottom Status Strip */}
        <div className="absolute bottom-2 left-3 right-3 z-20 pointer-events-none flex items-center justify-between font-mono text-[9px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">
              FPS: {cameraOnline && security.fps > 0 ? security.fps : "--"}
            </span>

            <span>•</span>

            <span className="text-zinc-400">
              RES: {cameraOnline ? "LIVE" : "--"}
            </span>
          </div>

          <div>
            {currentTime !== "--:--:--" ? `${currentTime} UTC` : "--:--:--"}
          </div>
        </div>
      </div>
    </div>
  );
};