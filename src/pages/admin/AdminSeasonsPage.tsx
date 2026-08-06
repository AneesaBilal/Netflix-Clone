import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminFetchSeasons, createSeason, updateSeason, deleteSeason } from '../../services/seasonService';
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
import type { Season } from '../../types';

const schema = z.object({
  showId: z.string().min(1, 'Select a show'),
  seasonNumber: z.coerce.number().int().min(1, 'Must be at least 1'),
  title: z.string().optional(),
  description: z.string().optional(),
  poster_url: z.string().optional(),
  release_year: z.coerce.number().int().optional().or(z.literal('')),
});
type SeasonFormValues = z.infer<typeof schema>;

export default function AdminSeasonsPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Season | null>(null);
  const [deleting, setDeleting] = useState<Season | null>(null);

  const { data: seasons, isLoading } = useQuery({ queryKey: ['admin', 'seasons'], queryFn: adminFetchSeasons });
  const { data: shows } = useQuery({ queryKey: ['admin', 'shows'], queryFn: adminFetchShows });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SeasonFormValues>({
    resolver: zodResolver(schema),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'seasons'] });
    queryClient.invalidateQueries({ queryKey: ['seasons'] });
  };

  const createMutation = useMutation({
    mutationFn: (values: SeasonFormValues) => createSeason({
      showId: values.showId,
      seasonNumber: values.seasonNumber,
      title: values.title,
      description: values.description,
      posterUrl: values.poster_url,
      releaseYear: typeof values.release_year === 'number' ? values.release_year : null,
    }),
    onSuccess: () => { invalidate(); setFormOpen(false); success('Season created.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: SeasonFormValues) => updateSeason(editing!.id, {
      showId: values.showId,
      seasonNumber: values.seasonNumber,
      title: values.title,
      description: values.description,
      posterUrl: values.poster_url,
      releaseYear: typeof values.release_year === 'number' ? values.release_year : null,
    }),
    onSuccess: () => { invalidate(); setFormOpen(false); setEditing(null); success('Season updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSeason(deleting!.id),
    onSuccess: () => { invalidate(); setDeleting(null); success('Season deleted.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const openCreate = () => {
    setEditing(null);
    reset({ showId: '', seasonNumber: 1, title: '', description: '', poster_url: '', release_year: '' });
    setFormOpen(true);
  };

  const openEdit = (season: Season) => {
    setEditing(season);
    reset({
      showId: season.show_id,
      seasonNumber: season.season_number,
      title: season.title || '',
      description: season.description || '',
      poster_url: season.poster_url || '',
      release_year: season.release_year != null ? season.release_year : '',
    });
    setFormOpen(true);
  };

  const showTitle = (id: string) => {
    const show = (shows || []).find((s) => s.id === id);
    return show ? show.title : 'Unknown show';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Seasons</h2>
          <p className="text-sm text-text-secondary">{(seasons || []).length} seasons</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Season</Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borderc bg-surface">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-borderc text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Show</th>
                <th className="px-4 py-3 font-medium">Season</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(seasons || []).map((season) => (
                <tr key={season.id} className="border-b border-borderc last:border-0 hover:bg-surface-hover/40">
                  <td className="px-4 py-3 font-medium text-text-primary">{showTitle(season.show_id)}</td>
                  <td className="px-4 py-3 text-text-secondary">{season.season_number}</td>
                  <td className="px-4 py-3 text-text-secondary">{season.title || 'Season ' + season.season_number}</td>
                  <td className="px-4 py-3 text-text-secondary">{season.release_year || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(season)} aria-label="Edit season" className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"><Pencil className="h-4 w-4" /></button>
                      <button type="button" onClick={() => setDeleting(season)} aria-label="Delete season" className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} title={editing ? 'Edit season' : 'Add season'}>
        <form onSubmit={handleSubmit((values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values)))} className="space-y-4">
          <Select label="TV Show" error={errors.showId?.message} {...register('showId')}>
            <option value="">Select a show...</option>
            {(shows || []).map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </Select>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Season number" type="number" min={1} error={errors.seasonNumber?.message} {...register('seasonNumber')} />
            <Input label="Release year" type="number" {...register('release_year')} />
          </div>
          <Input label="Title" {...register('title')} />
          <Input label="Poster URL" {...register('poster_url')} />
          <Textarea label="Description" rows={3} {...register('description')} />
          <div className="flex justify-end gap-3 border-t border-borderc pt-4">
            <Button type="button" variant="secondary" onClick={() => { setFormOpen(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editing ? 'Save changes' : 'Create season'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete season?"
        message="This will delete this season and all of its episodes."
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
