import { supabase } from '../lib/supabase';
import type { Season } from '../types';

export async function adminFetchSeasons(): Promise<Season[]> {
  const { data, error } = await supabase
    .from('streamflix_seasons')
    .select('*, show:streamflix_tv_shows(id,title,slug)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Season[]) || [];
}

export async function createSeason(input: {
  showId: string;
  seasonNumber: number;
  title?: string;
  description?: string;
  posterUrl?: string;
  releaseYear?: number | null;
}): Promise<Season> {
  const { data, error } = await supabase
    .from('streamflix_seasons')
    .insert({
      show_id: input.showId,
      season_number: input.seasonNumber,
      title: input.title || null,
      description: input.description || null,
      poster_url: input.posterUrl || null,
      release_year: input.releaseYear ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Season;
}

export async function updateSeason(
  id: string,
  input: {
    showId: string;
    seasonNumber: number;
    title?: string;
    description?: string;
    posterUrl?: string;
    releaseYear?: number | null;
  }
): Promise<Season> {
  const { data, error } = await supabase
    .from('streamflix_seasons')
    .update({
      show_id: input.showId,
      season_number: input.seasonNumber,
      title: input.title || null,
      description: input.description || null,
      poster_url: input.posterUrl || null,
      release_year: input.releaseYear ?? null,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Season;
}

export async function deleteSeason(id: string): Promise<void> {
  const { error } = await supabase.from('streamflix_seasons').delete().eq('id', id);
  if (error) throw error;
}
