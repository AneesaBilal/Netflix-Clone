-- StreamFlix Row Level Security policies
-- Enable RLS on every table, then define access rules.

alter table public.streamflix_user_roles enable row level security;
alter table public.streamflix_profiles enable row level security;
alter table public.streamflix_genres enable row level security;
alter table public.streamflix_movies enable row level security;
alter table public.streamflix_tv_shows enable row level security;
alter table public.streamflix_seasons enable row level security;
alter table public.streamflix_episodes enable row level security;
alter table public.streamflix_movie_genres enable row level security;
alter table public.streamflix_tv_show_genres enable row level security;
alter table public.streamflix_my_list enable row level security;
alter table public.streamflix_watch_progress enable row level security;
alter table public.streamflix_ratings enable row level security;
alter table public.streamflix_watch_history enable row level security;
alter table public.streamflix_featured_content enable row level security;

-- Helper: does a profile belong to the current user?
create or replace function public.streamflix_owns_profile(p_profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.streamflix_profiles p
    where p.id = p_profile_id and p.user_id = auth.uid()
  );
$$;

-- ============ user_roles ============
create policy "roles_select_own" on public.streamflix_user_roles
  for select using (auth.uid() = user_id or public.is_streamflix_admin());
-- Admins are managed manually via SQL console; no client insert/update/delete.

-- ============ profiles ============
create policy "profiles_select_own" on public.streamflix_profiles
  for select using (auth.uid() = user_id);
create policy "profiles_insert_own" on public.streamflix_profiles
  for insert with check (auth.uid() = user_id);
create policy "profiles_update_own" on public.streamflix_profiles
  for update using (auth.uid() = user_id);
create policy "profiles_delete_own" on public.streamflix_profiles
  for delete using (auth.uid() = user_id);

-- ============ genres ============
create policy "genres_select_all" on public.streamflix_genres
  for select using (true);
create policy "genres_admin_write" on public.streamflix_genres
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());

-- ============ movies ============
create policy "movies_select_published_or_admin" on public.streamflix_movies
  for select using (published = true or public.is_streamflix_admin());
create policy "movies_admin_write" on public.streamflix_movies
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());

-- ============ tv_shows ============
create policy "shows_select_published_or_admin" on public.streamflix_tv_shows
  for select using (published = true or public.is_streamflix_admin());
create policy "shows_admin_write" on public.streamflix_tv_shows
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());

-- ============ seasons ============
create policy "seasons_select_published_or_admin" on public.streamflix_seasons
  for select using (
    exists (
      select 1 from public.streamflix_tv_shows s
      where s.id = show_id and (s.published = true or public.is_streamflix_admin())
    )
  );
create policy "seasons_admin_write" on public.streamflix_seasons
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());

-- ============ episodes ============
create policy "episodes_select_published_or_admin" on public.streamflix_episodes
  for select using (
    published = true or public.is_streamflix_admin()
  );
create policy "episodes_admin_write" on public.streamflix_episodes
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());

-- ============ genre relations ============
create policy "movie_genres_select" on public.streamflix_movie_genres
  for select using (true);
create policy "movie_genres_admin_write" on public.streamflix_movie_genres
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());
create policy "show_genres_select" on public.streamflix_tv_show_genres
  for select using (true);
create policy "show_genres_admin_write" on public.streamflix_tv_show_genres
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());

-- ============ my_list ============
create policy "mylist_select_own" on public.streamflix_my_list
  for select using (public.streamflix_owns_profile(profile_id));
create policy "mylist_insert_own" on public.streamflix_my_list
  for insert with check (public.streamflix_owns_profile(profile_id));
create policy "mylist_delete_own" on public.streamflix_my_list
  for delete using (public.streamflix_owns_profile(profile_id));

-- ============ watch_progress ============
create policy "progress_select_own" on public.streamflix_watch_progress
  for select using (public.streamflix_owns_profile(profile_id));
create policy "progress_insert_own" on public.streamflix_watch_progress
  for insert with check (public.streamflix_owns_profile(profile_id));
create policy "progress_update_own" on public.streamflix_watch_progress
  for update using (public.streamflix_owns_profile(profile_id));
create policy "progress_delete_own" on public.streamflix_watch_progress
  for delete using (public.streamflix_owns_profile(profile_id));

-- ============ ratings ============
create policy "ratings_select_all" on public.streamflix_ratings
  for select using (true);
create policy "ratings_insert_own" on public.streamflix_ratings
  for insert with check (public.streamflix_owns_profile(profile_id));
create policy "ratings_update_own" on public.streamflix_ratings
  for update using (public.streamflix_owns_profile(profile_id));
create policy "ratings_delete_own" on public.streamflix_ratings
  for delete using (public.streamflix_owns_profile(profile_id));

-- ============ watch_history ============
create policy "history_select_own" on public.streamflix_watch_history
  for select using (public.streamflix_owns_profile(profile_id));
create policy "history_insert_own" on public.streamflix_watch_history
  for insert with check (public.streamflix_owns_profile(profile_id));
create policy "history_delete_own" on public.streamflix_watch_history
  for delete using (public.streamflix_owns_profile(profile_id));

-- ============ featured_content ============
create policy "featured_select_active_or_admin" on public.streamflix_featured_content
  for select using (is_active = true or public.is_streamflix_admin());
create policy "featured_admin_write" on public.streamflix_featured_content
  for all using (public.is_streamflix_admin())
  with check (public.is_streamflix_admin());
