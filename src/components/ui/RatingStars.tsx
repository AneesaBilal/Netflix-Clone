import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

export function RatingStars({ value, onChange, readonly = false, size = 'md' }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5" role={readonly ? 'img' : 'radiogroup'} aria-label={'Rating ' + value + ' out of 5'}>
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange && onChange(star)}
            aria-label={star + ' star' + (star > 1 ? 's' : '')}
            className={cn(
              'transition-transform',
              !readonly && 'hover:scale-110 focus-visible:scale-110 focus-visible:outline-none'
            )}
          >
            <Star
              className={cn(
                size === 'sm' ? 'h-4 w-4' : 'h-5 w-5',
                filled ? 'fill-yellow-400 text-yellow-400' : 'text-text-secondary'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
