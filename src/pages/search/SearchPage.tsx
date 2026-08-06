import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, X } from 'lucide-react';
import { searchAll } from '../../services/searchService';
import { fetchGenres } from '../../services/genreService';
import { MovieCard } from '../../components/movie/MovieCard';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Select } from '../../components/ui/Select';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const genreParam = searchParams.get('genre') || '';

  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'show'>('all');
  const [genreFilter, setGenreFilter] = useState(genreParam);
  const debounced = useDebounce(query, 400);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (debounced) params.q = debounced;
    if (genreFilter) params.genre = genreFilter;
    setSearchParams(params, { replace: true });
  }, [debounced, genreFilter, setSearchParams]);

  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });

  const { data: results, isLoading } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => searchAll(debounced),
    enabled: debounced.trim().length > 0,
  });

  const movies = (results ? results.movies : []).filter((m) => {
    if (genreFilter) return (m.genres || []).some((g) => g.id === genreFilter);
    return true;
  });
  const shows = (results ? results.shows : []).filter((s) => {
    if (genreFilter) return (s.genres || []).some((g) => g.id === genreFilter);
    return true;
  });

  const showMovies = typeFilter === 'all' || typeFilter === 'movie';
  const showShows = typeFilter === 'all' || typeFilter === 'show';
  const totalResults = (showMovies ? movies.length : 0) + (showShows ? shows.length : 0);

  return (
    <div className="space-y-8 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, shows, people..."
            aria-label="Search"
            className="w-full rounded-full border border-borderc bg-surface py-3.5 pl-12 pr-12 text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="w-40">
            <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} aria-label="Filter by type">
              <option value="all">All types</option>
              <option value="movie">Movies</option>
              <option value="show">TV Shows</option>
            </Select>
          </div>
          <div className="w-40">
            <Select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} aria-label="Filter by genre">
              <option value="">All genres</option>
              {(genres || []).map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {debounced.trim().length === 0 ? (
        <EmptyState icon={<Search className="h-10 w-10" />} title="Search StreamFlix" description="Start typing to find movies, series, genres and more." />
      ) : isLoading ? (
        <GridSkeleton count={10} />
      ) : totalResults === 0 ? (
        <EmptyState icon={<Search className="h-10 w-10" />} title="No titles matched your search." description={'We could not find anything for "' + debounced + '". Try a different keyword.'} actionLabel="Browse titles" actionTo="/browse" />
      ) : (
        <>
          <p className="text-sm text-text-secondary">Search results for "{debounced}"</p>
          {showMovies && movies.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">Movies</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.map((m) => <MovieCard key={m.id} item={m} type="movie" />)}
              </div>
            </section>
          )}
          {showShows && shows.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-text-primary">TV Shows</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {shows.map((s) => <MovieCard key={s.id} item={s} type="show" />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
