// ====================================================================
// Component: ConnectionStatus Badge
// Displays WebSocket Realtime Connection vs Demo Mode Toggle
// ====================================================================

import React from 'react';
import { Wifi, WifiOff, Zap, ShieldCheck, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface ConnectionStatusProps {
  isWsConnected: boolean;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onReconnect: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isWsConnected,
  isDemoMode,
  onToggleDemoMode,
  onReconnect
}) => {
  const { isKhmer } = useLanguage();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* 1. WebSocket Live Server Indicator */}
      {isWsConnected ? (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-mono">{isKhmer ? 'ម៉ាស៊ីនបម្រើផ្សាយផ្ទាល់' : 'LIVE SERVER CONNECTED'}</span>
        </div>
      ) : (
        <button
          onClick={onReconnect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Click to reconnect WebSocket server"
        >
          <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span className="font-mono">{isKhmer ? 'ម៉ាស៊ីនបម្រើក្រៅបណ្តាញ' : 'AGENT SERVER OFFLINE'}</span>
          <RefreshCw className="w-3 h-3 text-amber-600" />
        </button>
      )}

      {/* 2. Demo Mode Switcher Badge */}
      <button
        onClick={onToggleDemoMode}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer shadow-2xs ${
          isDemoMode
            ? 'bg-gradient-to-r from-pink-50 to-pink-100/70 text-pink-900 border-pink-300 hover:border-pink-400'
            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
        }`}
        title="Toggle between Live Agent telemetry and Demo simulation"
      >
        <Zap className={`w-3.5 h-3.5 ${isDemoMode ? 'text-pink-800 fill-pink-800' : 'text-zinc-500'}`} />
        <span className="tracking-wide uppercase font-mono">
          {isDemoMode ? (isKhmer ? 'របៀបសាកល្បង (DEMO)' : 'DEMO MODE (ACTIVE)') : (isKhmer ? 'របៀបផលិតកម្ម (LIVE)' : 'PRODUCTION MODE')}
        </span>
      </button>

      {/* 3. Security Shield Badge */}
      <div className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
        <ShieldCheck className="w-3.5 h-3.5 text-pink-800" />
        <span>{isKhmer ? 'ពាក្យបញ្ជាសុវត្ថិភាព 100%' : 'Predefined Safe Commands'}</span>
      </div>
    </div>
  );
};
