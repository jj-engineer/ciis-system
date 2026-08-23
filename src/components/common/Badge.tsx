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
    pink: 'bg-pink-950/10 text-pink-900 border-pink-200',
    black: 'bg-zinc-900 text-white border-zinc-800 shadow-2xs',
    slate: 'bg-zinc-100 text-zinc-900 border-zinc-200',
    outline: 'bg-white text-zinc-900 border-zinc-300 shadow-2xs',
    // Mapped cleanly to the 3-color system
    green: 'bg-zinc-900 text-pink-200 border-zinc-800',
    red: 'bg-pink-900 text-white border-pink-950',
    amber: 'bg-pink-950/10 text-pink-900 border-pink-200',
    blue: 'bg-zinc-100 text-zinc-900 border-zinc-200',
    purple: 'bg-pink-950/15 text-pink-900 border-pink-300'
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
