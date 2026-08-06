import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchGenres, createGenre, updateGenre, deleteGenre } from '../../services/genreService';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../hooks/useToast';
import { friendlyError, slugify } from '../../lib/utils';
import type { Genre } from '../../types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
});
type GenreFormValues = z.infer<typeof schema>;

export default function AdminGenresPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Genre | null>(null);
  const [deleting, setDeleting] = useState<Genre | null>(null);

  const { data: genres, isLoading } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GenreFormValues>({
    resolver: zodResolver(schema),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['genres'] });

  const createMutation = useMutation({
    mutationFn: (values: GenreFormValues) => createGenre(values),
    onSuccess: () => { invalidate(); setFormOpen(false); success('Genre created.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: GenreFormValues) => updateGenre(editing!.id, values),
    onSuccess: () => { invalidate(); setFormOpen(false); setEditing(null); success('Genre updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteGenre(deleting!.id),
    onSuccess: () => { invalidate(); setDeleting(null); success('Genre deleted.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const openCreate = () => {
    setEditing(null);
    reset({ name: '', slug: '', description: '' });
    setFormOpen(true);
  };

  const openEdit = (genre: Genre) => {
    setEditing(genre);
    reset({ name: genre.name, slug: genre.slug, description: genre.description || '' });
    setFormOpen(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Genres</h2>
          <p className="text-sm text-text-secondary">{(genres || []).length} genres</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Genre</Button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borderc bg-surface">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-borderc text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(genres || []).map((genre) => (
                <tr key={genre.id} className="border-b border-borderc last:border-0 hover:bg-surface-hover/40">
                  <td className="px-4 py-3 font-medium text-text-primary">{genre.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{genre.slug}</td>
                  <td className="px-4 py-3 text-text-secondary">{genre.description || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(genre)} aria-label={'Edit ' + genre.name} className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"><Pencil className="h-4 w-4" /></button>
                      <button type="button" onClick={() => setDeleting(genre)} aria-label={'Delete ' + genre.name} className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} title={editing ? 'Edit genre' : 'Add genre'}>
        <form onSubmit={handleSubmit((values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values)))} className="space-y-4">
          <Input label="Name" error={errors.name?.message} {...register('name', { onChange: (e) => { if (!editing) setValue('slug', slugify(e.target.value)); } })} />
          <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
          <Textarea label="Description" rows={3} {...register('description')} />
          <div className="flex justify-end gap-3 border-t border-borderc pt-4">
            <Button type="button" variant="secondary" onClick={() => { setFormOpen(false); setEditing(null); }}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editing ? 'Save changes' : 'Create genre'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete genre?"
        message={'This will permanently delete "' + (deleting ? deleting.name : '') + '".'}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
