import React from 'react';
import { 
  Home, 
  Thermometer, 
  ShieldAlert, 
  AlertOctagon, 
  Cpu, 
  Zap,
  Clock, 
  Settings,
  Sparkles
} from 'lucide-react';

export type NavSection = 'overview' | 'environment' | 'security' | 'alerts' | 'devices' | 'power' | 'history' | 'settings';

interface LeftNavigationProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  unreadAlertCount: number;
  systemHealthPercent?: number;
}

export const LeftNavigation: React.FC<LeftNavigationProps> = ({
  activeSection,
  onSelectSection,
  unreadAlertCount,
  systemHealthPercent = 99.8,
}) => {
  const navItems = [
    { id: 'overview' as NavSection, label: 'Overview', icon: Home, symbol: '⌂' },
    { id: 'environment' as NavSection, label: 'Environment', icon: Thermometer, symbol: '◉' },
    { id: 'security' as NavSection, label: 'Security', icon: ShieldAlert, symbol: '◉' },
    { 
      id: 'alerts' as NavSection, 
      label: 'Alerts', 
      icon: AlertOctagon, 
      symbol: '⚠',
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined 
    },
    { id: 'devices' as NavSection, label: 'Devices', icon: Cpu, symbol: '▣' },
    { id: 'power' as NavSection, label: 'Power', icon: Zap, symbol: '⚡' },
    { id: 'history' as NavSection, label: 'History', icon: Clock, symbol: '◷' },
  ];

  return (
    <aside 
      id="left-command-nav"
      className="w-16 md:w-44 lg:w-48 bg-[#090d14] border-r border-zinc-800/80 flex flex-col justify-between select-none py-3"
    >
      {/* Top Nav List */}
      <div className="space-y-1">
        <div className="px-3 pb-2 mb-1 border-b border-zinc-850 hidden md:block">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            SYSTEM NAVIGATION
          </span>
        </div>

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              className={`w-full relative flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-mono transition-all group ${
                isActive 
                  ? 'text-cyan-300 font-semibold bg-zinc-850/50' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/30'
              }`}
            >
              {/* Thin accent line for active item as requested */}
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-[2.5px] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              )}

              <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
              }`} />

              <span className="hidden md:inline tracking-wider uppercase text-[11px] truncate">
                {item.label}
              </span>

              {item.badge !== undefined && (
                <span className="ml-auto hidden md:inline-flex items-center justify-center px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xs">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Health Metric */}
      <div className="px-3 pt-3 border-t border-zinc-850">
        <div 
          onClick={() => onSelectSection('overview')}
          className="cursor-pointer group p-2 bg-zinc-900/60 border border-zinc-800/80 rounded-xs hover:border-zinc-700 transition-colors"
        >
          <div className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase leading-tight">
            SYSTEM
          </div>
          <div className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase leading-tight">
            HEALTH
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono-tech font-bold text-xs text-emerald-400">
              {systemHealthPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Quick settings gear */}
        <button
          id="nav-btn-settings"
          onClick={() => onSelectSection('settings')}
          className="w-full mt-2 flex items-center gap-2 px-2 py-1.5 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden md:inline uppercase tracking-wider">SETTINGS</span>
        </button>
      </div>
    </aside>
  );
};
