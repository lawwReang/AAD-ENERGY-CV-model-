import React, { useState } from "react";
import { AlertEvent } from "../../types";
import { Bell, Check, Trash2 } from "lucide-react";

interface AlertStreamProps {
  events: AlertEvent[];
  onAcknowledge?: (id: string) => void;
  onClearAcknowledged?: () => void;
}

type AlertFilter = "ALL" | "CRITICAL" | "WARNING" | "SECURITY";

export const AlertStream: React.FC<AlertStreamProps> = ({
  events,
  onAcknowledge,
  onClearAcknowledged,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<AlertFilter>("ALL");

  const filteredEvents = events.filter((event) => {
    switch (filterSeverity) {
      case "CRITICAL":
        return event.severity === "CRITICAL";

      case "WARNING":
        return event.severity === "WARNING";

      case "SECURITY":
        return event.category === "SECURITY";

      case "ALL":
      default:
        return true;
    }
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
              SYSTEM EVENT & ALERT LOG
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 text-[9px]">
          {(["ALL", "CRITICAL", "WARNING", "SECURITY"] as AlertFilter[]).map(
            (filter) => (
              <button
                key={filter}
                id={`filter-stream-${filter.toLowerCase()}`}
                onClick={() => setFilterSeverity(filter)}
                className={`px-1.5 py-0.5 rounded-xs uppercase tracking-wider font-semibold border transition-colors ${
                  filterSeverity === filter
                    ? "bg-zinc-800 text-white border-zinc-600"
                    : "bg-zinc-950 text-zinc-500 border-zinc-850 hover:text-zinc-300"
                }`}
              >
                {filter}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Event Feed */}
      <div className="flex-1 overflow-y-auto max-h-[380px] pr-1 space-y-2.5">
        {filteredEvents.length === 0 ? (
          <div className="py-10 text-center">
            <Bell className="w-5 h-5 text-zinc-700 mx-auto mb-2" />

            <div className="text-zinc-600 text-xs font-mono">
              NO EVENTS IN STREAM
            </div>

            <div className="text-zinc-700 text-[9px] font-mono mt-1 tracking-wider">
              WAITING FOR SYSTEM TELEMETRY
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isCritical = event.severity === "CRITICAL";

            const isWarning = event.severity === "WARNING";

            const isSuccess = event.severity === "SUCCESS";

            return (
              <div
                key={event.id}
                id={`event-item-${event.id}`}
                className={`relative pl-4 pr-2.5 py-2 rounded-xs border text-xs transition-all ${
                  isCritical
                    ? "bg-red-950/40 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                    : isWarning
                      ? "bg-amber-950/20 border-amber-500/50"
                      : "bg-[#05080c] border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                {/* Severity Indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xs ${
                    isCritical
                      ? "bg-red-500 shadow-[0_0_8px_#ef4444]"
                      : isWarning
                        ? "bg-amber-400"
                        : isSuccess
                          ? "bg-emerald-400"
                          : "bg-zinc-700"
                  }`}
                />

                {/* Event Metadata */}
                <div className="flex items-baseline justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-cyan-400 font-bold tracking-widest tabular-nums shrink-0">
                      {event.timestamp}
                    </span>

                    <span
                      className={`px-1.5 py-0.2 font-semibold uppercase tracking-wider rounded-xs border text-[8px] ${
                        event.category === "SECURITY"
                          ? "bg-purple-950/60 text-purple-300 border-purple-500/40"
                          : event.category === "SENSOR"
                            ? "bg-cyan-950/60 text-cyan-300 border-cyan-500/40"
                            : event.category === "MCB"
                              ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
                              : event.category === "EMERGENCY"
                                ? "bg-red-950 text-red-300 border-red-500"
                                : "bg-zinc-900 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {event.category}
                    </span>
                  </div>

                  {/* Acknowledge */}
                  {event.acknowledged ? (
                    <span className="text-[8px] text-zinc-500 flex items-center gap-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                      ACK
                    </span>
                  ) : onAcknowledge ? (
                    <button
                      id={`ack-event-${event.id}`}
                      onClick={() => onAcknowledge(event.id)}
                      className="text-[8px] text-zinc-400 hover:text-white uppercase underline shrink-0"
                    >
                      ACKNOWLEDGE
                    </button>
                  ) : null}
                </div>

                {/* Event Message */}
                <div
                  className={`mt-1 font-mono text-[11px] leading-relaxed ${
                    isCritical ? "text-red-200 font-semibold" : "text-zinc-300"
                  }`}
                >
                  {event.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
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
