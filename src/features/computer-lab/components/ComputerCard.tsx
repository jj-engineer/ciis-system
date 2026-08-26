// ====================================================================
// Component: ComputerCard
// Realistic, Lightweight School Laptop Status Card (01 - 30)
// ====================================================================

import React from 'react';
import {
  Laptop,
  Radio,
  Clock,
  KeyRound,
  ShieldAlert,
  Wifi,
  WifiOff,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { ComputerStatus, ComputerWorkstation } from '../types/lab';
import { useLanguage } from '../../../context/LanguageContext';

interface ComputerCardProps {
  computer: ComputerWorkstation;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick: (computer: ComputerWorkstation) => void;
  onGenerateToken?: (computer: ComputerWorkstation, e: React.MouseEvent) => void;
}

export const ComputerCard: React.FC<ComputerCardProps> = ({
  computer,
  isSelected,
  onClick,
  onGenerateToken
}) => {
  const { isKhmer } = useLanguage();
  const computerNumber = computer.computerNumber || computer.computerCode || '01';

  // Compute Relative Time String
  const getRelativeLastSeen = () => {
    if (computer.status === 'UNREGISTERED') {
      return isKhmer ? 'មិនទាន់ចុះឈ្មោះ' : 'Not paired';
    }
    if (!computer.lastSeen && !computer.lastHeartbeat) {
      return isKhmer ? 'គ្មានសញ្ញា' : 'No signal';
    }

    const timestamp = new Date(computer.lastSeen || computer.lastHeartbeat).getTime();
    const diffSec = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));

    if (diffSec < 10) return isKhmer ? 'មុននេះ' : 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMins = Math.floor(diffSec / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const isOnline = computer.status === 'ONLINE' || computer.status === 'IN_USE' || computer.status === 'AVAILABLE';
  const isOffline = computer.status === 'OFFLINE' || computer.status === 'DISCONNECTED';
  const isUnregistered = computer.status === 'UNREGISTERED';
  const isRevoked = computer.status === 'REVOKED';

  const isPersonal = computer.isPersonal || computer.deviceOwnership === 'PERSONAL' || String(computerNumber).startsWith('BYOD');
  const displayName = isPersonal && computer.studentName ? computer.studentName : computerNumber;

  return (
    <div
      onClick={() => onClick(computer)}
      className={`group relative rounded-2xl p-3.5 transition-all duration-150 cursor-pointer border select-none flex flex-col justify-between ${
        isSelected
          ? 'bg-pink-50/80 border-pink-500 shadow-sm ring-2 ring-pink-500/20'
          : isOnline
          ? isPersonal
            ? 'bg-white border-indigo-200/90 hover:border-indigo-400 hover:shadow-md'
            : 'bg-white border-zinc-200/90 hover:border-emerald-400 hover:shadow-md'
          : isOffline
          ? 'bg-zinc-50/80 border-zinc-200 hover:border-rose-300 hover:shadow-sm'
          : isRevoked
          ? 'bg-zinc-50 border-zinc-300 opacity-70'
          : 'bg-zinc-50/50 border-dashed border-zinc-300 hover:border-pink-300'
      }`}
    >
      {/* Top Row: Laptop Code & Status Pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black transition-all shrink-0 ${
              isOnline
                ? isPersonal
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 group-hover:scale-105'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:scale-105'
                : isOffline
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : isRevoked
                ? 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
            }`}
          >
            <Laptop className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <div className="text-[10.5px] font-bold text-zinc-400 font-mono leading-none flex items-center gap-1">
              <span>{isPersonal ? 'Personal BYOD' : 'Laptop'}</span>
              {isPersonal && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold">
                  {computerNumber}
                </span>
              )}
            </div>
            <div className="text-sm sm:text-base font-black font-mono tracking-tight text-zinc-950 truncate">
              {displayName}
            </div>
          </div>
        </div>

        {/* Real Status Badge */}
        {isOnline && (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold font-mono shrink-0 ${
            isPersonal ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPersonal ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
            <span>Online</span>
          </span>
        )}

        {isOffline && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Offline</span>
          </span>
        )}

        {isUnregistered && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-zinc-100 text-zinc-600 border border-zinc-200 font-mono shrink-0">
            <span>Unpaired</span>
          </span>
        )}

        {isRevoked && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-zinc-200 text-zinc-700 border border-zinc-300 font-mono shrink-0">
            <span>Revoked</span>
          </span>
        )}
      </div>

      {/* Middle Row: Network Telemetry & Last Seen */}
      <div className="my-2.5 py-1.5 px-2.5 rounded-xl bg-zinc-50/90 border border-zinc-100/80 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span className={isOnline ? (isPersonal ? 'text-indigo-800 font-semibold' : 'text-emerald-800 font-semibold') : 'text-zinc-600'}>
            {getRelativeLastSeen()}
          </span>
        </div>

        <span className="text-zinc-400 text-[10.5px] truncate max-w-[110px]">
          {computer.ipAddress || `192.168.10.${100 + Number(computerNumber || 1)}`}
        </span>
      </div>

      {/* Bottom Action / Quick Trigger */}
      <div className="pt-1 flex items-center justify-between text-[10.5px] text-zinc-400 font-mono">
        <span className="truncate max-w-[130px]">{computer.hostname || `PC-${computerNumber}`}</span>

        {isUnregistered ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGenerateToken?.(computer, e);
            }}
            className="px-2 py-0.5 rounded-md bg-pink-800 hover:bg-pink-700 text-white font-sans font-bold flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95 shrink-0"
          >
            <KeyRound className="w-3 h-3" />
            <span>Pair</span>
          </button>
        ) : (
          <span className="text-zinc-400 group-hover:text-pink-900 group-hover:underline font-sans font-semibold transition-all flex items-center shrink-0">
            Inspect <ChevronRight className="w-3 h-3 inline ml-0.5" />
          </span>
        )}
      </div>
    </div>
  );
};
