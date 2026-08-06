import { supabase } from '../lib/supabase';
import type { Movie } from '../types';

const MOVIE_SELECT = '*, genres:streamflix_movie_genres(genre:streamflix_genres(*))';

function attachGenres(rows: any[]): Movie[] {
  return rows.map((row) => {
    const genres = (row.genres || [])
      .map((g: any) => g.genre)
      .filter(Boolean);
    const copy = { ...row } as Movie;
    copy.genres = genres;
    delete (copy as any).genres_raw;
    return copy;
  });
}

function kidsFilter() {
  return 'age_rating.in.(G,PG)';
}

export async function fetchFeaturedMovies(kidsOnly = false): Promise<Movie[]> {
  let query = supabase
    .from('streamflix_movies')
    .select(MOVIE_SELECT)
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(10);
  if (kidsOnly) {
    query = query.filter('age_rating', 'in', '(G,PG)');
  }
  const { data, error } = await query;
  if (error) throw error;
  return attachGenres(data || []);
}

export async function fetchMovies(options?: {
  kidsOnly?: boolean;
  genreId?: string;
  limit?: number;
  orderBy?: 'created_at' | 'rating' | 'release_year';
}): Promise<Movie[]> {
  let query = supabase
    .from('streamflix_movies')
    .select(MOVIE_SELECT)
    .eq('published', true)
    .order(options?.orderBy || 'created_at', { ascending: false })
    .limit(options?.limit || 30);
  if (options?.kidsOnly) {
    query = query.filter('age_rating', 'in', '(G,PG)');
  }
  const { data, error } = await query;
  if (error) throw error;
  let movies = attachGenres(data || []);
  if (options?.genreId) {
    movies = movies.filter((m) => (m.genres || []).some((g) => g.id === options.genreId));
  }
  return movies;
}

export async function fetchMoviesByGenreIds(genreIds: string[], kidsOnly = false): Promise<Movie[]> {
  if (genreIds.length === 0) return [];
  // Fetch published movies, then filter client-side by shared genres.
  let query = supabase
    .from('streamflix_movies')
    .select(MOVIE_SELECT)
    .eq('published', true)
    .limit(60);
  if (kidsOnly) {
    query = query.filter('age_rating', 'in', '(G,PG)');
  }
  const res = await query;
  if (res.error) throw res.error;
  const movies = attachGenres(res.data || []);
  return movies.filter((m) =>
    (m.genres || []).some((g) => genreIds.includes(g.id))
  );
}

export async function fetchMovieBySlug(slug: string): Promise<Movie | null> {
  const { data, error } = await supabase
    .from('streamflix_movies')
    .select(MOVIE_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return attachGenres([data])[0];
}

export async function fetchMovieById(id: string): Promise<Movie | null> {
  const { data, error } = await supabase
    .from('streamflix_movies')
    .select(MOVIE_SELECT)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return attachGenres([data])[0];
}

export async function fetchMoreLikeMovies(movie: Movie, limit = 12): Promise<Movie[]> {
  const genreIds = (movie.genres || []).map((g) => g.id);
  const candidates = await fetchMoviesByGenreIds(genreIds);
  return candidates
    .filter((m) => m.id !== movie.id)
    .slice(0, limit);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const pattern = '%' + query + '%';
  const { data, error } = await supabase
    .from('streamflix_movies')
    .select(MOVIE_SELECT)
    .eq('published', true)
    .or('title.ilike.' + pattern + ',director.ilike.' + pattern)
    .limit(30);
  if (error) throw error;
  return attachGenres(data || []);
}

export interface MovieFormValues {
  title: string;
  slug: string;
  description?: string;
  poster_url?: string;
  backdrop_url?: string;
  trailer_url?: string;
  video_url?: string;
  release_year?: number | '' | null;
  runtime_minutes?: number | '' | null;
  age_rating?: string;
  language?: string;
  country?: string;
  director?: string;
  cast_members?: string;
  rating?: number | '' | null;
  featured?: boolean;
  published?: boolean;
  genreIds?: string[];
}

export async function adminFetchMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('streamflix_movies')
    .select(MOVIE_SELECT)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return attachGenres(data || []);
}

export async function createMovie(values: MovieFormValues): Promise<Movie> {
  const payload = {
    title: values.title,
    slug: values.slug,
    description: values.description || null,
    poster_url: values.poster_url || null,
    backdrop_url: values.backdrop_url || null,
    trailer_url: values.trailer_url || null,
    video_url: values.video_url || null,
    release_year: (values.release_year === "" || values.release_year == null ? null : Number(values.release_year)),
    runtime_minutes: (values.runtime_minutes === "" || values.runtime_minutes == null ? null : Number(values.runtime_minutes)),
    age_rating: values.age_rating || null,
    language: values.language || null,
    country: values.country || null,
    director: values.director || null,
    cast_members: values.cast_members
      ? values.cast_members.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    rating: (values.rating === "" || values.rating == null ? 0 : Number(values.rating)),
    featured: Boolean(values.featured),
    published: Boolean(values.published),
  };
  const { data, error } = await supabase
    .from('streamflix_movies')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  const movie = data as Movie;
  if (values.genreIds && values.genreIds.length > 0) {
    const rows = values.genreIds.map((gid) => ({ movie_id: movie.id, genre_id: gid }));
    const { error: linkError } = await supabase.from('streamflix_movie_genres').insert(rows);
    if (linkError) throw linkError;
  }
  return movie;
}

export async function updateMovie(id: string, values: MovieFormValues): Promise<Movie> {
  const payload = {
    title: values.title,
    slug: values.slug,
    description: values.description || null,
    poster_url: values.poster_url || null,
    backdrop_url: values.backdrop_url || null,
    trailer_url: values.trailer_url || null,
    video_url: values.video_url || null,
    release_year: (values.release_year === "" || values.release_year == null ? null : Number(values.release_year)),
    runtime_minutes: (values.runtime_minutes === "" || values.runtime_minutes == null ? null : Number(values.runtime_minutes)),
    age_rating: values.age_rating || null,
    language: values.language || null,
    country: values.country || null,
    director: values.director || null,
    cast_members: values.cast_members
      ? values.cast_members.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
    rating: (values.rating === "" || values.rating == null ? 0 : Number(values.rating)),
    featured: Boolean(values.featured),
    published: Boolean(values.published),
  };
  const { data, error } = await supabase
    .from('streamflix_movies')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  if (values.genreIds) {
    await supabase.from('streamflix_movie_genres').delete().eq('movie_id', id);
    if (values.genreIds.length > 0) {
      const rows = values.genreIds.map((gid) => ({ movie_id: id, genre_id: gid }));
      const { error: linkError } = await supabase.from('streamflix_movie_genres').insert(rows);
      if (linkError) throw linkError;
    }
  }
  return data as Movie;
}

export async function deleteMovie(id: string): Promise<void> {
  const { error } = await supabase.from('streamflix_movies').delete().eq('id', id);
  if (error) throw error;
}
