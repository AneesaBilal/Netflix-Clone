import { supabase } from '../lib/supabase';
import type { WatchProgress } from '../types';

const PROGRESS_SELECT =
  '*, movie:streamflix_movies(id,title,slug,poster_url,backdrop_url,release_year,rating,runtime_minutes), episode:streamflix_episodes(id,title,episode_number,season_id,show_id,thumbnail_url,duration_minutes, show:streamflix_tv_shows(id,title,slug,poster_url))';

export async function fetchContinueWatching(profileId: string): Promise<WatchProgress[]> {
  const { data, error } = await supabase
    .from('streamflix_watch_progress')
    .select(PROGRESS_SELECT)
    .eq('profile_id', profileId)
    .eq('completed', false)
    .gt('current_seconds', 0)
    .order('updated_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data as WatchProgress[]) || [];
}

export async function fetchProgress(input: {
  profileId: string;
  movieId?: string;
  episodeId?: string;
}): Promise<WatchProgress | null> {
  let query = supabase
    .from('streamflix_watch_progress')
    .select(PROGRESS_SELECT)
    .eq('profile_id', input.profileId);
  if (input.movieId) query = query.eq('movie_id', input.movieId);
  if (input.episodeId) query = query.eq('episode_id', input.episodeId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return (data as WatchProgress) || null;
}

export async function saveProgress(input: {
  profileId: string;
  movieId?: string;
  episodeId?: string;
  currentSeconds: number;
  durationSeconds: number;
  completed?: boolean;
}): Promise<void> {
  const existing = await fetchProgress({
    profileId: input.profileId,
    movieId: input.movieId,
    episodeId: input.episodeId,
  });

  const payload = {
    profile_id: input.profileId,
    movie_id: input.movieId || null,
    episode_id: input.episodeId || null,
    current_seconds: input.currentSeconds,
    duration_seconds: input.durationSeconds,
    completed: Boolean(input.completed),
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const { error } = await supabase
      .from('streamflix_watch_progress')
      .update(payload)
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('streamflix_watch_progress').insert(payload);
    if (error) throw error;
  }
}
