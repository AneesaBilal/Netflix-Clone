import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tv } from 'lucide-react';
import { fetchTvShows } from '../../services/tvShowService';
import { fetchPopularTV, hasTmdbKey } from '../../services/tmdbService';
import { TmdbGrid } from '../../components/movie/TmdbGrid';
import { MovieCard } from '../../components/movie/MovieCard';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Select } from '../../components/ui/Select';
import { useProfileStore } from '../../stores/profileStore';

export default function TvShowsPage() {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const kidsOnly = Boolean(activeProfile && activeProfile.is_kids);
  const [sort, setSort] = useState<'created_at' | 'rating' | 'release_year'>('created_at');

  const { data: shows, isLoading } = useQuery({
    queryKey: ['shows', 'all', kidsOnly, sort],
    queryFn: () => fetchTvShows({ kidsOnly, orderBy: sort, limit: 60 }),
  });
  const { data: tmdbTv, isLoading: tmdbLoading } = useQuery({
    queryKey: ['tmdb', 'tv'],
    queryFn: fetchPopularTV,
    enabled: hasTmdbKey,
  });

  return (
    <div className="space-y-10 px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">TV Shows</h1>
          <p className="mt-1 text-text-secondary">Your series plus the real worldwide catalog.</p>
        </div>
        <div className="w-44">
          <Select value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort shows">
            <option value="created_at">Recently added</option>
            <option value="rating">Top rated</option>
            <option value="release_year">Newest year</option>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <GridSkeleton count={10} />
      ) : (shows || []).length === 0 ? (
        <EmptyState icon={<Tv className="h-10 w-10" />} title="No local shows yet" description="Add shows from the admin console, or browse the real catalog below." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {(shows || []).map((show) => (
            <MovieCard key={show.id} item={show} type="show" />
          ))}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Popular Series (TMDB)</h2>
          <p className="text-sm text-text-secondary">Real catalog metadata - click a poster to watch the official trailer.</p>
        </div>
        {!hasTmdbKey ? (
          <p className="rounded-xl border border-borderc bg-surface p-4 text-sm text-text-secondary">
            Add VITE_TMDB_API_KEY to your .env file (free at themoviedb.org), then restart the dev server to load the real series catalog here.
          </p>
        ) : tmdbLoading ? (
          <GridSkeleton count={10} />
        ) : (
          <TmdbGrid items={tmdbTv || []} />
        )}
      </section>
    </div>
  );
}
