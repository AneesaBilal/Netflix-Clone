import { supabase } from '../lib/supabase';
import type { MyListItem } from '../types';

export async function fetchMyList(profileId: string): Promise<MyListItem[]> {
  const { data, error } = await supabase
    .from('streamflix_my_list')
    .select(
      '*, movie:streamflix_movies(id,title,slug,poster_url,release_year,rating,age_rating), show:streamflix_tv_shows(id,title,slug,poster_url,release_year,rating,age_rating)'
    )
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as MyListItem[]) || [];
}

export async function addToMyList(input: {
  profileId: string;
  movieId?: string;
  showId?: string;
}): Promise<void> {
  const { error } = await supabase.from('streamflix_my_list').insert({
    profile_id: input.profileId,
    movie_id: input.movieId || null,
    show_id: input.showId || null,
  });
  if (error) throw error;
}

export async function removeFromMyList(input: {
  profileId: string;
  movieId?: string;
  showId?: string;
}): Promise<void> {
  let query = supabase.from('streamflix_my_list').delete().eq('profile_id', input.profileId);
  if (input.movieId) query = query.eq('movie_id', input.movieId);
  if (input.showId) query = query.eq('show_id', input.showId);
  const { error } = await query;
  if (error) throw error;
}

export async function fetchMyListIds(profileId: string): Promise<{
  movieIds: Set<string>;
  showIds: Set<string>;
}> {
  const { data, error } = await supabase
    .from('streamflix_my_list')
    .select('movie_id, show_id')
    .eq('profile_id', profileId);
  if (error) throw error;
  const movieIds = new Set<string>();
  const showIds = new Set<string>();
  (data || []).forEach((row: { movie_id: string | null; show_id: string | null }) => {
    if (row.movie_id) movieIds.add(row.movie_id);
    if (row.show_id) showIds.add(row.show_id);
  });
  return { movieIds, showIds };
}
