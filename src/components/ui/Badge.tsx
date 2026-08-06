import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-surface-hover text-text-secondary',
        variant === 'primary' && 'bg-primary/15 text-primary',
        variant === 'outline' && 'border border-borderc text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  );
}
