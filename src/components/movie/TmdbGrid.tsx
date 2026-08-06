import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import type { TmdbItem } from '../../services/tmdbService';

export function TmdbGrid({ items }: { items: TmdbItem[] }) {
  const navigate = useNavigate();
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => navigate('/watch/tmdb/' + item.id + '?type=' + item.media_type)}
          className="group overflow-hidden rounded-lg border border-borderc bg-surface text-left transition-colors hover:bg-surface-hover"
        >
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-hover">
            <img
              src={item.poster_url || 'https://picsum.photos/seed/tmdb/400/600'}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
                <Play className="h-5 w-5 fill-black" />
              </span>
            </div>
          </div>
          <div className="p-3">
            <p className="truncate text-sm font-semibold text-text-primary">{item.title}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-text-secondary">
              {item.release_date && <span>{item.release_date.slice(0, 4)}</span>}
              {item.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {item.vote_average.toFixed(1)}
                </span>
              )}
              <span className="uppercase">{item.media_type === 'tv' ? 'Series' : 'Movie'}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
