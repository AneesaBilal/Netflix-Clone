import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { List, Trash2 } from 'lucide-react';
import { fetchMyList, removeFromMyList } from '../../services/myListService';
import { useProfileStore } from '../../stores/profileStore';
import { MovieCard } from '../../components/movie/MovieCard';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../hooks/useToast';

export default function MyListPage() {
  const queryClient = useQueryClient();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { success, error: toastError } = useToast();
  const profileId = activeProfile ? activeProfile.id : '';

  const { data: items, isLoading } = useQuery({
    queryKey: ['my-list', profileId],
    queryFn: () => fetchMyList(profileId),
    enabled: Boolean(profileId),
  });

  const handleRemove = async (movieId?: string, showId?: string) => {
    try {
      await removeFromMyList({ profileId, movieId, showId });
      success('Removed from My List.');
      queryClient.invalidateQueries({ queryKey: ['my-list'] });
      queryClient.invalidateQueries({ queryKey: ['my-list-ids'] });
    } catch (err) {
      toastError('Could not remove from your list.');
    }
  };

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">My List</h1>
        <p className="mt-1 text-text-secondary">Everything you have saved for later.</p>
      </div>

      {isLoading ? (
        <GridSkeleton count={10} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={<List className="h-10 w-10" />}
          title="Your list is waiting for something great."
          description="Add movies and shows to keep them one tap away."
          actionLabel="Browse titles"
          actionTo="/browse"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((entry) => {
            const item = entry.movie || entry.show;
            if (!item) return null;
            const type = entry.movie ? 'movie' : 'show';
            return (
              <div key={entry.id} className="relative">
                <MovieCard item={item} type={type} inList onToggleList={() => handleRemove(entry.movie_id || undefined, entry.show_id || undefined)} />
                <button
                  type="button"
                  onClick={() => handleRemove(entry.movie_id || undefined, entry.show_id || undefined)}
                  aria-label={'Remove ' + item.title + ' from My List'}
                  className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white hover:bg-primary"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
