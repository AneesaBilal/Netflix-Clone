import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Film } from 'lucide-react';
import { fetchMovies } from '../../services/movieService';
import { fetchGenres } from '../../services/genreService';
import { fetchPopularMovies, hasTmdbKey } from '../../services/tmdbService';
import { TmdbGrid } from '../../components/movie/TmdbGrid';
import { MovieCard } from '../../components/movie/MovieCard';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Select } from '../../components/ui/Select';
import { useProfileStore } from '../../stores/profileStore';

export default function MoviesPage() {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const kidsOnly = Boolean(activeProfile && activeProfile.is_kids);
  const [genreId, setGenreId] = useState('');
  const [sort, setSort] = useState<'created_at' | 'rating' | 'release_year'>('created_at');

  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });
  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies', 'all', kidsOnly, genreId, sort],
    queryFn: () => fetchMovies({ kidsOnly, genreId: genreId || undefined, orderBy: sort, limit: 60 }),
  });
  const { data: tmdbMovies, isLoading: tmdbLoading } = useQuery({
    queryKey: ['tmdb', 'movies'],
    queryFn: fetchPopularMovies,
    enabled: hasTmdbKey,
  });

  return (
    <div className="space-y-10 px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Movies</h1>
          <p className="mt-1 text-text-secondary">Your catalog plus the real worldwide catalog.</p>
        </div>
        <div className="flex gap-3">
          <div className="w-44">
            <Select value={genreId} onChange={(e) => setGenreId(e.target.value)} aria-label="Filter by genre">
              <option value="">All genres</option>
              {(genres || []).map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </Select>
          </div>
          <div className="w-44">
            <Select value={sort} onChange={(e) => setSort(e.target.value as any)} aria-label="Sort movies">
              <option value="created_at">Recently added</option>
              <option value="rating">Top rated</option>
              <option value="release_year">Newest year</option>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <GridSkeleton count={10} />
      ) : (movies || []).length === 0 ? (
        <EmptyState icon={<Film className="h-10 w-10" />} title="No local movies yet" description="Add movies from the admin console, or browse the real catalog below." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {(movies || []).map((movie) => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Popular Worldwide (TMDB)</h2>
          <p className="text-sm text-text-secondary">Real catalog metadata - click a poster to watch the official trailer.</p>
        </div>
        {!hasTmdbKey ? (
          <p className="rounded-xl border border-borderc bg-surface p-4 text-sm text-text-secondary">
            Add VITE_TMDB_API_KEY to your .env file (free at themoviedb.org), then restart the dev server to load the real movie catalog here.
          </p>
        ) : tmdbLoading ? (
          <GridSkeleton count={10} />
        ) : (
          <TmdbGrid items={tmdbMovies || []} />
        )}
      </section>
    </div>
  );
}
