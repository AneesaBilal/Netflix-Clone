-- StreamFlix database schema
-- All tables are prefixed with streamflix_ per project convention.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- User roles (database-backed authorization)
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Helper: is the current requester an admin? (security definer so it can read roles)
create or replace function public.is_streamflix_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.streamflix_user_roles r
    where r.user_id = auth.uid() and r.role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  avatar_url text,
  is_kids boolean not null default false,
  language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ---------------------------------------------------------------------
-- Genres
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_genres (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) between 1 and 60),
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Movies
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_movies (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique,
  description text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  video_url text,
  release_year integer check (release_year between 1900 and 2100),
  runtime_minutes integer check (runtime_minutes >= 0),
  age_rating text,
  language text,
  country text,
  director text,
  cast_members text[] default '{}',
  rating numeric(3,2) default 0 check (rating >= 0 and rating <= 5),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TV Shows
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_tv_shows (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  slug text not null unique,
  description text,
  poster_url text,
  backdrop_url text,
  release_year integer check (release_year between 1900 and 2100),
  age_rating text,
  language text,
  country text,
  director text,
  cast_members text[] default '{}',
  rating numeric(3,2) default 0 check (rating >= 0 and rating <= 5),
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Seasons
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_seasons (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references public.streamflix_tv_shows(id) on delete cascade,
  season_number integer not null check (season_number >= 1),
  title text,
  description text,
  poster_url text,
  release_year integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (show_id, season_number)
);

-- ---------------------------------------------------------------------
-- Episodes
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_episodes (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.streamflix_seasons(id) on delete cascade,
  show_id uuid not null references public.streamflix_tv_shows(id) on delete cascade,
  episode_number integer not null check (episode_number >= 1),
  title text not null,
  description text,
  thumbnail_url text,
  video_url text,
  duration_minutes integer check (duration_minutes >= 0),
  release_date date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, episode_number)
);

-- ---------------------------------------------------------------------
-- Many-to-many genre relationships
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_movie_genres (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.streamflix_movies(id) on delete cascade,
  genre_id uuid not null references public.streamflix_genres(id) on delete cascade,
  unique (movie_id, genre_id)
);

create table if not exists public.streamflix_tv_show_genres (
  id uuid primary key default gen_random_uuid(),
  show_id uuid not null references public.streamflix_tv_shows(id) on delete cascade,
  genre_id uuid not null references public.streamflix_genres(id) on delete cascade,
  unique (show_id, genre_id)
);

-- ---------------------------------------------------------------------
-- My List
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_my_list (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.streamflix_profiles(id) on delete cascade,
  movie_id uuid references public.streamflix_movies(id) on delete cascade,
  show_id uuid references public.streamflix_tv_shows(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (movie_id is not null and show_id is null) or
    (movie_id is null and show_id is not null)
  )
);

create unique index if not exists streamflix_my_list_unique_movie
  on public.streamflix_my_list (profile_id, movie_id) where movie_id is not null;
create unique index if not exists streamflix_my_list_unique_show
  on public.streamflix_my_list (profile_id, show_id) where show_id is not null;

-- ---------------------------------------------------------------------
-- Watch progress
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_watch_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.streamflix_profiles(id) on delete cascade,
  movie_id uuid references public.streamflix_movies(id) on delete cascade,
  episode_id uuid references public.streamflix_episodes(id) on delete cascade,
  current_seconds numeric not null default 0,
  duration_seconds numeric not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  check (
    (movie_id is not null and episode_id is null) or
    (movie_id is null and episode_id is not null)
  )
);

create unique index if not exists streamflix_progress_unique_movie
  on public.streamflix_watch_progress (profile_id, movie_id) where movie_id is not null;
create unique index if not exists streamflix_progress_unique_episode
  on public.streamflix_watch_progress (profile_id, episode_id) where episode_id is not null;

