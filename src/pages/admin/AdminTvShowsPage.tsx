import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { adminFetchShows, createShow, updateShow, deleteShow } from '../../services/tvShowService';
import { fetchGenres } from '../../services/genreService';
import { ShowForm } from './ShowForm';
import type { ShowFormSchema } from './ShowForm';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';
import type { TvShow } from '../../types';

export default function AdminTvShowsPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TvShow | null>(null);
  const [deleting, setDeleting] = useState<TvShow | null>(null);

  const { data: shows, isLoading } = useQuery({ queryKey: ['admin', 'shows'], queryFn: adminFetchShows });
  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'shows'] });
    queryClient.invalidateQueries({ queryKey: ['shows'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
  };

  const createMutation = useMutation({
    mutationFn: (values: ShowFormSchema) => createShow(values as any),
    onSuccess: () => { invalidate(); setFormOpen(false); success('Show created.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: ShowFormSchema) => updateShow(editing!.id, values as any),
    onSuccess: () => { invalidate(); setFormOpen(false); setEditing(null); success('Show updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteShow(deleting!.id),
    onSuccess: () => { invalidate(); setDeleting(null); success('Show deleted.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const filtered = (shows || []).filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">TV Shows</h2>
          <p className="text-sm text-text-secondary">{(shows || []).length} series</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="h-4 w-4" /> Add Show</Button>
      </div>

      <div className="max-w-sm">
        <Input placeholder="Search shows..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search shows" />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borderc bg-surface">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-borderc text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Poster</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((show) => (
                <tr key={show.id} className="border-b border-borderc last:border-0 hover:bg-surface-hover/40">
                  <td className="px-4 py-3"><img src={show.poster_url || 'https://picsum.photos/seed/x/80/120'} alt="" className="h-14 w-10 rounded object-cover" /></td>
                  <td className="px-4 py-3 font-medium text-text-primary">{show.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{show.release_year || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{show.rating != null ? Number(show.rating).toFixed(1) : '—'}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => updateMutation.mutate({ title: show.title, slug: show.slug, published: !show.published, featured: show.featured, genreIds: (show.genres || []).map((g) => g.id) })} className={show.published ? 'text-green-500' : 'text-text-secondary'} aria-label="Toggle published">
                      {show.published ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => updateMutation.mutate({ title: show.title, slug: show.slug, published: show.published, featured: !show.featured, genreIds: (show.genres || []).map((g) => g.id) })} className={show.featured ? 'text-yellow-400' : 'text-text-secondary'} aria-label="Toggle featured">
                      <Star className={'h-5 w-5 ' + (show.featured ? 'fill-yellow-400' : '')} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => { setEditing(show); setFormOpen(true); }} aria-label={'Edit ' + show.title} className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"><Pencil className="h-4 w-4" /></button>
                      <button type="button" onClick={() => setDeleting(show)} aria-label={'Delete ' + show.title} className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} title={editing ? 'Edit show' : 'Add show'} wide>
        <ShowForm
          initial={editing}
          genres={genres || []}
          submitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete show?"
        message={'This will permanently delete "' + (deleting ? deleting.title : '') + '" and all of its seasons and episodes.'}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
