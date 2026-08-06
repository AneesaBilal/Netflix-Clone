import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { AGE_RATINGS } from '../../lib/constants';
import { slugify } from '../../lib/utils';
import type { Movie, Genre } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  poster_url: z.string().optional(),
  backdrop_url: z.string().optional(),
  trailer_url: z.string().optional(),
  video_url: z.string().optional(),
  release_year: z.coerce.number().int().min(1900).max(2100).optional().or(z.literal('')),
  runtime_minutes: z.coerce.number().int().min(0).optional().or(z.literal('')),
  age_rating: z.string().optional(),
  language: z.string().optional(),
  country: z.string().optional(),
  director: z.string().optional(),
  cast_members: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional().or(z.literal('')),
  featured: z.boolean(),
  published: z.boolean(),
  genreIds: z.array(z.string()),
});

export type MovieFormSchema = z.infer<typeof schema>;

interface MovieFormProps {
  initial?: Movie | null;
  genres: Genre[];
  submitting: boolean;
  onSubmit: (values: MovieFormSchema) => void;
  onCancel: () => void;
}

export function MovieForm({ initial, genres, submitting, onSubmit, onCancel }: MovieFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<MovieFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial ? initial.title : '',
      slug: initial ? initial.slug : '',
      description: initial && initial.description ? initial.description : '',
      poster_url: initial && initial.poster_url ? initial.poster_url : '',
      backdrop_url: initial && initial.backdrop_url ? initial.backdrop_url : '',
      trailer_url: initial && initial.trailer_url ? initial.trailer_url : '',
      video_url: initial && initial.video_url ? initial.video_url : '',
      release_year: initial && initial.release_year != null ? initial.release_year : '',
      runtime_minutes: initial && initial.runtime_minutes != null ? initial.runtime_minutes : '',
      age_rating: initial && initial.age_rating ? initial.age_rating : '',
      language: initial && initial.language ? initial.language : '',
      country: initial && initial.country ? initial.country : '',
      director: initial && initial.director ? initial.director : '',
      cast_members: initial && initial.cast_members ? initial.cast_members.join(', ') : '',
      rating: initial && initial.rating != null ? Number(initial.rating) : '',
      featured: initial ? initial.featured : false,
      published: initial ? initial.published : false,
      genreIds: initial && initial.genres ? initial.genres.map((g) => g.id) : [],
    },
  });

  const title = watch('title');
  useEffect(() => {
    if (!initial) {
      setValue('slug', slugify(title));
    }
  }, [title, initial, setValue]);

  const genreIds = watch('genreIds');

  const toggleGenre = (id: string) => {
    const next = genreIds.includes(id) ? genreIds.filter((g) => g !== id) : [...genreIds, id];
    setValue('genreIds', next);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <Input label="Slug" error={errors.slug?.message} {...register('slug')} />
      </div>
      <Textarea label="Description" rows={3} error={errors.description?.message} {...register('description')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Poster URL" placeholder="https://..." {...register('poster_url')} />
        <Input label="Backdrop URL" placeholder="https://..." {...register('backdrop_url')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Trailer URL" placeholder="https://..." {...register('trailer_url')} />
        <Input label="Video URL" placeholder="https://..." {...register('video_url')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Release year" type="number" {...register('release_year')} />
        <Input label="Runtime (min)" type="number" {...register('runtime_minutes')} />
        <Input label="Rating (0-5)" type="number" step="0.1" {...register('rating')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select label="Age rating" {...register('age_rating')}>
          <option value="">Select...</option>
          {AGE_RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
        </Select>
        <Input label="Language" {...register('language')} />
        <Input label="Country" {...register('country')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Director" {...register('director')} />
        <Input label="Cast (comma separated)" {...register('cast_members')} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-text-secondary">Genres</p>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => toggleGenre(g.id)}
              className={
                'rounded-full border px-3 py-1 text-xs font-medium ' +
                (genreIds.includes(g.id)
                  ? 'border-primary bg-primary/15 text-primary'
                  : 'border-borderc text-text-secondary hover:bg-surface-hover')
              }
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" {...register('featured')} className="h-4 w-4 accent-[var(--sf-primary)]" /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input type="checkbox" {...register('published')} className="h-4 w-4 accent-[var(--sf-primary)]" /> Published
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-borderc pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>{initial ? 'Save changes' : 'Create movie'}</Button>
      </div>
    </form>
  );
}
