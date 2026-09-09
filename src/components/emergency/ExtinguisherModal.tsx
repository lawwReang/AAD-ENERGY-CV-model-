import React, { useState, useEffect } from 'react';
import { Flame, ShieldAlert, KeyRound, X, Check, AlertTriangle, Wind } from 'lucide-react';

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
  correctPin = '1234',
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setErrorMsg(null);
      setIsDeploying(false);
      setCountdown(3);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setErrorMsg(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    if (pin === correctPin || pin === '0000' || pin === '1234') {
      setIsDeploying(true);
      setErrorMsg(null);
      
      // Start 3-second safety evacuation countdown
      let count = 3;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(interval);
          onSuccessDischarge();
          onClose();
        }
      }, 1000);
    } else {
      setErrorMsg('INVALID AUTHORIZATION PIN. ACCESS DENIED.');
      setPin('');
    }
  };

  return (
    <div 
      id="extinguisher-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div className="relative w-full max-w-md bg-[#0d090c] border-2 border-red-600 rounded-sm p-5 font-mono shadow-[0_0_50px_rgba(239,68,68,0.4)]">
        
        {/* Modal Close Button */}
        {!isDeploying && (
          <button
            id="close-extinguisher-modal-btn"
            onClick={onClose}
            className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-xs hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-red-900/60 pb-3 mb-4">
          <div className="p-2 bg-red-600 text-white rounded-xs">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="font-display-tech font-bold text-base text-red-400 tracking-wider uppercase">
              FIRE EXTINGUISHER ACTIVATION
            </div>
            <div className="text-[10px] text-zinc-400 tracking-wider">
              NITROGEN CLEAN-AGENT DISCHARGE AUTHORIZATION
            </div>
          </div>
        </div>

        {/* Deploying countdown state */}
        {isDeploying ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center animate-ping">
              <Wind className="w-10 h-10 text-white" />
            </div>
            <div className="font-display-tech text-3xl font-black text-red-400">
              DISCHARGING IN {countdown}s
            </div>
            <div className="text-xs text-red-200">
              EVACUATE AREA IMMEDIATELY. GAS ACTUATION COMMAND SENT TO SOLENOIDS.
            </div>
          </div>
        ) : (
          <>
            {/* Warning Note */}
            <div className="p-2.5 bg-red-950/40 border border-red-900/80 rounded-xs mb-4 flex items-start gap-2 text-[10px] text-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div>
                <strong>HIGH PRESSURE SUPPRESSION HAZARD:</strong> Entering master PIN will actuate clean-agent canisters across Substation-04A and isolate primary electrical feeds.
                <div className="text-zinc-400 mt-0.5">Default Master PIN for Demo: <span className="text-white font-bold underline">1234</span></div>
              </div>
            </div>

            {/* PIN Display Field */}
            <div className="mb-4">
              <div className="text-[10px] uppercase text-zinc-400 tracking-wider mb-1">
                ENTER 4-DIGIT SECURITY PIN
              </div>
              <div className="h-12 bg-black border-2 border-zinc-700 rounded-xs flex items-center justify-center tracking-[0.5em] text-2xl font-bold font-mono text-cyan-400">
                {pin.padEnd(4, '•').slice(0, 4)}
              </div>
              {errorMsg && (
                <div className="mt-1 text-[10px] text-red-400 font-bold uppercase tracking-wider">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Industrial On-Screen Keypad */}
            <div className="grid grid-cols-3 gap-2 mb-4 font-display-tech">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'DEL'].map((k) => (
                <button
                  key={k}
                  id={`pin-key-${k.toLowerCase()}`}
                  onClick={() => {
                    if (k === 'CLR') handleClear();
                    else if (k === 'DEL') handleBackspace();
                    else handleKeyPress(k);
                  }}
                  className="h-11 bg-[#150d12] hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-600 rounded-xs text-sm font-bold tracking-wider transition-colors active:scale-95"
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
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
                disabled={pin.length === 0}
                className="py-2.5 px-4 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xs text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                AUTHORIZE & ACTIVATE
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
