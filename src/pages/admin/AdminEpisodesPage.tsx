import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminFetchEpisodes, createEpisode, updateEpisode, deleteEpisode } from '../../services/episodeService';
import { adminFetchSeasons } from '../../services/seasonService';
import { adminFetchShows } from '../../services/tvShowService';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';
import type { Episode } from '../../types';

const schema = z.object({
  showId: z.string().min(1, 'Select a show'),
  seasonId: z.string().min(1, 'Select a season'),
  episodeNumber: z.coerce.number().int().min(1, 'Must be at least 1'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  thumbnail_url: z.string().optional(),
  video_url: z.string().optional(),
  duration_minutes: z.coerce.number().int().min(0).optional().or(z.literal('')),
  published: z.boolean(),
});
type EpisodeFormValues = z.infer<typeof schema>;

export default function AdminEpisodesPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Episode | null>(null);
  const [deleting, setDeleting] = useState<Episode | null>(null);
  const [selectedShow, setSelectedShow] = useState('');

  const { data: episodes, isLoading } = useQuery({ queryKey: ['admin', 'episodes'], queryFn: adminFetchEpisodes });
  const { data: seasons } = useQuery({ queryKey: ['admin', 'seasons'], queryFn: adminFetchSeasons });
  const { data: shows } = useQuery({ queryKey: ['admin', 'shows'], queryFn: adminFetchShows });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EpisodeFormValues>({
    resolver: zodResolver(schema),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'episodes'] });
    queryClient.invalidateQueries({ queryKey: ['seasons'] });
  };

  const createMutation = useMutation({
    mutationFn: (values: EpisodeFormValues) => createEpisode({
      seasonId: values.seasonId,
      showId: values.showId,
      episodeNumber: values.episodeNumber,
      title: values.title,
      description: values.description,
      thumbnailUrl: values.thumbnail_url,
      videoUrl: values.video_url,
      durationMinutes: typeof values.duration_minutes === 'number' ? values.duration_minutes : null,
      published: values.published,
    }),
    onSuccess: () => { invalidate(); setFormOpen(false); success('Episode created.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: EpisodeFormValues) => updateEpisode(editing!.id, {
      seasonId: values.seasonId,
      showId: values.showId,
      episodeNumber: values.episodeNumber,
      title: values.title,
      description: values.description,
      thumbnailUrl: values.thumbnail_url,
      videoUrl: values.video_url,
      durationMinutes: typeof values.duration_minutes === 'number' ? values.duration_minutes : null,
      published: values.published,
    }),
    onSuccess: () => { invalidate(); setFormOpen(false); setEditing(null); success('Episode updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteEpisode(deleting!.id),
    onSuccess: () => { invalidate(); setDeleting(null); success('Episode deleted.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const openCreate = () => {
    setEditing(null);
    reset({ showId: '', seasonId: '', episodeNumber: 1, title: '', description: '', thumbnail_url: '', video_url: '', duration_minutes: '', published: true });
    setFormOpen(true);
  };

  const openEdit = (episode: Episode) => {
    setEditing(episode);
    reset({
      showId: episode.show_id,
      seasonId: episode.season_id,
      episodeNumber: episode.episode_number,
      title: episode.title,
      description: episode.description || '',
      thumbnail_url: episode.thumbnail_url || '',
      video_url: episode.video_url || '',
      duration_minutes: episode.duration_minutes != null ? episode.duration_minutes : '',
      published: episode.published,
    });
    setFormOpen(true);
  };

  const seasonsForShow = (seasons || []).filter((s) => !selectedShow || s.show_id === selectedShow);
  const showTitle = (id: string) => {
    const show = (shows || []).find((s) => s.id === id);
    return show ? show.title : 'Unknown';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Episodes</h2>
          <p className="text-sm text-text-secondary">{(episodes || []).length} episodes</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Episode</Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borderc bg-surface">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-borderc text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Show</th>
                <th className="px-4 py-3 font-medium">Episode</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(episodes || []).map((episode) => (
                <tr key={episode.id} className="border-b border-borderc last:border-0 hover:bg-surface-hover/40">
                  <td className="px-4 py-3 font-medium text-text-primary">{showTitle(episode.show_id)}</td>
                  <td className="px-4 py-3 text-text-secondary">#{episode.episode_number}</td>
                  <td className="px-4 py-3 text-text-secondary">{episode.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{episode.duration_minutes != null ? episode.duration_minutes + 'm' : '—'}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => updateMutation.mutate({
                      showId: episode.show_id, seasonId: episode.season_id, episodeNumber: episode.episode_number,
                      title: episode.title, published: !episode.published,
                    })} className={episode.published ? 'text-green-500' : 'text-text-secondary'} aria-label="Toggle published">
                      {episode.published ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(episode)} aria-label="Edit episode" className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"><Pencil className="h-4 w-4" /></button>
                      <button type="button" onClick={() => setDeleting(episode)} aria-label="Delete episode" className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} title={editing ? 'Edit episode' : 'Add episode'} wide>
        <form onSubmit={handleSubmit((values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values)))} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="TV Show" error={errors.showId?.message} {...register('showId', { onChange: (e) => setSelectedShow(e.target.value) })}>
              <option value="">Select a show...</option>
              {(shows || []).map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </Select>
            <Select label="Season" error={errors.seasonId?.message} {...register('seasonId')}>
              <option value="">Select a season...</option>
              {seasonsForShow.map((s) => <option key={s.id} value={s.id}>Season {s.season_number}</option>)}
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Episode number" type="number" min={1} error={errors.episodeNumber?.message} {...register('episodeNumber')} />
            <Input label="Duration (minutes)" type="number" {...register('duration_minutes')} />
          </div>
          <Input label="Title" error={errors.title?.message} {...register('title')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Thumbnail URL" {...register('thumbnail_url')} />
            <Input label="Video URL" {...register('video_url')} />
          </div>
          <Textarea label="Description" rows={3} {...register('description')} />
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="checkbox" {...register('published')} className="h-4 w-4 accent-[var(--sf-primary)]" /> Published
          </label>
          <div className="flex justify-end gap-3 border-t border-borderc pt-4">
            <Button type="button" variant="secondary" onClick={() => { setFormOpen(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editing ? 'Save changes' : 'Create episode'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete episode?"
        message={'This will permanently delete "' + (deleting ? deleting.title : '') + '".'}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
