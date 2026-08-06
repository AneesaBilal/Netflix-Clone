import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEpisodeById } from '../../services/tvShowService';
import { fetchProgress, saveProgress } from '../../services/progressService';
import { addHistory } from '../../services/historyService';
import { VideoPlayer } from '../../components/player/VideoPlayer';
import { PageLoader } from '../../components/layout/PageLoader';
import { ErrorState } from '../../components/ui/ErrorState';
import { useProfileStore } from '../../stores/profileStore';

export default function WatchEpisodePage() {
  const { id } = useParams();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const profileId = activeProfile ? activeProfile.id : '';

  const { data: episode, isLoading } = useQuery({
    queryKey: ['episode', id],
    queryFn: () => fetchEpisodeById(id || ''),
    enabled: Boolean(id),
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', 'episode', id, profileId],
    queryFn: () => fetchProgress({ profileId, episodeId: id }),
    enabled: Boolean(id && profileId),
  });

  if (isLoading) return <PageLoader />;
  if (!episode || !episode.video_url) {
    return <ErrorState message="This episode is not available." />;
  }

  const showTitle = (episode as any).show ? (episode as any).show.title : '';
  const title = showTitle ? showTitle + ' · ' + episode.title : episode.title;

  const handleProgress = async (currentSeconds: number, durationSeconds: number, completed: boolean) => {
    if (!profileId) return;
    try {
      await saveProgress({ profileId, episodeId: episode.id, currentSeconds, durationSeconds, completed });
      await addHistory({ profileId, episodeId: episode.id });
    } catch (err) {
      // best-effort
    }
  };

  return (
    <VideoPlayer
      src={episode.video_url}
      title={title}
      startAt={progress ? progress.current_seconds : 0}
      onProgress={handleProgress}
    />
  );
}
