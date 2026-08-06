import { supabase } from '../lib/supabase';
import type { Episode } from '../types';

export async function adminFetchEpisodes(): Promise<Episode[]> {
  const { data, error } = await supabase
    .from('streamflix_episodes')
    .select('*, season:streamflix_seasons(id,season_number,show_id), show:streamflix_tv_shows(id,title)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Episode[]) || [];
}

export async function createEpisode(input: {
  seasonId: string;
  showId: string;
  episodeNumber: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  durationMinutes?: number | null;
  published?: boolean;
}): Promise<Episode> {
  const { data, error } = await supabase
    .from('streamflix_episodes')
    .insert({
      season_id: input.seasonId,
      show_id: input.showId,
      episode_number: input.episodeNumber,
      title: input.title,
      description: input.description || null,
      thumbnail_url: input.thumbnailUrl || null,
      video_url: input.videoUrl || null,
      duration_minutes: input.durationMinutes ?? null,
      published: Boolean(input.published),
    })
    .select()
    .single();
  if (error) throw error;
  return data as Episode;
}

export async function updateEpisode(
  id: string,
  input: {
    seasonId: string;
    showId: string;
    episodeNumber: number;
    title: string;
    description?: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    durationMinutes?: number | null;
    published?: boolean;
  }
): Promise<Episode> {
  const { data, error } = await supabase
    .from('streamflix_episodes')
    .update({
      season_id: input.seasonId,
      show_id: input.showId,
      episode_number: input.episodeNumber,
      title: input.title,
      description: input.description || null,
      thumbnail_url: input.thumbnailUrl || null,
      video_url: input.videoUrl || null,
      duration_minutes: input.durationMinutes ?? null,
      published: Boolean(input.published),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Episode;
}

export async function deleteEpisode(id: string): Promise<void> {
  const { error } = await supabase.from('streamflix_episodes').delete().eq('id', id);
  if (error) throw error;
}
