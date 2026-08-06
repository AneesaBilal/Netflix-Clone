import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { fetchFeaturedContent, createFeaturedContent, deleteFeaturedContent, toggleFeaturedActive } from '../../services/adminService';
import { adminFetchMovies } from '../../services/movieService';
import { adminFetchShows } from '../../services/tvShowService';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';

export default function AdminFeaturedPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [contentType, setContentType] = useState<'movie' | 'show'>('movie');

  const { data: featured, isLoading } = useQuery({ queryKey: ['admin', 'featured'], queryFn: fetchFeaturedContent });
  const { data: movies } = useQuery({ queryKey: ['admin', 'movies'], queryFn: adminFetchMovies });
  const { data: shows } = useQuery({ queryKey: ['admin', 'shows'], queryFn: adminFetchShows });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    contentId: string;
    position: number;
  }>();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'featured'] });
    queryClient.invalidateQueries({ queryKey: ['hero'] });
  };

  const createMutation = useMutation({
    mutationFn: (values: { contentId: string; position: number }) =>
      createFeaturedContent({
        contentType,
        movieId: contentType === 'movie' ? values.contentId : undefined,
        showId: contentType === 'show' ? values.contentId : undefined,
        position: values.position,
      }),
    onSuccess: () => { invalidate(); setFormOpen(false); success('Featured content added.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFeaturedContent(id),
    onSuccess: () => { invalidate(); success('Removed from featured.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleFeaturedActive(id, isActive),
    onSuccess: () => { invalidate(); success('Updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Featured Content</h2>
          <p className="text-sm text-text-secondary">Control what appears in the homepage hero.</p>
        </div>
        <Button onClick={() => { reset({ contentId: '', position: 0 }); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Featured
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borderc bg-surface">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-borderc text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(featured || []).map((item) => {
                const title = item.movie ? item.movie.title : item.show ? item.show.title : 'Unknown';
                return (
                  <tr key={item.id} className="border-b border-borderc last:border-0 hover:bg-surface-hover/40">
                    <td className="px-4 py-3 text-text-secondary">{item.position}</td>
                    <td className="px-4 py-3 capitalize text-text-secondary">{item.content_type}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{title}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => toggleMutation.mutate({ id: item.id, isActive: !item.is_active })} className={item.is_active ? 'text-green-500' : 'text-text-secondary'} aria-label="Toggle active">
                        {item.is_active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => deleteMutation.mutate(item.id)} aria-label="Remove featured" className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add featured content">
        <form onSubmit={handleSubmit((values) => createMutation.mutate(values))} className="space-y-4">
          <Select label="Content type" value={contentType} onChange={(e) => setContentType(e.target.value as 'movie' | 'show')}>
            <option value="movie">Movie</option>
            <option value="show">TV Show</option>
          </Select>
          <Select label="Select title" error={errors.contentId?.message} {...register('contentId', { required: true })}>
            <option value="">Choose...</option>
            {contentType === 'movie'
              ? (movies || []).map((m) => <option key={m.id} value={m.id}>{m.title}</option>)
              : (shows || []).map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </Select>
          <Input label="Position (hero order)" type="number" min={0} {...register('position', { valueAsNumber: true })} />
          <div className="flex justify-end gap-3 border-t border-borderc pt-4">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Add</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
