import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '../../services/genreService';
import { fetchMovies } from '../../services/movieService';
import { fetchTvShows } from '../../services/tvShowService';
import { ContentRow } from '../../components/movie/ContentRow';
import { ContentRowSkeleton } from '../../components/ui/Skeleton';
import { useProfileStore } from '../../stores/profileStore';

export default function BrowsePage() {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const kidsOnly = Boolean(activeProfile && activeProfile.is_kids);

  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });
  const { data: movies, isLoading: moviesLoading } = useQuery({
    queryKey: ['movies', 'browse', kidsOnly],
    queryFn: () => fetchMovies({ kidsOnly, limit: 40 }),
  });
  const { data: shows } = useQuery({
    queryKey: ['shows', 'browse', kidsOnly],
    queryFn: () => fetchTvShows({ kidsOnly, limit: 40 }),
  });

  return (
    <div className="space-y-10 px-4 py-8 sm:px-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Browse</h1>
        <p className="mt-1 text-text-secondary">Explore everything StreamFlix has to offer.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/movies" className="rounded-full border border-borderc px-4 py-1.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">All Movies</Link>
          <Link to="/tv-shows" className="rounded-full border border-borderc px-4 py-1.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">All TV Shows</Link>
          {(genres || []).map((g) => (
            <Link key={g.id} to={'/search?genre=' + g.id} className="rounded-full border border-borderc px-4 py-1.5 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">
              {g.name}
            </Link>
          ))}
        </div>
      </div>

      {moviesLoading ? (
        <ContentRowSkeleton />
      ) : (
        <ContentRow title="Movies" items={movies || []} type="movie" />
      )}
      <ContentRow title="TV Shows" items={shows || []} type="show" />
    </div>
  );
}
