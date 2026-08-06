
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';
import type { TmdbItem } from '../../services/tmdbService';

interface TmdbRowProps {
  title: string;
  items: TmdbItem[];
}

export function TmdbRow({ title, items }: TmdbRowProps) {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 480, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-8">
        <h2 className="text-lg font-semibold text-text-primary sm:text-xl">{title}</h2>
        <div className="hidden gap-1 md:flex">
          <button type="button" onClick={() => scrollBy(-1)} className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={() => scrollBy(1)} className="rounded-lg p-1.5 text-text-secondary hover:bg-surface-hover"><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 sm:px-8">
        {items.map((item) => (
          <div key={item.id} className="group relative w-40 shrink-0 sm:w-44">
            <button
              type="button"
              onClick={() => navigate('/watch/tmdb/' + item.id + '?type=' + item.media_type)}
              className="block overflow-hidden rounded-lg bg-surface"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                <img src={item.poster_url} alt={item.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                    <Play className="h-5 w-5 fill-black" />
                  </span>
                </div>
              </div>
            </button>
            <div className="mt-2 px-0.5">
              <p className="truncate text-sm font-medium text-text-primary">{item.title}</p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-text-secondary">
                {item.release_date && <span>{item.release_date.slice(0, 4)}</span>}
                {item.vote_average > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {item.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
