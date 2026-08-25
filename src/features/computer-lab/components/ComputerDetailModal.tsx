// ====================================================================
// Component: ComputerDetailModal
// Realistic, Clean Inspection Drawer for School Laptop (01 - 30)
// ====================================================================

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Laptop,
  Radio,
  Clock,
  KeyRound,
  ShieldAlert,
  Wifi,
  WifiOff,
  CheckCircle2,
  HardDrive,
  Cpu,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { ComputerWorkstation, LabCommandType } from '../types/lab';
import { useLanguage } from '../../../context/LanguageContext';

interface ComputerDetailModalProps {
  computer: ComputerWorkstation | null;
  isOpen: boolean;
  onClose: () => void;
  onDispatchCommand: (commandType: LabCommandType, target: ComputerWorkstation, payload?: any) => void;
}

export const ComputerDetailModal: React.FC<ComputerDetailModalProps> = ({
  computer,
  isOpen,
  onClose,
  onDispatchCommand
}) => {
  const { isKhmer } = useLanguage();
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !computer || typeof document === 'undefined') return null;

  const computerNumber = computer.computerNumber || computer.computerCode || '01';
  const isOnline = computer.status === 'ONLINE' || computer.status === 'IN_USE' || computer.status === 'AVAILABLE';
  const isOffline = computer.status === 'OFFLINE' || computer.status === 'DISCONNECTED';
  const isUnregistered = computer.status === 'UNREGISTERED';
  const isRevoked = computer.status === 'REVOKED';

  const handleConfirmRevoke = () => {
    onDispatchCommand('REVOKE_AGENT', computer);
    setConfirmRevoke(false);
    onClose();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col my-auto"
      >
        {/* 1. Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-xs ${
                isOnline
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  : isOffline
                  ? 'bg-rose-100 text-rose-900 border border-rose-200'
                  : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-zinc-950 font-mono">
                  Laptop {computerNumber}
                </h3>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono border ${
                    isOnline
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : isOffline
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : isRevoked
                      ? 'bg-zinc-200 text-zinc-700 border-zinc-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {isOnline ? 'ONLINE' : isOffline ? 'OFFLINE' : isRevoked ? 'REVOKED' : 'UNPAIRED'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                {computer.hostname || `LAPTOP-CIIS-${computerNumber}`} • {computer.labGroup}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Body */}
        <div className="p-5 space-y-4">
          {/* Telemetry Information Cards */}
          <div className="space-y-2">
            <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
              {isKhmer ? 'ព័ត៌មានបច្ចេកទេស និងបណ្តាញ' : 'DEVICE & NETWORK TELEMETRY'}
            </span>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 font-mono block">IP Address</span>
                <span className="font-bold text-zinc-900 font-mono">
                  {computer.ipAddress || `192.168.10.${100 + Number(computerNumber || 1)}`}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 font-mono block">MAC Address</span>
                <span className="font-bold text-zinc-900 font-mono text-[11px]">
                  {computer.macAddress || `00:1A:2B:3C:4D:${computerNumber}`}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 font-mono block">PC Agent Version</span>
                <span className="font-bold text-emerald-700 font-mono">
                  v{computer.agentVersion || '0.1.0'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <span className="text-[10px] text-zinc-400 font-mono block">Last Heartbeat</span>
                <span className="font-bold text-zinc-900 font-mono text-[11px]">
                  {computer.lastSeen
                    ? new Date(computer.lastSeen).toLocaleTimeString()
                    : isOnline
                    ? 'Just now'
                    : 'No signal'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
              {isKhmer ? 'សកម្មភាព' : 'ACTIONS'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Ping Heartbeat */}
              <button
                onClick={() => onDispatchCommand('PING', computer)}
                className="p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Radio className="w-4 h-4 text-zinc-600" />
                <span>{isKhmer ? 'ពិនិត្យសញ្ញា Ping' : 'Ping Heartbeat'}</span>
              </button>

              {/* Show Pair Command */}
              <button
                onClick={() => onDispatchCommand('GENERATE_TOKEN', computer)}
                className="p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-zinc-300" />
                <span>{isKhmer ? 'ពាក្យបញ្ជាចុះឈ្មោះ' : 'Pair Command'}</span>
              </button>
            </div>

            {/* Set Offline Button (if Online) */}
            {isOnline && (
              <button
                onClick={() => {
                  onDispatchCommand('SET_OFFLINE', computer);
                  onClose();
                }}
                className="w-full mt-1.5 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <WifiOff className="w-3.5 h-3.5 text-zinc-500" />
                <span>{isKhmer ? 'កំណត់ទៅ Offline' : 'Set to Offline'}</span>
              </button>
            )}

            {/* Remove / Unpair Laptop Button (if Registered or Online or Offline) */}
            {!isUnregistered && (
              <>
                {!confirmRevoke ? (
                  <button
                    onClick={() => setConfirmRevoke(true)}
                    className="w-full mt-1 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isKhmer ? 'លុប / ផ្ដាច់ការចុះឈ្មោះ Laptop នេះ' : 'Remove / Unpair Laptop'}</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-rose-900 font-bold">
                      {isKhmer ? 'តើអ្នកប្រាកដទេថានឹងលុប Laptop នេះ?' : 'Unpair & reset Laptop to Unregistered?'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setConfirmRevoke(false)}
                        className="px-2.5 py-1 text-xs font-bold text-zinc-600 hover:bg-zinc-200/60 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmRevoke}
                        className="px-3 py-1 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs cursor-pointer"
                      >
                        Confirm Remove
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 3. Footer */}
        <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {isKhmer ? 'បិទ' : 'Done'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
