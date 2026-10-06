import React from "react";
import { SystemHealthItem } from "../../types";
import { ShieldCheck, Info } from "lucide-react";

interface SystemHealthStripProps {
  items: SystemHealthItem[];
}

export const SystemHealthStrip: React.FC<SystemHealthStripProps> = ({
  items,
}) => {
  return (
    <footer
      id="system-health-strip"
      className="bg-[#070b10] border-t border-zinc-800/90 px-3 py-1.5 text-xs select-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="font-mono-tech text-[10px] tracking-widest text-zinc-400 font-bold uppercase border-r border-zinc-800 pr-3">
            SYSTEM HEALTH
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-zinc-500">
            <Info className="w-3 h-3" />
            PROTOTYPE DEMO MODE — LIVE IOT BUS AWAITING FIELD GATEWAY
          </span>
        </div>

        {/* Health status nodes */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono">
          {items.map((item) => {
            let dotColor = "bg-zinc-500";
            let textColor = "text-zinc-400";

            if (item.status === "CONNECTED") {
              dotColor = "bg-emerald-400";
              textColor = "text-emerald-400";
            } else if (item.status === "STANDBY") {
              dotColor = "bg-cyan-400";
              textColor = "text-cyan-400";
            } else if (item.status === "WAITING FOR IOT") {
              dotColor = "bg-amber-400 animate-pulse";
              textColor = "text-amber-400";
            } else if (item.status === "NOT CONNECTED") {
              dotColor = "bg-zinc-500";
              textColor = "text-zinc-400";
            }

            return (
              <div
                key={item.id}
                className="flex items-center gap-1.5"
                title={`${item.name}: ${item.status} (${item.note})`}
              >
                <span className="text-zinc-500 uppercase tracking-wider font-semibold">
                  {item.name}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                <span
                  className={`tracking-wider ${textColor} uppercase text-[9px]`}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Status code badge */}
        <div className="hidden lg:flex items-center gap-2 text-[9px] font-mono text-zinc-500">
          <span>
            REV:{" "}
            <span className="text-zinc-400">SMART-MCB-PROTOTYPE</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
