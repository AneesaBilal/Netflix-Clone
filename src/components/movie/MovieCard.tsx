import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import type { Movie, TvShow } from '../../types';
import { formatMinutes } from '../../lib/utils';

interface MovieCardProps {
  item: Movie | TvShow;
  type: 'movie' | 'show';
  progress?: number;
  inList?: boolean;
  onToggleList?: () => void;
}

export function MovieCard({ item, type, progress, inList = false, onToggleList }: MovieCardProps) {
  const navigate = useNavigate();
  const detailPath = type === 'movie' ? '/movie/' + item.slug : '/tv/' + item.slug;
  const playPath = type === 'movie' ? '/watch/movie/' + item.id : '/tv/' + item.slug;

  return (
    <div className="group relative w-40 shrink-0 sm:w-44">
      <Link to={detailPath} className="block overflow-hidden rounded-lg bg-surface">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <img
            src={item.poster_url || 'https://picsum.photos/seed/na/400/600'}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={'Play ' + item.title}
                onClick={(e) => { e.preventDefault(); navigate(playPath); }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/80"
              >
                <Play className="h-4 w-4 fill-black text-black" />
              </button>
              {onToggleList && (
                <button
                  type="button"
                  aria-label={inList ? 'Remove from My List' : 'Add to My List'}
                  onClick={(e) => { e.preventDefault(); onToggleList(); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 text-white hover:bg-white/20"
                >
                  {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              )}
              <button
                type="button"
                aria-label={'More info about ' + item.title}
                onClick={(e) => { e.preventDefault(); navigate(detailPath); }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 text-white hover:bg-white/20"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
          {progress != null && progress > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
              <div className="h-full bg-primary" style={{ width: Math.min(100, progress) + '%' }} />
            </div>
          )}
        </div>
      </Link>
      <div className="mt-2 px-0.5">
        <Link to={detailPath} className="block truncate text-sm font-medium text-text-primary hover:underline">
          {item.title}
        </Link>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-text-secondary">
          {item.release_year && <span>{item.release_year}</span>}
          {item.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {Number(item.rating).toFixed(1)}
            </span>
          )}
          {type === 'movie' && (item as Movie).runtime_minutes != null && (
            <span>{formatMinutes((item as Movie).runtime_minutes)}</span>
          )}
          <span className="capitalize">{type === 'movie' ? 'Movie' : 'Series'}</span>
        </div>
      </div>
    </div>
  );
}
