import React, { useEffect, useRef, useState } from "react";
import { AlertOctagon, Flame, Lock } from "lucide-react";

interface EmergencyControlPanelProps {
  onTriggerSos: () => void;
  onOpenExtinguisherModal?: () => void;
  isEmergencyActive: boolean;
  extinguisherDischarged?: boolean;
  showExtinguisher?: boolean;
  showSos?: boolean;
}

export const EmergencyControlPanel: React.FC<EmergencyControlPanelProps> = ({
  onTriggerSos,
  onOpenExtinguisherModal,
  isEmergencyActive,
  extinguisherDischarged = false,
  showExtinguisher = true,
  showSos = true,
}) => {
  const [sosHolding, setSosHolding] = useState(false);
  const [sosHoldProgress, setSosHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    if (sosHolding) return;

    setSosHolding(true);
    setSosHoldProgress(0);

    let progress = 0;

    holdTimerRef.current = setInterval(() => {
      progress += 10;
      setSosHoldProgress(progress);

      if (progress >= 100) {
        if (holdTimerRef.current) {
          clearInterval(holdTimerRef.current);
          holdTimerRef.current = null;
        }

        setSosHolding(false);
        setSosHoldProgress(0);
        onTriggerSos();
      }
    }, 100);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    setSosHolding(false);
    setSosHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      id="emergency-control-panel"
      className="bg-[#0b080b] border-2 border-red-950/80 rounded-sm p-3.5 font-mono select-none"
    >
      {/* Emergency Header */}
      <div className="flex items-center justify-between border-b border-red-950/60 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-red-950/80 border border-red-600/60 text-red-400 rounded-xs">
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>

          <div>
            <div className="font-display-tech font-bold text-xs tracking-widest text-red-300 uppercase">
              EMERGENCY CONTROL
            </div>

            <div className="text-[9px] text-zinc-400 tracking-wider">
              {isEmergencyActive
                ? "CRITICAL CONDITION ACTIVE"
                : "MANUAL CONTROLS READY"}
            </div>
          </div>
        </div>

        <span className="text-[8px] bg-red-950/60 text-red-400 border border-red-800/60 px-1.5 py-0.5 rounded-xs tracking-wider">
          EMERGENCY INTERFACE
        </span>
      </div>

      {/* Controls */}
      <div
        className={`grid ${
          showSos && showExtinguisher
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1"
        } gap-3`}
      >
        {/* MANUAL SOS */}
        {showSos && (
          <div className="flex flex-col items-center justify-center p-3 bg-[#130709] border border-red-900/60 rounded-xs relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,transparent_10px,transparent_20px)]" />

            <div className="text-[9px] font-bold text-red-400 tracking-widest uppercase mb-1.5 flex items-center gap-1.5">
              <AlertOctagon className="w-3 h-3 text-red-400" />
              <span>MANUAL SYSTEM SOS</span>
            </div>

            <button
              id="physical-sos-btn"
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={startHold}
              onTouchEnd={cancelHold}
              className="relative w-24 h-24 rounded-full bg-gradient-to-b from-red-600 to-red-800 border-4 border-red-950 shadow-[0_8px_0_#450a0a,0_12px_20px_rgba(239,68,68,0.4)] active:translate-y-1 active:shadow-[0_4px_0_#450a0a] transition-all flex flex-col items-center justify-center text-white cursor-pointer select-none my-1"
              title="Press and hold for 1 second to trigger the emergency override"
              aria-label="Hold to trigger emergency SOS"
            >
              <span className="font-display-tech font-black text-xl tracking-widest leading-none drop-shadow-md">
                SOS
              </span>

              <span className="text-[8px] tracking-widest font-mono uppercase mt-1 opacity-90">
                {sosHolding ? `${sosHoldProgress}%` : "HOLD"}
              </span>

              {sosHolding && (
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                  viewBox="0 0 96 96"
                >
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={
                      2 * Math.PI * 40 * (1 - sosHoldProgress / 100)
                    }
                    className="text-white"
                  />
                </svg>
              )}
            </button>

            <div className="mt-1.5 text-center">
              <div className="text-[9px] font-bold text-red-300 tracking-widest uppercase">
                MANUAL OVERRIDE
              </div>

              <div className="text-[8px] text-zinc-500 uppercase tracking-widest">
                HOLD TO ACTIVATE
              </div>
            </div>
          </div>
        )}

        {/* EXTINGUISHER CONTROL */}
        {showExtinguisher && (
          <div className="flex flex-col items-center justify-between p-3 bg-[#130709] border border-red-900/60 rounded-xs relative overflow-hidden">
            <div className="text-[9px] font-bold text-orange-400 tracking-widest uppercase mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>EXTINGUISHER ACTUATION</span>
            </div>

            <div className="text-[8px] text-zinc-400 text-center mb-2 px-1">
              EMERGENCY SUPPRESSION CONTROL
            </div>

            <button
              id="fire-extinguisher-actuate-btn"
              onClick={onOpenExtinguisherModal}
              disabled={extinguisherDischarged || !onOpenExtinguisherModal}
              className={`w-full py-2.5 px-3 rounded-xs font-mono font-bold text-xs uppercase tracking-wider border transition-all flex items-center justify-center gap-2 shadow-sm ${
                extinguisherDischarged || !onOpenExtinguisherModal
                  ? "bg-zinc-800 text-zinc-400 border-zinc-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />

              <span>
                {extinguisherDischarged ? "DISCHARGED" : "DEPLOY EXTINGUISHER"}
              </span>
            </button>

            <div className="mt-2 text-center text-[8px] text-zinc-500 uppercase tracking-wider">
              {extinguisherDischarged
                ? "ACTUATOR STATUS: DISCHARGED"
                : "ACTUATION REQUIRES AUTHORIZATION"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
