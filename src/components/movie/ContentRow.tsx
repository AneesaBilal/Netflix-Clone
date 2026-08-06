import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie, TvShow } from '../../types';

interface ContentRowProps {
  title: string;
  items: Array<Movie | TvShow>;
  type: 'movie' | 'show';
  progressById?: Map<string, number>;
  listIds?: Set<string>;
  onToggleList?: (item: Movie | TvShow) => void;
}

export function ContentRow({ title, items, type, progressById, listIds, onToggleList }: ContentRowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 480, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="relative space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-text-primary sm:text-xl">{title}</h2>
        <div className="hidden gap-1 md:flex">
          <button type="button" onClick={() => scrollBy(-1)} aria-label={'Scroll ' + title + ' left'} className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label={'Scroll ' + title + ' right'} className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover hover:text-text-primary">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 sm:px-8">
        {items.map((item) => (
          <MovieCard
            key={item.id}
            item={item}
            type={type}
            progress={progressById ? progressById.get(item.id) : undefined}
            inList={listIds ? listIds.has(item.id) : false}
            onToggleList={onToggleList ? () => onToggleList(item) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
