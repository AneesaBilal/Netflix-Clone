import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle } from 'lucide-react';
import { fetchContinueWatching } from '../../services/progressService';
import { useProfileStore } from '../../stores/profileStore';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatSeconds } from '../../lib/utils';

export default function ContinueWatchingPage() {
  const navigate = useNavigate();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const profileId = activeProfile ? activeProfile.id : '';

  const { data: items, isLoading } = useQuery({
    queryKey: ['continue-watching', profileId],
    queryFn: () => fetchContinueWatching(profileId),
    enabled: Boolean(profileId),
  });

  const openItem = (item: any) => {
    if (item.movie) navigate('/watch/movie/' + item.movie.id);
    else if (item.episode) navigate('/watch/episode/' + item.episode.id);
  };

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Continue Watching</h1>
        <p className="mt-1 text-text-secondary">Pick up right where you left off.</p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : !items || items.length === 0 ? (
        <EmptyState icon={<PlayCircle className="h-10 w-10" />} title="Your next story is waiting." description="Start watching something and it will show up here." actionLabel="Browse titles" actionTo="/browse" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const pct = item.duration_seconds > 0 ? Math.min(100, (item.current_seconds / item.duration_seconds) * 100) : 0;
            const remaining = Math.max(0, item.duration_seconds - item.current_seconds);
            const title = item.movie ? item.movie.title : item.episode ? item.episode.title : 'Untitled';
            const subtitle = item.episode && item.episode.show ? item.episode.show.title : 'Movie';
            const image = item.movie ? item.movie.backdrop_url || item.movie.poster_url : item.episode ? item.episode.thumbnail_url : null;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item)}
                className="group overflow-hidden rounded-2xl border border-borderc bg-surface text-left transition-colors hover:bg-surface-hover"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-surface-hover">
                  <img src={image || 'https://picsum.photos/seed/cw/640/360'} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
                    <div className="h-full bg-primary" style={{ width: pct + '%' }} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="truncate font-semibold text-text-primary">{title}</p>
                  <p className="text-sm text-text-secondary">{subtitle} · {formatSeconds(remaining)} left</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
