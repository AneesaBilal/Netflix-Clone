import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { adminFetchMovies, createMovie, updateMovie, deleteMovie } from '../../services/movieService';
import { fetchGenres } from '../../services/genreService';
import { MovieForm } from './MovieForm';
import type { MovieFormSchema } from './MovieForm';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/utils';
import type { Movie } from '../../types';

export default function AdminMoviesPage() {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [deleting, setDeleting] = useState<Movie | null>(null);

  const { data: movies, isLoading } = useQuery({ queryKey: ['admin', 'movies'], queryFn: adminFetchMovies });
  const { data: genres } = useQuery({ queryKey: ['genres'], queryFn: fetchGenres });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] });
    queryClient.invalidateQueries({ queryKey: ['movies'] });
    queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
  };

  const createMutation = useMutation({
    mutationFn: (values: MovieFormSchema) => createMovie(values as any),
    onSuccess: () => { invalidate(); setFormOpen(false); success('Movie created.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: MovieFormSchema) => updateMovie(editing!.id, values as any),
    onSuccess: () => { invalidate(); setFormOpen(false); setEditing(null); success('Movie updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteMovie(deleting!.id),
    onSuccess: () => { invalidate(); setDeleting(null); success('Movie deleted.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const toggleMutation = useMutation({
    mutationFn: async (movie: Movie) =>
      updateMovie(movie.id, {
        title: movie.title, slug: movie.slug, published: !movie.published, featured: movie.featured,
        description: movie.description || '', genreIds: (movie.genres || []).map((g) => g.id),
      } as any),
    onSuccess: () => { invalidate(); success('Movie updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const featureMutation = useMutation({
    mutationFn: async (movie: Movie) =>
      updateMovie(movie.id, {
        title: movie.title, slug: movie.slug, published: movie.published, featured: !movie.featured,
        description: movie.description || '', genreIds: (movie.genres || []).map((g) => g.id),
      } as any),
    onSuccess: () => { invalidate(); success('Featured status updated.'); },
    onError: (err) => toastError(friendlyError(err)),
  });

  const filtered = (movies || []).filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (movie: Movie) => { setEditing(movie); setFormOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Movies</h2>
          <p className="text-sm text-text-secondary">{(movies || []).length} titles</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Movie</Button>
      </div>

      <div className="max-w-sm">
        <Input placeholder="Search movies..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search movies" />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borderc bg-surface">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-borderc text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">Poster</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Genres</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((movie) => (
                <tr key={movie.id} className="border-b border-borderc last:border-0 hover:bg-surface-hover/40">
                  <td className="px-4 py-3">
                    <img src={movie.poster_url || 'https://picsum.photos/seed/x/80/120'} alt="" className="h-14 w-10 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">{movie.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{movie.release_year || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{(movie.genres || []).map((g) => g.name).slice(0, 2).join(', ') || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{movie.rating != null ? Number(movie.rating).toFixed(1) : '—'}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleMutation.mutate(movie)} aria-label={movie.published ? 'Unpublish' : 'Publish'} className={movie.published ? 'text-green-500' : 'text-text-secondary'}>
                      {movie.published ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => featureMutation.mutate(movie)} aria-label={movie.featured ? 'Unfeature' : 'Feature'} className={movie.featured ? 'text-yellow-400' : 'text-text-secondary'}>
                      <Star className={'h-5 w-5 ' + (movie.featured ? 'fill-yellow-400' : '')} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button type="button" onClick={() => openEdit(movie)} aria-label={'Edit ' + movie.title} className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setDeleting(movie)} aria-label={'Delete ' + movie.title} className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditing(null); }} title={editing ? 'Edit movie' : 'Add movie'} wide>
        <MovieForm
          initial={editing}
          genres={genres || []}
          submitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
          onCancel={() => { setFormOpen(false); setEditing(null); }}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete movie?"
        message={'This will permanently delete "' + (deleting ? deleting.title : '') + '".'}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
