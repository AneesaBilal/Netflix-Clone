import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { History, Trash2 } from 'lucide-react';
import { fetchHistory, removeHistoryItem, clearHistory } from '../../services/historyService';
import { useProfileStore } from '../../stores/profileStore';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../lib/utils';

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const { success, error: toastError } = useToast();
  const profileId = activeProfile ? activeProfile.id : '';
  const [confirmClear, setConfirmClear] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ['history', profileId],
    queryFn: () => fetchHistory(profileId),
    enabled: Boolean(profileId),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['history'] });
    queryClient.invalidateQueries({ queryKey: ['continue-watching'] });
  };

  const handleRemove = async (id: string) => {
    try {
      await removeHistoryItem(id);
      success('Removed from history.');
      invalidate();
    } catch (err) {
      toastError('Could not remove item.');
    }
  };

  const handleClear = async () => {
    try {
      await clearHistory(profileId);
      success('Watch history cleared.');
      invalidate();
      setConfirmClear(false);
    } catch (err) {
      toastError('Could not clear history.');
    }
  };

  return (
    <div className="space-y-6 px-4 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Watch History</h1>
          <p className="mt-1 text-text-secondary">Everything you have watched on this profile.</p>
        </div>
        {items && items.length > 0 && (
          <Button variant="outline" onClick={() => setConfirmClear(true)}>Clear watch history</Button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : !items || items.length === 0 ? (
        <EmptyState icon={<History className="h-10 w-10" />} title="Your watch history is empty." description="Titles you watch will appear here." actionLabel="Browse titles" actionTo="/browse" />
      ) : (
        <ul className="divide-y divide-borderc rounded-2xl border border-borderc bg-surface">
          {items.map((item) => {
            const title = item.movie ? item.movie.title : item.episode ? item.episode.title : 'Untitled';
            const subtitle = item.episode && item.episode.show ? item.episode.show.title + ' · Episode ' + item.episode.episode_number : 'Movie';
            const poster = item.movie ? item.movie.poster_url : item.episode ? item.episode.thumbnail_url : null;
            return (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <img src={poster || 'https://picsum.photos/seed/h/120/160'} alt="" className="h-16 w-12 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-primary">{title}</p>
                  <p className="text-sm text-text-secondary">{subtitle} · {formatDate(item.watched_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  aria-label={'Remove ' + title + ' from history'}
                  className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Clear watch history?"
        message="This will permanently remove every item from this profile's watch history."
        confirmLabel="Clear all"
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
