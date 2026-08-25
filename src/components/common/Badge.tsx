import React from 'react';

export type BadgeVariant = 
  | 'pink' 
  | 'green' 
  | 'red' 
  | 'amber' 
  | 'blue' 
  | 'purple' 
  | 'slate' 
  | 'black'
  | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  className = '',
  icon
}) => {
  // Strict 3-color palette: Black, White, Dark Gradient Pink
  const variantStyles: Record<BadgeVariant, string> = {
    pink: 'bg-zinc-100 text-zinc-900 border-zinc-200',
    black: 'bg-zinc-900 text-white border-zinc-800 shadow-2xs',
    slate: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    outline: 'bg-white text-zinc-800 border-zinc-300 shadow-2xs',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    red: 'bg-rose-50 text-rose-800 border-rose-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-bold',
    md: 'px-2.5 py-1 text-xs font-extrabold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
