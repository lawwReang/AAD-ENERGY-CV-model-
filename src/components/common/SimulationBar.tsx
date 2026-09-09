import React from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldAlert, Flame, Wind, UserCheck } from 'lucide-react';

export type DemoScenario = 'NOMINAL' | 'INTRUDER' | 'GAS_LEAK' | 'FIRE_OUTBREAK' | 'FIREARM_DETECTED';

interface SimulationBarProps {
  activeScenario: DemoScenario;
  onSelectScenario: (scenario: DemoScenario) => void;
  onReset: () => void;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  activeScenario,
  onSelectScenario,
  onReset,
}) => {
  const scenarios = [
    { 
      id: 'NOMINAL' as DemoScenario, 
      label: 'NOMINAL STATUS', 
      icon: UserCheck, 
      color: 'text-emerald-400' 
    },
    { 
      id: 'INTRUDER' as DemoScenario, 
      label: 'INTRUDER ALERT', 
      icon: ShieldAlert, 
      color: 'text-amber-400' 
    },
    { 
      id: 'GAS_LEAK' as DemoScenario, 
      label: 'GAS LEAK HAZARD', 
      icon: Wind, 
      color: 'text-orange-400' 
    },
    { 
      id: 'FIRE_OUTBREAK' as DemoScenario, 
      label: 'FIRE OUTBREAK', 
      icon: Flame, 
      color: 'text-red-400' 
    },
    { 
      id: 'FIREARM_DETECTED' as DemoScenario, 
      label: 'WEAPON DETECTED', 
      icon: AlertTriangle, 
      color: 'text-red-500' 
    },
  ];

  return (
    <div 
      id="simulation-control-bar"
      className="bg-[#05080c] border-b border-zinc-800/80 px-3 py-1.5 font-mono text-xs select-none"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-500/30 px-1.5 py-0.5 rounded-xs">
            DEMO SCENARIO SIMULATOR
          </span>
          <span className="text-[9px] text-zinc-400 hidden sm:inline">
            SELECT CONDITION TO TEST REAL-TIME ACTUATION & EMERGENCY PROTOCOLS
          </span>
        </div>

        {/* Buttons for each scenario */}
        <div className="flex flex-wrap items-center gap-1.5">
          {scenarios.map((s) => {
            const isActive = activeScenario === s.id;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                id={`scenario-btn-${s.id.toLowerCase()}`}
                onClick={() => onSelectScenario(s.id)}
                className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs border flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white border-zinc-500 shadow-[0_0_8px_rgba(255,255,255,0.15)]'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border-zinc-850'
                }`}
              >
                <Icon className={`w-3 h-3 ${s.color}`} />
                <span>{s.label}</span>
              </button>
            );
          })}

          <button
            id="reset-simulation-btn"
            onClick={onReset}
            className="ml-1 p-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-750 rounded-xs transition-colors"
            title="Reset to Baseline Nominal"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
