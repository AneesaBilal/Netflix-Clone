import React from 'react';
import { Plus, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AddToListButtonProps {
  inList: boolean;
  onClick: () => void;
  className?: string;
}

export function AddToListButton({ inList, onClick, className }: AddToListButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={inList ? 'Remove from My List' : 'Add to My List'}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full border border-borderc text-text-primary transition-colors hover:bg-surface-hover',
        inList && 'border-primary text-primary',
        className
      )}
    >
      {inList ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
    </button>
  );
}
