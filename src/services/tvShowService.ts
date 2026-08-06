import { supabase } from '../lib/supabase';
import type { Episode, Season, TvShow } from '../types';

const SHOW_SELECT = '*, genres:streamflix_tv_show_genres(genre:streamflix_genres(*))';

function attachGenres(rows: any[]): TvShow[] {
  return rows.map((row) => {
    const genres = (row.genres || []).map((g: any) => g.genre).filter(Boolean);
    const copy = { ...row } as TvShow;
    copy.genres = genres;
    return copy;
  });
}

export async function fetchFeaturedShows(kidsOnly = false): Promise<TvShow[]> {
  let query = supabase
    .from('streamflix_tv_shows')
    .select(SHOW_SELECT)
    .eq('published', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(10);
  if (kidsOnly) query = query.filter('age_rating', 'in', '(G,PG)');
  const { data, error } = await query;
  if (error) throw error;
  return attachGenres(data || []);
}

export async function fetchTvShows(options?: {
  kidsOnly?: boolean;
  limit?: number;
  orderBy?: 'created_at' | 'rating' | 'release_year';
}): Promise<TvShow[]> {
  let query = supabase
    .from('streamflix_tv_shows')
    .select(SHOW_SELECT)
    .eq('published', true)
    .order(options?.orderBy || 'created_at', { ascending: false })
    .limit(options?.limit || 30);
  if (options?.kidsOnly) query = query.filter('age_rating', 'in', '(G,PG)');
  const { data, error } = await query;
  if (error) throw error;
  return attachGenres(data || []);
}

export async function fetchShowBySlug(slug: string): Promise<TvShow | null> {
  const { data, error } = await supabase
    .from('streamflix_tv_shows')
    .select(SHOW_SELECT)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return attachGenres([data])[0];
}

export async function fetchSeasons(showId: string): Promise<Season[]> {
  const { data, error } = await supabase
    .from('streamflix_seasons')
    .select('*, episodes:streamflix_episodes(*)')
    .eq('show_id', showId)
    .order('season_number', { ascending: true });
  if (error) throw error;
  const seasons = (data || []) as Season[];
  return seasons.map((s) => ({
    ...s,
    episodes: (s.episodes || []).sort((a, b) => a.episode_number - b.episode_number),
  }));
}

export async function fetchEpisodeById(id: string): Promise<Episode | null> {
  const { data, error } = await supabase
    .from('streamflix_episodes')
    .select('*, show:streamflix_tv_shows(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as Episode) || null;
}

export async function searchShows(query: string): Promise<TvShow[]> {
  const pattern = '%' + query + '%';
  const { data, error } = await supabase
    .from('streamflix_tv_shows')
    .select(SHOW_SELECT)
    .eq('published', true)
    .or('title.ilike.' + pattern + ',director.ilike.' + pattern)
    .limit(30);
  if (error) throw error;
  return attachGenres(data || []);
}

export async function fetchMoreLikeShows(show: TvShow, limit = 12): Promise<TvShow[]> {
  const { data, error } = await supabase
    .from('streamflix_tv_shows')
    .select(SHOW_SELECT)
    .eq('published', true)
    .neq('id', show.id)
    .limit(40);
  if (error) throw error;
  const all = attachGenres(data || []);
  const genreIds = new Set((show.genres || []).map((g) => g.id));
  const scored = all
    .map((candidate) => {
      const shared = (candidate.genres || []).filter((g) => genreIds.has(g.id)).length;
      return { candidate, shared };
    })
    .filter((item) => item.shared > 0)
    .sort((a, b) => b.shared - a.shared);
  return scored.map((item) => item.candidate).slice(0, limit);
}

export interface ShowFormValues {
  title: string;
  slug: string;
  description?: string;
  poster_url?: string;
  backdrop_url?: string;
  release_year?: number | '' | null;
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

export async function adminFetchShows(): Promise<TvShow[]> {
  const { data, error } = await supabase
    .from('streamflix_tv_shows')
    .select(SHOW_SELECT)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return attachGenres(data || []);
}

export async function createShow(values: ShowFormValues): Promise<TvShow> {
  const payload = {
    title: values.title,
    slug: values.slug,
    description: values.description || null,
    poster_url: values.poster_url || null,
    backdrop_url: values.backdrop_url || null,
    release_year: (values.release_year === "" || values.release_year == null ? null : Number(values.release_year)),
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
    .from('streamflix_tv_shows')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  const show = data as TvShow;
  if (values.genreIds && values.genreIds.length > 0) {
    const rows = values.genreIds.map((gid) => ({ show_id: show.id, genre_id: gid }));
    const { error: linkError } = await supabase.from('streamflix_tv_show_genres').insert(rows);
    if (linkError) throw linkError;
  }
  return show;
}

export async function updateShow(id: string, values: ShowFormValues): Promise<TvShow> {
  const payload = {
    title: values.title,
    slug: values.slug,
    description: values.description || null,
    poster_url: values.poster_url || null,
    backdrop_url: values.backdrop_url || null,
    release_year: (values.release_year === "" || values.release_year == null ? null : Number(values.release_year)),
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
    .from('streamflix_tv_shows')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  if (values.genreIds) {
    await supabase.from('streamflix_tv_show_genres').delete().eq('show_id', id);
    if (values.genreIds.length > 0) {
      const rows = values.genreIds.map((gid) => ({ show_id: id, genre_id: gid }));
      const { error: linkError } = await supabase.from('streamflix_tv_show_genres').insert(rows);
      if (linkError) throw linkError;
    }
  }
  return data as TvShow;
}

export async function deleteShow(id: string): Promise<void> {
  const { error } = await supabase.from('streamflix_tv_shows').delete().eq('id', id);
  if (error) throw error;
}
