import { supabase } from '../lib/supabase';
import type { Rating } from '../types';

export async function fetchMyRating(input: {
  profileId: string;
  movieId?: string;
  showId?: string;
}): Promise<Rating | null> {
  let query = supabase
    .from('streamflix_ratings')
    .select('*')
    .eq('profile_id', input.profileId);
  if (input.movieId) query = query.eq('movie_id', input.movieId);
  if (input.showId) query = query.eq('show_id', input.showId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return (data as Rating) || null;
}

export async function upsertRating(input: {
  profileId: string;
  movieId?: string;
  showId?: string;
  rating: number;
}): Promise<void> {
  const existing = await fetchMyRating({
    profileId: input.profileId,
    movieId: input.movieId,
    showId: input.showId,
  });
  const payload = {
    profile_id: input.profileId,
    movie_id: input.movieId || null,
    show_id: input.showId || null,
    rating: input.rating,
    updated_at: new Date().toISOString(),
  };
  if (existing) {
    const { error } = await supabase
      .from('streamflix_ratings')
      .update({ rating: input.rating, updated_at: payload.updated_at })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('streamflix_ratings').insert(payload);
    if (error) throw error;
  }
}

export async function removeRating(input: {
  profileId: string;
  movieId?: string;
  showId?: string;
}): Promise<void> {
  let query = supabase
    .from('streamflix_ratings')
    .delete()
    .eq('profile_id', input.profileId);
  if (input.movieId) query = query.eq('movie_id', input.movieId);
  if (input.showId) query = query.eq('show_id', input.showId);
  const { error } = await query;
  if (error) throw error;
}
