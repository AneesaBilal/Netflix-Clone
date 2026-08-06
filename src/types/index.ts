export type ThemeMode = 'dark' | 'light';

export type UserRoleName = 'user' | 'admin';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  is_kids: boolean;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  video_url: string | null;
  release_year: number | null;
  runtime_minutes: number | null;
  age_rating: string | null;
  language: string | null;
  country: string | null;
  director: string | null;
  cast_members: string[] | null;
  rating: number | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  genres?: Genre[];
}

export interface TvShow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  release_year: number | null;
  age_rating: string | null;
  language: string | null;
  country: string | null;
  director: string | null;
  cast_members: string[] | null;
  rating: number | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  genres?: Genre[];
}

export interface Season {
  id: string;
  show_id: string;
  season_number: number;
  title: string | null;
  description: string | null;
  poster_url: string | null;
  release_year: number | null;
  created_at: string;
  updated_at: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  season_id: string;
  show_id: string;
  episode_number: number;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  release_date: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MyListItem {
  id: string;
  profile_id: string;
  movie_id: string | null;
  show_id: string | null;
  created_at: string;
  movie?: Movie | null;
  show?: TvShow | null;
}

export interface WatchProgress {
  id: string;
  profile_id: string;
  movie_id: string | null;
  episode_id: string | null;
  current_seconds: number;
  duration_seconds: number;
  completed: boolean;
  updated_at: string;
  movie?: Movie | null;
  episode?: (Episode & { show?: TvShow | null }) | null;
}

export interface Rating {
  id: string;
  profile_id: string;
  movie_id: string | null;
  show_id: string | null;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface WatchHistoryItem {
  id: string;
  profile_id: string;
  movie_id: string | null;
  episode_id: string | null;
  watched_at: string;
  movie?: Movie | null;
  episode?: (Episode & { show?: TvShow | null }) | null;
}

export interface FeaturedContent {
  id: string;
  content_type: 'movie' | 'show';
  movie_id: string | null;
  show_id: string | null;
  position: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  movie?: Movie | null;
  show?: TvShow | null;
}

export interface AdminUserRow {
  user_id: string;
  email: string | null;
  created_at: string;
  role: UserRoleName;
}

export interface AdminStats {
  totalUsers: number;
  totalProfiles: number;
  totalMovies: number;
  totalShows: number;
  totalEpisodes: number;
  totalGenres: number;
  totalWatchSessions: number;
}

export interface SearchFilters {
  query: string;
  type?: 'movie' | 'show' | 'all';
  genreId?: string;
  year?: number | null;
}
