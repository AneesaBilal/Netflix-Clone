import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getArchiveDetails } from '../../services/archiveService';
import { VideoPlayer } from '../../components/player/VideoPlayer';
import { PageLoader } from '../../components/layout/PageLoader';
import { ErrorState } from '../../components/ui/ErrorState';

export default function WatchArchivePage() {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['archive-details', id],
    queryFn: () => getArchiveDetails(id || '', 'movie'),
    enabled: Boolean(id),
  });

  if (isLoading) return <PageLoader />;
  if (!data) {
    return <ErrorState message="This title is not available right now." />;
  }

  return (
    <VideoPlayer
      src={data.video_url}
      title={data.title}
      startAt={0}
      onProgress={() => undefined}
    />
  );
}
