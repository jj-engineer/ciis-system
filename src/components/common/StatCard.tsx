import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlight?: boolean;
  color?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  highlight = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-3xl border transition-all ${
        highlight
          ? 'bg-gradient-to-br from-pink-900 via-pink-950 to-black text-white border-pink-800/40 shadow-lg shadow-pink-950/20'
          : 'bg-white text-zinc-900 border-zinc-200/80 shadow-xs hover:shadow-md hover:border-pink-300'
      } ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-pink-200' : 'text-zinc-500'}`}>
          {title}
        </span>
        <div
          className={`p-2.5 rounded-2xl ${
            highlight ? 'bg-white/10 text-pink-200' : 'bg-pink-950/10 text-pink-900'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-2xl sm:text-3xl font-black tracking-tight ${highlight ? 'text-white' : 'text-zinc-950'}`}>
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              highlight
                ? 'bg-white/15 text-white border-white/20'
                : 'bg-pink-950/10 text-pink-900 border-pink-200'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className={`text-xs mt-1.5 font-medium ${highlight ? 'text-pink-200/90' : 'text-zinc-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
