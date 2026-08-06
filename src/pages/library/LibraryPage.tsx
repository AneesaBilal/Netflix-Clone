import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Film, Sparkles, Star } from 'lucide-react';
import { fetchArchiveTitles } from '../../services/archiveService';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatMinutes } from '../../lib/utils';

type Tab = 'movie' | 'animation';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('movie');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['archive', tab],
    queryFn: () => fetchArchiveTitles(tab),
  });

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Public Domain Library</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            Complete films and animation streamed legally from the Internet Archive.
            Click any title to watch it in full.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab('movie')}
            className={
              'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ' +
              (tab === 'movie'
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-borderc text-text-secondary hover:bg-surface-hover')
            }
          >
            <Film className="h-4 w-4" /> Classic Films
          </button>
          <button
            type="button"
            onClick={() => setTab('animation')}
            className={
              'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ' +
              (tab === 'animation'
                ? 'border-primary bg-primary/15 text-primary'
                : 'border-borderc text-text-secondary hover:bg-surface-hover')
            }
          >
            <Sparkles className="h-4 w-4" /> Animation
          </button>
        </div>
      </div>

      {isLoading ? (
        <GridSkeleton count={12} />
      ) : error ? (
        <ErrorState message="Could not reach the Internet Archive." onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<Film className="h-10 w-10" />}
          title="Nothing loaded right now"
          description="The Archive did not return playable titles. Try again in a moment."
          onAction={() => refetch()}
          actionLabel="Retry"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data.map((title) => (
            <button
              key={title.identifier}
              type="button"
              onClick={() => navigate('/watch/archive/' + title.identifier)}
              className="group relative overflow-hidden rounded-lg border border-borderc bg-surface text-left transition-colors hover:bg-surface-hover"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-hover">
                <img
                  src={title.poster_url}
                  alt={title.title}
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
                <p className="truncate text-sm font-semibold text-text-primary">{title.title}</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {title.year ? title.year + ' · ' : ''}
                  {title.runtime_minutes ? formatMinutes(title.runtime_minutes) : 'Public domain'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
