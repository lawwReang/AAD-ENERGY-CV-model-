import React, { useState } from 'react';
import { AlertEvent, AlertSeverity } from '../../types';
import { 
  Bell, 
  Check, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Filter, 
  Trash2 
} from 'lucide-react';

interface AlertStreamProps {
  events: AlertEvent[];
  onAcknowledge?: (id: string) => void;
  onClearAcknowledged?: () => void;
}

export const AlertStream: React.FC<AlertStreamProps> = ({
  events,
  onAcknowledge,
  onClearAcknowledged,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredEvents = events.filter((evt) => {
    if (filterSeverity === 'ALL') return true;
    if (filterSeverity === 'CRITICAL') return evt.severity === 'CRITICAL';
    if (filterSeverity === 'WARNING') return evt.severity === 'WARNING';
    if (filterSeverity === 'SECURITY') return evt.category === 'SECURITY';
    return true;
  });

  return (
    <div 
      id="alert-stream-container"
      className="bg-[#080d14] border border-zinc-800/90 rounded-sm p-3.5 font-mono select-none flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-amber-950/40 border border-amber-500/40 text-amber-400 rounded-xs">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-display-tech font-bold text-sm tracking-wider text-white uppercase">
              EVENT STREAM
            </div>
            <div className="text-[9px] text-zinc-500 tracking-wider">
              CHRONOLOGICAL AUDIT & EVENT DISPATCH LOG
            </div>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 text-[9px]">
          {['ALL', 'CRITICAL', 'WARNING', 'SECURITY'].map((f) => (
            <button
              key={f}
              id={`filter-stream-${f.toLowerCase()}`}
              onClick={() => setFilterSeverity(f)}
              className={`px-1.5 py-0.5 rounded-xs uppercase tracking-wider font-semibold border transition-colors ${
                filterSeverity === f
                  ? 'bg-zinc-800 text-white border-zinc-600'
                  : 'bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline Event Feed */}
      <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-2.5">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-zinc-600 text-xs font-mono">
            NO TELEMETRY EVENTS IN STREAM
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isCritical = evt.severity === 'CRITICAL';
            const isWarning = evt.severity === 'WARNING';
            const isSuccess = evt.severity === 'SUCCESS';

            return (
              <div
                key={evt.id}
                id={`event-item-${evt.id}`}
                className={`relative pl-4 pr-2.5 py-2 rounded-xs border text-xs transition-all ${
                  isCritical
                    ? 'bg-red-950/40 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-500/50'
                    : 'bg-[#05080c] border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Vertical timeline connector notch */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xs ${
                    isCritical 
                      ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' 
                      : isWarning 
                      ? 'bg-amber-400' 
                      : isSuccess 
                      ? 'bg-emerald-400' 
                      : 'bg-zinc-700'
                  }`}
                />

                <div className="flex items-baseline justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold tracking-widest tabular-nums">
                      {evt.timestamp}
                    </span>
                    <span className={`px-1.5 py-0.2 font-semibold uppercase tracking-wider rounded-xs border text-[8px] ${
                      evt.category === 'SECURITY'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-500/40'
                        : evt.category === 'SENSOR'
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                        : evt.category === 'MCB'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : evt.category === 'EMERGENCY'
                        ? 'bg-red-950 text-red-300 border-red-500'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                    }`}>
                      {evt.category}
                    </span>
                  </div>

                  {evt.acknowledged ? (
                    <span className="text-[8px] text-zinc-500 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                      ACK
                    </span>
                  ) : onAcknowledge ? (
                    <button
                      id={`ack-event-${evt.id}`}
                      onClick={() => onAcknowledge(evt.id)}
                      className="text-[8px] text-zinc-400 hover:text-white uppercase underline"
                    >
                      ACKNOWLEDGE
                    </button>
                  ) : null}
                </div>

                {/* Event Message */}
                <div className={`mt-1 font-mono text-[11px] leading-relaxed ${
                  isCritical ? 'text-red-200 font-semibold' : 'text-zinc-300'
                }`}>
                  {evt.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer count & clear acknowledged */}
      <div className="mt-2.5 pt-2 border-t border-zinc-850 flex items-center justify-between text-[9px] text-zinc-500">
        <span>LOGGED ENTRIES: {filteredEvents.length}</span>
        {onClearAcknowledged && (
          <button
            onClick={onClearAcknowledged}
            className="text-zinc-500 hover:text-zinc-300 uppercase tracking-wider flex items-center gap-1"
          >
            <Trash2 className="w-2.5 h-2.5" />
            CLEAR ACKNOWLEDGED
          </button>
        )}
      </div>
    </div>
  );
};
