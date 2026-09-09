import React from 'react';
import { AlertTriangle, ShieldAlert, Eye, X, Volume2 } from 'lucide-react';

interface CriticalAlertBannerProps {
  title: string;
  location: string;
  confidence?: number;
  details?: string;
  onViewCamera: () => void;
  onDismiss: () => void;
}

export const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({
  title,
  location,
  confidence,
  details,
  onViewCamera,
  onDismiss,
}) => {
  return (
    <div 
      id="critical-alert-banner"
      className="w-full bg-red-600 text-white font-mono px-4 py-3 shadow-[0_0_30px_rgba(239,68,68,0.7)] border-y-2 border-red-400 select-none animate-pulse relative z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Alert Icon & Headline */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black/40 rounded-xs border border-white/40">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-xs tracking-widest uppercase">
                🚨 CRITICAL EVENT
              </span>
              {confidence !== undefined && (
                <span className="text-[10px] bg-red-800 text-white px-2 py-0.5 rounded-xs font-bold">
                  CONFIDENCE: {confidence}%
                </span>
              )}
            </div>
            <div className="font-display-tech font-black text-lg sm:text-xl tracking-wider uppercase mt-0.5">
              {title}
            </div>
            <div className="text-[11px] text-red-100 font-medium tracking-wider">
              ZONE: <span className="text-white font-bold">{location}</span>
              {details && ` • ${details}`}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            id="emergency-view-camera-btn"
            onClick={onViewCamera}
            className="px-3.5 py-1.5 bg-black hover:bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xs border border-white/50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4 text-red-400" />
            VIEW CAMERA
          </button>

          <button
            id="emergency-dismiss-btn"
            onClick={onDismiss}
            className="p-1.5 bg-red-800 hover:bg-red-900 text-white rounded-xs border border-red-400 transition-colors"
            title="Acknowledge & Dismiss Banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
