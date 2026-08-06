import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMovieById } from '../../services/movieService';
import { fetchProgress, saveProgress } from '../../services/progressService';
import { addHistory } from '../../services/historyService';
import { VideoPlayer } from '../../components/player/VideoPlayer';
import { PageLoader } from '../../components/layout/PageLoader';
import { ErrorState } from '../../components/ui/ErrorState';
import { useProfileStore } from '../../stores/profileStore';

export default function WatchMoviePage() {
  const { id } = useParams();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const profileId = activeProfile ? activeProfile.id : '';

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie-by-id', id],
    queryFn: () => fetchMovieById(id || ''),
    enabled: Boolean(id),
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', 'movie', id, profileId],
    queryFn: () => fetchProgress({ profileId, movieId: id }),
    enabled: Boolean(id && profileId),
  });

  if (isLoading) return <PageLoader />;
  if (!movie || !movie.video_url) {
    return <ErrorState message="This video is not available." />;
  }

  const handleProgress = async (currentSeconds: number, durationSeconds: number, completed: boolean) => {
    if (!profileId) return;
    try {
      await saveProgress({ profileId, movieId: movie.id, currentSeconds, durationSeconds, completed });
      await addHistory({ profileId, movieId: movie.id });
    } catch (err) {
      // Progress saving is best-effort; do not interrupt playback.
    }
  };

  return (
    <VideoPlayer
      src={movie.video_url}
      title={movie.title}
      startAt={progress ? progress.current_seconds : 0}
      onProgress={handleProgress}
    />
  );
}
