// ====================================================================
// Component: ConnectionStatus Badge
// Clean, Minimalist Live Server Connection Indicator
// ====================================================================

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface ConnectionStatusProps {
  isWsConnected: boolean;
  onReconnect: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isWsConnected,
  onReconnect
}) => {
  const { isKhmer } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {isWsConnected ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/90 border border-zinc-200 text-xs font-bold text-zinc-800 shadow-2xs select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px]">{isKhmer ? 'ម៉ាស៊ីនបម្រើ Live' : 'Live Server'}</span>
        </div>
      ) : (
        <button
          onClick={onReconnect}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/80 hover:bg-zinc-200/80 border border-zinc-200 text-xs font-semibold text-zinc-600 transition-all cursor-pointer shadow-2xs select-none"
          title={isKhmer ? 'ចុចដើម្បីភ្ជាប់ឡើងវិញ' : 'Click to reconnect'}
        >
          <span className="w-2 h-2 rounded-full bg-zinc-400" />
          <span className="font-mono text-[11px]">{isKhmer ? 'ម៉ាស៊ីនបម្រើ Offline' : 'Server Offline'}</span>
          <RefreshCw className="w-3 h-3 text-zinc-400 hover:rotate-180 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};
