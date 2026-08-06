import { supabase } from '../lib/supabase';
import type { WatchHistoryItem } from '../types';

const HISTORY_SELECT =
  '*, movie:streamflix_movies(id,title,slug,poster_url,release_year,rating), episode:streamflix_episodes(id,title,episode_number,thumbnail_url, show:streamflix_tv_shows(id,title,slug,poster_url))';

export async function fetchHistory(profileId: string): Promise<WatchHistoryItem[]> {
  const { data, error } = await supabase
    .from('streamflix_watch_history')
    .select(HISTORY_SELECT)
    .eq('profile_id', profileId)
    .order('watched_at', { ascending: false })
    .limit(60);
  if (error) throw error;
  return (data as WatchHistoryItem[]) || [];
}

export async function addHistory(input: {
  profileId: string;
  movieId?: string;
  episodeId?: string;
}): Promise<void> {
  const { error } = await supabase.from('streamflix_watch_history').insert({
    profile_id: input.profileId,
    movie_id: input.movieId || null,
    episode_id: input.episodeId || null,
  });
  if (error) throw error;
}

export async function removeHistoryItem(id: string): Promise<void> {
  const { error } = await supabase.from('streamflix_watch_history').delete().eq('id', id);
  if (error) throw error;
}

export async function clearHistory(profileId: string): Promise<void> {
  const { error } = await supabase
    .from('streamflix_watch_history')
    .delete()
    .eq('profile_id', profileId);
  if (error) throw error;
}
