import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Play, Star, Calendar, Clock, User, Users } from 'lucide-react';
import { fetchMovieBySlug, fetchMoreLikeMovies } from '../../services/movieService';
import { fetchMyRating, upsertRating, removeRating } from '../../services/ratingService';
import { fetchMyListIds, addToMyList, removeFromMyList } from '../../services/myListService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { RatingStars } from '../../components/ui/RatingStars';
import { AddToListButton } from '../../components/movie/AddToListButton';
import { MovieCard } from '../../components/movie/MovieCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useProfileStore } from '../../stores/profileStore';
import { useToast } from '../../hooks/useToast';
import { formatMinutes } from '../../lib/utils';

export default function MovieDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { success, error: toastError } = useToast();
  const profileId = activeProfile ? activeProfile.id : '';

  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', slug],
    queryFn: () => fetchMovieBySlug(slug || ''),
    enabled: Boolean(slug),
  });

  const { data: similar } = useQuery({
    queryKey: ['movie', slug, 'similar'],
    queryFn: () => fetchMoreLikeMovies(movie!),
    enabled: Boolean(movie),
  });

  const { data: myRating } = useQuery({
    queryKey: ['rating', 'movie', movie?.id, profileId],
    queryFn: () => fetchMyRating({ profileId, movieId: movie!.id }),
    enabled: Boolean(movie && profileId),
  });

  const { data: listIds } = useQuery({
    queryKey: ['my-list-ids', profileId],
    queryFn: () => fetchMyListIds(profileId),
    enabled: Boolean(profileId),
  });

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <Skeleton className="h-[45vh] w-full rounded-2xl" />
        <Skeleton className="mt-6 h-8 w-72" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      </div>
    );
  }

  if (error || !movie) {
    return <div className="px-4 py-8 sm:px-8"><ErrorState message="This movie could not be found." onRetry={() => window.location.reload()} /></div>;
  }

  const inList = listIds ? listIds.movieIds.has(movie.id) : false;

  const toggleList = async () => {
    if (!profileId) return;
    try {
      if (inList) {
        await removeFromMyList({ profileId, movieId: movie.id });
        success('Removed from My List.');
      } else {
        await addToMyList({ profileId, movieId: movie.id });
        success('Added to My List.');
      }
      queryClient.invalidateQueries({ queryKey: ['my-list-ids'] });
      queryClient.invalidateQueries({ queryKey: ['my-list'] });
    } catch (err) {
      toastError('Could not update your list.');
    }
  };

  const handleRate = async (value: number) => {
    if (!profileId) return;
    try {
      await upsertRating({ profileId, movieId: movie.id, rating: value });
      success('Rating saved.');
      queryClient.invalidateQueries({ queryKey: ['rating', 'movie', movie.id] });
    } catch (err) {
      toastError('Could not save rating.');
    }
  };

  const handleRemoveRating = async () => {
    if (!profileId) return;
    try {
      await removeRating({ profileId, movieId: movie.id });
      success('Rating removed.');
      queryClient.invalidateQueries({ queryKey: ['rating', 'movie', movie.id] });
    } catch (err) {
      toastError('Could not remove rating.');
    }
  };

  return (
    <div className="pb-12">
      {/* Backdrop */}
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <img src={movie.backdrop_url || movie.poster_url || ''} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 -mt-40 px-4 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <img src={movie.poster_url || ''} alt={movie.title + ' poster'} className="hidden h-64 w-44 rounded-xl border border-borderc object-cover shadow-2xl md:block" />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-text-primary sm:text-5xl">{movie.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              {movie.rating != null && (
                <span className="flex items-center gap-1 text-yellow-400"><Star className="h-4 w-4 fill-yellow-400" /> {Number(movie.rating).toFixed(1)}</span>
              )}
              {movie.release_year && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {movie.release_year}</span>}
              {movie.runtime_minutes != null && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatMinutes(movie.runtime_minutes)}</span>}
              {movie.age_rating && <Badge variant="outline">{movie.age_rating}</Badge>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(movie.genres || []).map((g) => (
                <Link key={g.id} to={'/search?genre=' + g.id}><Badge variant="primary">{g.name}</Badge></Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => navigate('/watch/movie/' + movie.id)}>
                <Play className="h-5 w-5 fill-white text-white" /> Play
              </Button>
              {movie.trailer_url && (
                <Button size="lg" variant="secondary" onClick={() => navigate('/watch/movie/' + movie.id)}>
                  Trailer
                </Button>
              )}
              <AddToListButton inList={inList} onClick={toggleList} />
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-text-secondary">{movie.description}</p>

        <div className="mt-6 grid gap-4 text-sm text-text-secondary sm:grid-cols-2">
          {movie.director && <p><User className="mr-2 inline h-4 w-4" /> Director: <span className="text-text-primary">{movie.director}</span></p>}
          {movie.cast_members && movie.cast_members.length > 0 && (
            <p><Users className="mr-2 inline h-4 w-4" /> Cast: <span className="text-text-primary">{movie.cast_members.join(', ')}</span></p>
          )}
        </div>

        {/* Rating */}
        <div className="mt-8 max-w-md rounded-2xl border border-borderc bg-surface p-5">
          <p className="font-semibold text-text-primary">Rate this movie</p>
          <div className="mt-2 flex items-center gap-4">
            <RatingStars value={myRating ? myRating.rating : 0} onChange={handleRate} />
            {myRating && (
              <button type="button" onClick={handleRemoveRating} className="text-xs text-text-secondary hover:text-red-500">
                Remove rating
              </button>
            )}
          </div>
        </div>

        {/* More like this */}
        {similar && similar.length > 0 && (
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-text-primary">More Like This</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {similar.map((m) => <MovieCard key={m.id} item={m} type="movie" />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
