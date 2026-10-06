import React, { useEffect, useRef, useState } from "react";
import { Flame, X, AlertTriangle, Lock } from "lucide-react";

interface ExtinguisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDischarge: () => void;
  correctPin?: string;
}

export const ExtinguisherModal: React.FC<ExtinguisherModalProps> = ({
  isOpen,
  onClose,
  onSuccessDischarge,
  correctPin = "1234",
}) => {
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setErrorMsg(null);
      setIsDeploying(false);
      setCountdown(3);

      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (isDeploying) return;

    if (pin.length < 4) {
      setPin((prev) => prev + digit);
      setErrorMsg(null);
    }
  };

  const handleBackspace = () => {
    if (isDeploying) return;

    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClear = () => {
    if (isDeploying) return;

    setPin("");
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    if (pin.length !== 4) {
      setErrorMsg("ENTER A 4-DIGIT AUTHORIZATION PIN.");
      return;
    }

    if (pin !== correctPin) {
      setErrorMsg("INVALID AUTHORIZATION PIN. ACCESS DENIED.");
      setPin("");
      return;
    }

    setErrorMsg(null);
    setIsDeploying(true);
    setCountdown(3);

    let count = 3;

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count <= 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }

        onSuccessDischarge();
        onClose();
      }
    }, 1000);
  };

  return (
    <div
      id="extinguisher-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div className="relative w-full max-w-md bg-[#0d090c] border-2 border-red-600 rounded-sm p-5 font-mono shadow-[0_0_50px_rgba(239,68,68,0.4)]">
        {/* Close */}
        {!isDeploying && (
          <button
            id="close-extinguisher-modal-btn"
            onClick={onClose}
            className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-xs hover:bg-zinc-800 transition-colors"
            aria-label="Close extinguisher authorization"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-red-900/60 pb-3 mb-4">
          <div className="p-2 bg-red-600 text-white rounded-xs">
            <Flame className="w-6 h-6" />
          </div>

          <div>
            <div className="font-display-tech font-bold text-base text-red-400 tracking-wider uppercase">
              SUPPRESSION ACTIVATION
            </div>

            <div className="text-[10px] text-zinc-400 tracking-wider">
              AUTHORIZED EMERGENCY CONTROL
            </div>
          </div>
        </div>

        {/* Activation countdown */}
        {isDeploying ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center">
              <Flame className="w-10 h-10 text-red-300 animate-pulse" />
            </div>

            <div className="font-display-tech text-3xl font-black text-red-400">
              ACTIVATING IN {countdown}s
            </div>

            <div className="text-xs text-red-200">
              FOLLOW FACILITY EMERGENCY PROCEDURES.
            </div>

            <div className="text-[9px] text-zinc-500 uppercase tracking-wider">
              Control command pending hardware integration
            </div>
          </div>
        ) : (
          <>
            {/* Safety warning */}
            <div className="p-2.5 bg-red-950/40 border border-red-900/80 rounded-xs mb-4 flex items-start gap-2 text-[10px] text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />

              <div>
                <strong>EMERGENCY CONTROL:</strong> Authorization will initiate
                the configured suppression sequence.
                <div className="text-zinc-500 mt-1">
                  Confirm the area is clear and follow applicable safety
                  procedures before activation.
                </div>
              </div>
            </div>

            {/* PIN display */}
            <div className="mb-4">
              <div className="text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                ENTER 4-DIGIT SECURITY PIN
              </div>

              <div
                className={`h-12 bg-black border-2 rounded-xs flex items-center justify-center tracking-[0.5em] text-2xl font-bold font-mono ${
                  errorMsg
                    ? "border-red-600 text-red-400"
                    : "border-zinc-700 text-cyan-400"
                }`}
              >
                {pin.padEnd(4, "•").slice(0, 4)}
              </div>

              {errorMsg && (
                <div className="mt-1 text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 mb-4 font-display-tech">
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "CLR",
                "0",
                "DEL",
              ].map((key) => (
                <button
                  key={key}
                  id={`pin-key-${key.toLowerCase()}`}
                  onClick={() => {
                    if (key === "CLR") {
                      handleClear();
                    } else if (key === "DEL") {
                      handleBackspace();
                    } else {
                      handleKeyPress(key);
                    }
                  }}
                  className="h-11 bg-[#150d12] hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-600 rounded-xs text-sm font-bold tracking-wider transition-colors active:scale-95"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                id="cancel-extinguisher-btn"
                onClick={onClose}
                className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-xs text-xs font-bold uppercase tracking-wider transition-colors"
              >
                ABORT / CANCEL
              </button>

              <button
                id="confirm-extinguisher-btn"
                onClick={handleSubmit}
                disabled={pin.length !== 4}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xs text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                AUTHORIZE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
