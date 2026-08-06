import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Play, Star, Calendar } from 'lucide-react';
import { fetchShowBySlug, fetchSeasons, fetchMoreLikeShows } from '../../services/tvShowService';
import { fetchContinueWatching } from '../../services/progressService';
import { fetchMyRating, upsertRating, removeRating } from '../../services/ratingService';
import { fetchMyListIds, addToMyList, removeFromMyList } from '../../services/myListService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { RatingStars } from '../../components/ui/RatingStars';
import { AddToListButton } from '../../components/movie/AddToListButton';
import { EpisodeCard } from '../../components/tv/EpisodeCard';
import { MovieCard } from '../../components/movie/MovieCard';
import { Select } from '../../components/ui/Select';
import { Skeleton, EpisodeSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useProfileStore } from '../../stores/profileStore';
import { useToast } from '../../hooks/useToast';

export default function TvShowDetailsPage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { success, error: toastError } = useToast();
  const profileId = activeProfile ? activeProfile.id : '';
  const [seasonId, setSeasonId] = useState<string>('');

  const { data: show, isLoading, error } = useQuery({
    queryKey: ['show', slug],
    queryFn: () => fetchShowBySlug(slug || ''),
    enabled: Boolean(slug),
  });

  const { data: seasons } = useQuery({
    queryKey: ['seasons', show?.id],
    queryFn: () => fetchSeasons(show!.id),
    enabled: Boolean(show),
  });

  const { data: similar } = useQuery({
    queryKey: ['show', slug, 'similar'],
    queryFn: () => fetchMoreLikeShows(show!),
    enabled: Boolean(show),
  });

  const { data: progress } = useQuery({
    queryKey: ['continue-watching', profileId],
    queryFn: () => fetchContinueWatching(profileId),
    enabled: Boolean(profileId),
  });

  const { data: myRating } = useQuery({
    queryKey: ['rating', 'show', show?.id, profileId],
    queryFn: () => fetchMyRating({ profileId, showId: show!.id }),
    enabled: Boolean(show && profileId),
  });

  const { data: listIds } = useQuery({
    queryKey: ['my-list-ids', profileId],
    queryFn: () => fetchMyListIds(profileId),
    enabled: Boolean(profileId),
  });

  React.useEffect(() => {
    if (seasons && seasons.length > 0 && !seasonId) {
      setSeasonId(seasons[0].id);
    }
  }, [seasons, seasonId]);

  if (isLoading) {
    return (
      <div className="px-4 py-8 sm:px-8">
        <Skeleton className="h-[45vh] w-full rounded-2xl" />
        <Skeleton className="mt-6 h-8 w-72" />
        <div className="mt-8 space-y-4"><EpisodeSkeleton /><EpisodeSkeleton /><EpisodeSkeleton /></div>
      </div>
    );
  }

  if (error || !show) {
    return <div className="px-4 py-8 sm:px-8"><ErrorState message="This show could not be found." onRetry={() => window.location.reload()} /></div>;
  }

  const currentSeason = (seasons || []).find((s) => s.id === seasonId) || (seasons || [])[0];
  const inList = listIds ? listIds.showIds.has(show.id) : false;

  const episodeProgress = new Map<string, number>();
  (progress || []).forEach((p) => {
    if (p.episode && p.duration_seconds > 0) {
      episodeProgress.set(p.episode.id, (p.current_seconds / p.duration_seconds) * 100);
    }
  });

  const toggleList = async () => {
    if (!profileId) return;
    try {
      if (inList) {
        await removeFromMyList({ profileId, showId: show.id });
        success('Removed from My List.');
      } else {
        await addToMyList({ profileId, showId: show.id });
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
      await upsertRating({ profileId, showId: show.id, rating: value });
      success('Rating saved.');
      queryClient.invalidateQueries({ queryKey: ['rating', 'show', show.id] });
    } catch (err) {
      toastError('Could not save rating.');
    }
  };

  const handleRemoveRating = async () => {
    if (!profileId) return;
    try {
      await removeRating({ profileId, showId: show.id });
      success('Rating removed.');
      queryClient.invalidateQueries({ queryKey: ['rating', 'show', show.id] });
    } catch (err) {
      toastError('Could not remove rating.');
    }
  };

  const firstEpisode = currentSeason && currentSeason.episodes && currentSeason.episodes.length > 0
    ? currentSeason.episodes[0]
    : null;

  return (
    <div className="pb-12">
      <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <img src={show.backdrop_url || show.poster_url || ''} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative z-10 -mt-40 px-4 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <img src={show.poster_url || ''} alt={show.title + ' poster'} className="hidden h-64 w-44 rounded-xl border border-borderc object-cover shadow-2xl md:block" />
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-text-primary sm:text-5xl">{show.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              {show.rating != null && (
                <span className="flex items-center gap-1 text-yellow-400"><Star className="h-4 w-4 fill-yellow-400" /> {Number(show.rating).toFixed(1)}</span>
              )}
              {show.release_year && <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {show.release_year}</span>}
              {show.age_rating && <Badge variant="outline">{show.age_rating}</Badge>}
              <Badge>{(seasons || []).length} season{(seasons || []).length === 1 ? '' : 's'}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(show.genres || []).map((g) => (
                <Link key={g.id} to={'/search?genre=' + g.id}><Badge variant="primary">{g.name}</Badge></Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {firstEpisode && (
                <Link to={'/watch/episode/' + firstEpisode.id}>
                  <Button size="lg"><Play className="h-5 w-5 fill-white text-white" /> Play</Button>
                </Link>
              )}
              <AddToListButton inList={inList} onClick={toggleList} />
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-text-secondary">{show.description}</p>

        <div className="mt-8 max-w-md rounded-2xl border border-borderc bg-surface p-5">
          <p className="font-semibold text-text-primary">Rate this show</p>
          <div className="mt-2 flex items-center gap-4">
            <RatingStars value={myRating ? myRating.rating : 0} onChange={handleRate} />
            {myRating && (
              <button type="button" onClick={handleRemoveRating} className="text-xs text-text-secondary hover:text-red-500">Remove rating</button>
            )}
          </div>
        </div>

        {/* Seasons & episodes */}
        <section className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">Episodes</h2>
            {(seasons || []).length > 0 && (
              <div className="w-44">
                <Select value={seasonId} onChange={(e) => setSeasonId(e.target.value)} aria-label="Select season">
                  {(seasons || []).map((s) => (
                    <option key={s.id} value={s.id}>{s.title || 'Season ' + s.season_number}</option>
                  ))}
                </Select>
              </div>
            )}
          </div>
          {currentSeason && currentSeason.episodes && currentSeason.episodes.length > 0 ? (
            <div className="space-y-3">
              {currentSeason.episodes.map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} progress={episodeProgress.get(ep.id)} />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary">No episodes available yet.</p>
          )}
        </section>

        {similar && similar.length > 0 && (
          <section className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold text-text-primary">More Like This</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {similar.map((s) => <MovieCard key={s.id} item={s} type="show" />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
