import { supabase } from '../lib/supabase';
import type { AdminStats, AdminUserRow, FeaturedContent } from '../types';

export async function fetchAdminStats(): Promise<AdminStats> {
  const [roles, profiles, movies, shows, episodes, genres, sessions] = await Promise.all([
    supabase.from('streamflix_user_roles').select('user_id', { count: 'exact', head: true }),
    supabase.from('streamflix_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('streamflix_movies').select('id', { count: 'exact', head: true }),
    supabase.from('streamflix_tv_shows').select('id', { count: 'exact', head: true }),
    supabase.from('streamflix_episodes').select('id', { count: 'exact', head: true }),
    supabase.from('streamflix_genres').select('id', { count: 'exact', head: true }),
    supabase.from('streamflix_watch_history').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalUsers: roles.count || 0,
    totalProfiles: profiles.count || 0,
    totalMovies: movies.count || 0,
    totalShows: shows.count || 0,
    totalEpisodes: episodes.count || 0,
    totalGenres: genres.count || 0,
    totalWatchSessions: sessions.count || 0,
  };
}

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  // auth.users is not directly queryable from the client.
  // We expose role rows joined with profile counts as a safe approximation.
  const { data, error } = await supabase
    .from('streamflix_user_roles')
    .select('user_id, role, created_at');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    user_id: row.user_id,
    email: null,
    created_at: row.created_at,
    role: row.role,
  }));
}

export async function fetchFeaturedContent(): Promise<FeaturedContent[]> {
  const { data, error } = await supabase
    .from('streamflix_featured_content')
    .select(
      '*, movie:streamflix_movies(id,title,slug,poster_url), show:streamflix_tv_shows(id,title,slug,poster_url)'
    )
    .order('position', { ascending: true });
  if (error) throw error;
  return (data as FeaturedContent[]) || [];
}

export async function fetchHeroContent(): Promise<FeaturedContent[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('streamflix_featured_content')
    .select(
      '*, movie:streamflix_movies(*), show:streamflix_tv_shows(*)'
    )
    .eq('is_active', true)
    .order('position', { ascending: true })
    .limit(6);
  if (error) throw error;
  const items = (data as FeaturedContent[]) || [];
  return items.filter((item) => {
    if (item.starts_at && item.starts_at > now) return false;
    if (item.ends_at && item.ends_at < now) return false;
    return true;
  });
}

export async function createFeaturedContent(input: {
  contentType: 'movie' | 'show';
  movieId?: string;
  showId?: string;
  position?: number;
  isActive?: boolean;
}): Promise<FeaturedContent> {
  const { data, error } = await supabase
    .from('streamflix_featured_content')
    .insert({
      content_type: input.contentType,
      movie_id: input.movieId || null,
      show_id: input.showId || null,
      position: input.position ?? 0,
      is_active: input.isActive !== false,
    })
    .select()
    .single();
  if (error) throw error;
  return data as FeaturedContent;
}

export async function deleteFeaturedContent(id: string): Promise<void> {
  const { error } = await supabase
    .from('streamflix_featured_content')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function toggleFeaturedActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from('streamflix_featured_content')
    .update({ is_active: isActive })
    .eq('id', id);
  if (error) throw error;
}
