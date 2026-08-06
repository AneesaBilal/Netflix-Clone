import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTrailerKey } from '../../services/tmdbService';
import { TrailerPlayer } from '../../components/player/TrailerPlayer';
import { PageLoader } from '../../components/layout/PageLoader';
import { ErrorState } from '../../components/ui/ErrorState';

export default function WatchTmdbPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';

  const { data: key, isLoading } = useQuery({
    queryKey: ['tmdb-trailer', id, type],
    queryFn: () => getTrailerKey(Number(id), type),
    enabled: Boolean(id),
  });

  if (isLoading) return <PageLoader />;
  if (!key) return <ErrorState message="No official trailer available for this title." />;

  return <TrailerPlayer youtubeKey={key} title="Official Trailer" />;
}