-- ---------------------------------------------------------------------
-- Ratings
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_ratings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.streamflix_profiles(id) on delete cascade,
  movie_id uuid references public.streamflix_movies(id) on delete cascade,
  show_id uuid references public.streamflix_tv_shows(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (movie_id is not null and show_id is null) or
    (movie_id is null and show_id is not null)
  )
);

create unique index if not exists streamflix_ratings_unique_movie
  on public.streamflix_ratings (profile_id, movie_id) where movie_id is not null;
create unique index if not exists streamflix_ratings_unique_show
  on public.streamflix_ratings (profile_id, show_id) where show_id is not null;

-- ---------------------------------------------------------------------
-- Watch history
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_watch_history (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.streamflix_profiles(id) on delete cascade,
  movie_id uuid references public.streamflix_movies(id) on delete cascade,
  episode_id uuid references public.streamflix_episodes(id) on delete cascade,
  watched_at timestamptz not null default now(),
  check (
    (movie_id is not null and episode_id is null) or
    (movie_id is null and episode_id is not null)
  )
);

-- ---------------------------------------------------------------------
-- Featured content (admin-controlled hero)
-- ---------------------------------------------------------------------
create table if not exists public.streamflix_featured_content (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('movie', 'show')),
  movie_id uuid references public.streamflix_movies(id) on delete cascade,
  show_id uuid references public.streamflix_tv_shows(id) on delete cascade,
  position integer not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    (content_type = 'movie' and movie_id is not null and show_id is null) or
    (content_type = 'show' and show_id is not null and movie_id is null)
  )
);

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
create index if not exists streamflix_idx_movies_slug on public.streamflix_movies (slug);
create index if not exists streamflix_idx_movies_published on public.streamflix_movies (published);
create index if not exists streamflix_idx_movies_featured on public.streamflix_movies (featured);
create index if not exists streamflix_idx_shows_slug on public.streamflix_tv_shows (slug);
create index if not exists streamflix_idx_shows_published on public.streamflix_tv_shows (published);
create index if not exists streamflix_idx_seasons_show on public.streamflix_seasons (show_id);
create index if not exists streamflix_idx_episodes_season on public.streamflix_episodes (season_id);
create index if not exists streamflix_idx_profiles_user on public.streamflix_profiles (user_id);
create index if not exists streamflix_idx_my_list_profile on public.streamflix_my_list (profile_id);
create index if not exists streamflix_idx_progress_profile on public.streamflix_watch_progress (profile_id);
create index if not exists streamflix_idx_history_profile on public.streamflix_watch_history (profile_id);
create index if not exists streamflix_idx_ratings_profile on public.streamflix_ratings (profile_id);
create index if not exists streamflix_idx_movie_genres_movie on public.streamflix_movie_genres (movie_id);
create index if not exists streamflix_idx_show_genres_show on public.streamflix_tv_show_genres (show_id);

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------
create or replace function public.streamflix_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists streamflix_profiles_updated on public.streamflix_profiles;
create trigger streamflix_profiles_updated before update on public.streamflix_profiles
  for each row execute function public.streamflix_set_updated_at();

drop trigger if exists streamflix_movies_updated on public.streamflix_movies;
create trigger streamflix_movies_updated before update on public.streamflix_movies
  for each row execute function public.streamflix_set_updated_at();

drop trigger if exists streamflix_tv_shows_updated on public.streamflix_tv_shows;
create trigger streamflix_tv_shows_updated before update on public.streamflix_tv_shows
  for each row execute function public.streamflix_set_updated_at();

drop trigger if exists streamflix_seasons_updated on public.streamflix_seasons;
create trigger streamflix_seasons_updated before update on public.streamflix_seasons
  for each row execute function public.streamflix_set_updated_at();

drop trigger if exists streamflix_episodes_updated on public.streamflix_episodes;
create trigger streamflix_episodes_updated before update on public.streamflix_episodes
  for each row execute function public.streamflix_set_updated_at();
