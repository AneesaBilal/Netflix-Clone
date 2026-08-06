import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFeaturedMovies, fetchMovies } from '../../services/movieService';
import { fetchFeaturedShows, fetchTvShows } from '../../services/tvShowService';
import { fetchHeroContent } from '../../services/adminService';
import { fetchContinueWatching } from '../../services/progressService';
import { fetchMyList, fetchMyListIds, addToMyList, removeFromMyList } from '../../services/myListService';
import { HeroBanner } from '../../components/movie/HeroBanner';
import { ContentRow } from '../../components/movie/ContentRow';
import { HeroSkeleton, ContentRowSkeleton } from '../../components/ui/Skeleton';
import { useProfileStore } from '../../stores/profileStore';
import { useToast } from '../../hooks/useToast';
import type { Movie, TvShow, FeaturedContent } from '../../types';
import { fetchTrending, fetchPopularMovies, fetchPopularTV } from '../../services/tmdbService';
import { TmdbRow } from '../../components/movie/TmdbRow';

export default function HomePage() {
  const queryClient = useQueryClient();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { success, error: toastError } = useToast();
  const kidsOnly = Boolean(activeProfile && activeProfile.is_kids);
  const profileId = activeProfile ? activeProfile.id : '';

  const { data: hero, isLoading: heroLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: fetchHeroContent,
  });

  const { data: trendingMovies, isLoading: trendingLoading } = useQuery({
    queryKey: ['movies', 'trending', kidsOnly],
    queryFn: () => fetchMovies({ kidsOnly, orderBy: 'created_at', limit: 20 }),
  });

  const { data: popularShows } = useQuery({
    queryKey: ['shows', 'popular', kidsOnly],
    queryFn: () => fetchTvShows({ kidsOnly, orderBy: 'rating', limit: 20 }),
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ['movies', 'top-rated', kidsOnly],
    queryFn: () => fetchMovies({ kidsOnly, orderBy: 'rating', limit: 20 }),
  });

  const { data: newReleases } = useQuery({
    queryKey: ['movies', 'new', kidsOnly],
    queryFn: () => fetchMovies({ kidsOnly, orderBy: 'release_year', limit: 20 }),
  });

  const { data: continueWatching } = useQuery({
    queryKey: ['continue-watching', profileId],
    queryFn: () => fetchContinueWatching(profileId),
    enabled: Boolean(profileId),
  });

  const { data: myList } = useQuery({
    queryKey: ['my-list', profileId],
    queryFn: () => fetchMyList(profileId),
    enabled: Boolean(profileId),
  });

  const { data: listIds } = useQuery({
    queryKey: ['my-list-ids', profileId],
    queryFn: () => fetchMyListIds(profileId),
    enabled: Boolean(profileId),
  });

  const heroItems = React.useMemo(() => {
    const items: Array<{ type: 'movie' | 'show'; data: Movie | TvShow }> = [];
    (hero || []).forEach((f: FeaturedContent) => {
      if (f.content_type === 'movie' && f.movie) items.push({ type: 'movie', data: f.movie });
      if (f.content_type === 'show' && f.show) items.push({ type: 'show', data: f.show });
    });
    if (items.length === 0 && trendingMovies) {
      trendingMovies.slice(0, 4).forEach((m) => items.push({ type: 'movie', data: m }));
    }
    if (kidsOnly) {
      return items.filter((i) => !i.data.age_rating || i.data.age_rating === 'G' || i.data.age_rating === 'PG');
    }
    return items;
  }, [hero, trendingMovies, kidsOnly]);

  const progressById = React.useMemo(() => {
    const map = new Map<string, number>();
    (continueWatching || []).forEach((p) => {
      const pct = p.duration_seconds > 0 ? (p.current_seconds / p.duration_seconds) * 100 : 0;
      if (p.movie_id) map.set(p.movie_id, pct);
      if (p.episode) map.set(p.episode.show_id || '', pct);
    });
    return map;
  }, [continueWatching]);

  const continueItems = React.useMemo(() => {
    const seen = new Set<string>();
    const items: Array<Movie | TvShow> = [];
    (continueWatching || []).forEach((p) => {
      if (p.movie && !seen.has(p.movie.id)) {
        seen.add(p.movie.id);
        items.push(p.movie);
      } else if (p.episode && p.episode.show && !seen.has(p.episode.show.id)) {
        seen.add(p.episode.show.id);
        items.push(p.episode.show as unknown as TvShow);
      }
    });
    return items;
  }, [continueWatching]);

  const myListItems = React.useMemo(() => {
    const items: Array<Movie | TvShow> = [];
    (myList || []).forEach((entry) => {
      if (entry.movie) items.push(entry.movie);
      if (entry.show) items.push(entry.show);
    });
    return items;
  }, [myList]);

  const { data: tmdbTrending } = useQuery({ queryKey: ['tmdb', 'trending'], queryFn: fetchTrending });
  const { data: tmdbMovies } = useQuery({ queryKey: ['tmdb', 'movies'], queryFn: fetchPopularMovies });
  const { data: tmdbTv } = useQuery({ queryKey: ['tmdb', 'tv'], queryFn: fetchPopularTV });

  const movieListIds = listIds ? listIds.movieIds : new Set<string>();
  const showListIds = listIds ? listIds.showIds : new Set<string>();

  const handleToggleList = async (item: Movie | TvShow, kind: 'movie' | 'show') => {
    if (!profileId) return;
    const set = kind === 'movie' ? movieListIds : showListIds;
    const exists = set.has(item.id);
    try {
      if (exists) {
        await removeFromMyList({ profileId, movieId: kind === 'movie' ? item.id : undefined, showId: kind === 'show' ? item.id : undefined });
        success('Removed from My List.');
      } else {
        await addToMyList({ profileId, movieId: kind === 'movie' ? item.id : undefined, showId: kind === 'show' ? item.id : undefined });
        success('Added to My List.');
      }
      queryClient.invalidateQueries({ queryKey: ['my-list'] });
      queryClient.invalidateQueries({ queryKey: ['my-list-ids'] });
    } catch (err) {
      toastError('Could not update your list.');
      console.error(err);
    }
  };

  const isHeroInList = (item: { type: 'movie' | 'show'; data: Movie | TvShow }) =>
    item.type === 'movie' ? movieListIds.has(item.data.id) : showListIds.has(item.data.id);

  return (
    <div className="space-y-10 pb-10">
      {heroLoading ? <HeroSkeleton /> : (
        <HeroBanner
          items={heroItems}
          inList={isHeroInList}
          onToggleList={(item) => handleToggleList(item.data, item.type)}
        />
      )}

      {continueItems.length > 0 && (
        <ContentRow title="Continue Watching" items={continueItems} type="movie" progressById={progressById} />
      )}

      {trendingLoading ? (
        <ContentRowSkeleton />
      ) : (
        <ContentRow
          title="Trending Now"
          items={trendingMovies || []}
          type="movie"
          listIds={movieListIds}
          onToggleList={(item) => handleToggleList(item, 'movie')}
        />
      )}

      <ContentRow
        title="Popular TV Shows"
        items={popularShows || []}
        type="show"
        listIds={showListIds}
        onToggleList={(item) => handleToggleList(item, 'show')}
      />

      <ContentRow
        title="Top Rated Movies"
        items={topRatedMovies || []}
        type="movie"
        listIds={movieListIds}
        onToggleList={(item) => handleToggleList(item, 'movie')}
      />

      <ContentRow
        title="New Releases"
        items={newReleases || []}
        type="movie"
        listIds={movieListIds}
        onToggleList={(item) => handleToggleList(item, 'movie')}
      />

      <TmdbRow title="Trending Worldwide (TMDB)" items={tmdbTrending || []} />
      <TmdbRow title="Popular Movies" items={tmdbMovies || []} />
      <TmdbRow title="Popular TV Shows" items={tmdbTv || []} />

      {myListItems.length > 0 && (
        <ContentRow title="My List" items={myListItems} type="movie" />
      )}
    </div>
  );
}
