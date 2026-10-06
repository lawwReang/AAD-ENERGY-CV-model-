import React from "react";
import { SecurityStatus } from "../../types";
import { User, ShieldAlert, Video } from "lucide-react";

interface DetectionHudProps {
  security: SecurityStatus;
}

export const DetectionHud: React.FC<DetectionHudProps> = ({ security }) => {
  const personDetected = security.personDetected > 0;
  const knifeDetected = security.knifeDetected > 0;

  const personConfidence =
    security.personConfidence > 0
      ? `${security.personConfidence.toFixed(1)}%`
      : "--";

  const knifeConfidence =
    security.knifeConfidence > 0
      ? `${security.knifeConfidence.toFixed(1)}%`
      : "--";

  const fps = security.fps > 0 ? `${security.fps} FPS` : "-- FPS";

  return (
    <div
      id="detection-hud"
      className="grid grid-cols-3 gap-2 font-mono select-none"
    >
      {/* Person Telemetry */}
      <div
        className={`p-2.5 border transition-all ${
          personDetected
            ? "bg-cyan-950/20 border-cyan-500/40 text-cyan-300"
            : "bg-[#080d14] border-zinc-800/80 text-zinc-400"
        } rounded-xs`}
      >
        <div className="flex items-center justify-between text-[10px] tracking-wider text-zinc-400 uppercase">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            PERSON
          </span>

          <span className="text-[9px] text-zinc-500">OPTICAL CV</span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-display-tech text-2xl font-bold tracking-tight text-white">
            {String(security.personDetected).padStart(2, "0")}
          </span>

          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-xs ${
              personDetected
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {personDetected ? "DETECTED" : "CLEAR"}
          </span>
        </div>

        <div className="mt-1 text-[9px] text-zinc-500 truncate">
          CONF: {personConfidence}
        </div>
      </div>

      {/* Knife Telemetry */}
      <div
        className={`p-2.5 border transition-all ${
          knifeDetected
            ? "bg-red-950/40 border-red-500 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            : "bg-[#080d14] border-zinc-800/80 text-zinc-400"
        } rounded-xs`}
      >
        <div className="flex items-center justify-between text-[10px] tracking-wider uppercase">
          <span
            className={`flex items-center gap-1.5 font-semibold ${
              knifeDetected ? "text-red-400" : "text-zinc-400"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            KNIFE
          </span>

          <span className="text-[9px] text-zinc-500">WEAPON AI</span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span
            className={`font-display-tech text-2xl font-bold tracking-tight ${
              knifeDetected ? "text-red-400" : "text-white"
            }`}
          >
            {String(security.knifeDetected).padStart(2, "0")}
          </span>

          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-xs ${
              knifeDetected
                ? "bg-red-600 text-white"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {knifeDetected ? "THREAT" : "CLEAR"}
          </span>
        </div>

        <div className="mt-1 text-[9px] text-zinc-500 truncate">
          {knifeDetected
            ? `DETECTION CONF: ${knifeConfidence}`
            : "NO KNIFE DETECTED"}
        </div>
      </div>

      {/* Camera Telemetry */}
      <div className="p-2.5 bg-[#080d14] border border-zinc-800/80 text-zinc-400 rounded-xs">
        <div className="flex items-center justify-between text-[10px] tracking-wider text-zinc-400 uppercase">
          <span className="flex items-center gap-1.5">
            <Video
              className={`w-3.5 h-3.5 ${
                security.cameraStatus === "ONLINE"
                  ? "text-emerald-400"
                  : "text-zinc-500"
              }`}
            />
            CAMERA
          </span>

          <span className="text-[9px] text-zinc-500">
            {security.activeCameraId}
          </span>
        </div>

        <div className="mt-1 flex items-baseline justify-between">
          <span
            className={`font-display-tech text-xl font-bold tracking-wider ${
              security.cameraStatus === "ONLINE"
                ? "text-emerald-400"
                : "text-zinc-500"
            }`}
          >
            {security.cameraStatus}
          </span>

          <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-300 bg-zinc-800/80 px-1.5 py-0.5 border border-zinc-700/60 rounded-xs">
            {fps}
          </span>
        </div>

        <div className="mt-1 text-[9px] text-zinc-500 flex items-center justify-between">
          <span>CV: {security.cvEngineStatus}</span>

          <span
            className={
              security.cameraStatus === "ONLINE"
                ? "text-emerald-500"
                : "text-zinc-600"
            }
          >
            ● STREAM
          </span>
        </div>
      </div>
    </div>
  );
};
