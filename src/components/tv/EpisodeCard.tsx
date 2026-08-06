import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { Episode } from '../../types';
import { formatMinutes } from '../../lib/utils';

interface EpisodeCardProps {
  episode: Episode;
  progress?: number;
}

export function EpisodeCard({ episode, progress }: EpisodeCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/watch/episode/' + episode.id)}
      className="group flex w-full gap-4 rounded-xl border border-borderc bg-surface p-3 text-left transition-colors hover:bg-surface-hover"
    >
      <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
        <img
          src={episode.thumbnail_url || 'https://picsum.photos/seed/ep/640/360'}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-8 w-8 fill-white text-white" />
        </div>
        {progress != null && progress > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
            <div className="h-full bg-primary" style={{ width: Math.min(100, progress) + '%' }} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-text-primary">
            Episode {episode.episode_number} · {episode.title}
          </p>
          {episode.duration_minutes != null && (
            <span className="shrink-0 text-xs text-text-secondary">{formatMinutes(episode.duration_minutes)}</span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{episode.description}</p>
      </div>
    </button>
  );
}
