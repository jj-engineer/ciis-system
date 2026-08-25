// ====================================================================
// Component: LabStats
// Clean, Lightweight Realtime Metrics Bar for School Computer Lab
// ====================================================================

import React from 'react';
import {
  Laptop,
  CheckCircle2,
  WifiOff,
  KeyRound,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { StatusFilterOption } from '../hooks/useLabComputers';

interface LabStatsProps {
  stats: {
    total: number;
    online: number;
    offline: number;
    unregistered?: number;
    revoked?: number;
  };
  activeFilter: StatusFilterOption;
  onFilterChange: (f: StatusFilterOption) => void;
}

export const LabStats: React.FC<LabStatsProps> = ({
  stats,
  activeFilter,
  onFilterChange
}) => {
  const { isKhmer } = useLanguage();
  const unregistered = stats.unregistered || 0;
  const revoked = stats.revoked || 0;

  const filterPills: {
    id: StatusFilterOption;
    count: number;
    label: string;
    labelKh: string;
    dotClass: string;
    activeBorder: string;
  }[] = [
    {
      id: 'ALL',
      count: stats.total,
      label: 'All Laptops',
      labelKh: 'កុំព្យូទ័រសរុប',
      dotClass: 'bg-zinc-700',
      activeBorder: 'bg-zinc-900 text-white'
    },
    {
      id: 'ONLINE',
      count: stats.online,
      label: 'Online',
      labelKh: 'អនឡាញ',
      dotClass: 'bg-emerald-500 animate-pulse',
      activeBorder: 'bg-emerald-700 text-white'
    },
    {
      id: 'OFFLINE',
      count: stats.offline,
      label: 'Offline',
      labelKh: 'អហ្វឡាញ',
      dotClass: 'bg-rose-500',
      activeBorder: 'bg-rose-700 text-white'
    },
    {
      id: 'UNREGISTERED',
      count: unregistered,
      label: 'Unpaired',
      labelKh: 'មិនទាន់ចុះឈ្មោះ',
      dotClass: 'bg-slate-400',
      activeBorder: 'bg-slate-800 text-white'
    }
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs overflow-x-auto select-none">
      {filterPills.map((pill) => {
        const isActive = activeFilter === pill.id;
        return (
          <button
            key={pill.id}
            onClick={() => onFilterChange(pill.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? `${pill.activeBorder} shadow-xs font-black`
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : pill.dotClass}`} />
            <span>{isKhmer ? pill.labelKh : pill.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-md text-[11px] font-mono font-black ${
                isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-800'
              }`}
            >
              {pill.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
