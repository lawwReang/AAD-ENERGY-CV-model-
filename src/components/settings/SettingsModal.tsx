import React, { useState } from 'react';
import { FacilitySettings } from '../../types';
import { Sliders, X, Save, Shield, Bell, Cpu, Camera, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FacilitySettings;
  onSaveSettings: (updated: FacilitySettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<FacilitySettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div 
      id="facility-settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
    >
      <div className="relative w-full max-w-lg bg-[#080d14] border border-zinc-700 rounded-sm p-5 font-mono shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-950 text-cyan-400 border border-cyan-500/40 rounded-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="font-display-tech font-bold text-sm text-white tracking-wider uppercase">
                COMMAND CENTER CALIBRATION
              </div>
              <div className="text-[9px] text-zinc-500 tracking-wider">
                SAFETY THRESHOLDS & SCADA LOGIC PARAMETERS
              </div>
            </div>
          </div>

          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-xs hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
          
          {/* Section 1: Environmental Safety Thresholds */}
          <div className="p-3 bg-[#05080c] border border-zinc-800 rounded-xs space-y-3">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              ENVIRONMENTAL THRESHOLDS
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  TEMP WARNING THRESHOLD (°C)
                </label>
                <input
                  type="number"
                  value={formData.tempWarningThreshold}
                  onChange={(e) => setFormData({ ...formData, tempWarningThreshold: Number(e.target.value) })}
                  className="w-full bg-black border border-zinc-700 px-2 py-1 rounded-xs text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  TEMP CRITICAL TRIP (°C)
                </label>
                <input
                  type="number"
                  value={formData.tempCriticalThreshold}
                  onChange={(e) => setFormData({ ...formData, tempCriticalThreshold: Number(e.target.value) })}
                  className="w-full bg-black border border-zinc-700 px-2 py-1 rounded-xs text-red-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  GAS WARNING LIMIT (%)
                </label>
                <input
                  type="number"
                  value={formData.gasWarningThreshold}
                  onChange={(e) => setFormData({ ...formData, gasWarningThreshold: Number(e.target.value) })}
                  className="w-full bg-black border border-zinc-700 px-2 py-1 rounded-xs text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  GAS CRITICAL LIMIT (%)
                </label>
                <input
                  type="number"
                  value={formData.gasCriticalThreshold}
                  onChange={(e) => setFormData({ ...formData, gasCriticalThreshold: Number(e.target.value) })}
                  className="w-full bg-black border border-zinc-700 px-2 py-1 rounded-xs text-red-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: AI / CV Vision Sensitivity */}
          <div className="p-3 bg-[#05080c] border border-zinc-800 rounded-xs space-y-3">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              COMPUTER VISION SETTINGS
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                <span>AI OBJECT CONFIDENCE THRESHOLD:</span>
                <span className="text-purple-300 font-bold">{formData.cvConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={formData.cvConfidenceThreshold}
                onChange={(e) => setFormData({ ...formData, cvConfidenceThreshold: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-zinc-300">Default Video Reticle HUD</span>
              <input
                type="checkbox"
                checked={formData.reticleOverlay}
                onChange={(e) => setFormData({ ...formData, reticleOverlay: e.target.checked })}
                className="accent-cyan-500 w-4 h-4"
              />
            </div>
          </div>

          {/* Section 3: Smart MCB Automated Interlocks */}
          <div className="p-3 bg-[#05080c] border border-zinc-800 rounded-xs space-y-2">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              SMART MCB INTERLOCK AUTOMATION
            </div>

            <div className="flex items-center justify-between text-[11px] py-1 border-b border-zinc-850">
              <span className="text-zinc-300">Auto-Trip Breakers on Critical Gas Leak</span>
              <input
                type="checkbox"
                checked={formData.autoTripOnCriticalGas}
                onChange={(e) => setFormData({ ...formData, autoTripOnCriticalGas: e.target.checked })}
                className="accent-emerald-500 w-4 h-4"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] py-1 border-b border-zinc-850">
              <span className="text-zinc-300">Auto-Trip Main Feeder on Fire Outbreak</span>
              <input
                type="checkbox"
                checked={formData.autoTripOnFire}
                onChange={(e) => setFormData({ ...formData, autoTripOnFire: e.target.checked })}
                className="accent-emerald-500 w-4 h-4"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">
                EXTINGUISHER AUTHORIZATION PIN
              </label>
              <input
                type="text"
                maxLength={6}
                value={formData.extinguisherPin}
                onChange={(e) => setFormData({ ...formData, extinguisherPin: e.target.value })}
                className="w-32 bg-black border border-zinc-700 px-2 py-1 rounded-xs text-amber-400 font-mono tracking-widest font-bold"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-[9px] text-zinc-500">
            FIRMWARE: MCB-CTRL-V2.4.1 • FLASH EEPROM
          </span>

          <div className="flex items-center gap-2">
            <button
              id="cancel-settings-btn"
              onClick={onClose}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xs text-xs font-bold uppercase transition-colors"
            >
              CANCEL
            </button>
            <button
              id="save-settings-btn"
              onClick={handleSave}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xs text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'SAVED' : 'SAVE CALIBRATION'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
