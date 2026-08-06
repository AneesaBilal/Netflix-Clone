-- StreamFlix seed data
-- Uses public-domain / Creative-Commons demo videos (Google sample bucket)
-- and picsum.photos placeholder artwork. No copyrighted assets.

-- ============ GENRES ============
insert into public.streamflix_genres (name, slug, description) values
  ('Action', 'action', 'High-energy thrills and stunts.'),
  ('Adventure', 'adventure', 'Journeys into the unknown.'),
  ('Comedy', 'comedy', 'Laugh-out-loud stories.'),
  ('Drama', 'drama', 'Character-driven narratives.'),
  ('Sci-Fi', 'sci-fi', 'Futures, space, and technology.'),
  ('Thriller', 'thriller', 'Suspense and tension.'),
  ('Romance', 'romance', 'Stories of the heart.'),
  ('Documentary', 'documentary', 'Real stories, real people.'),
  ('Animation', 'animation', 'Animated worlds.'),
  ('Family', 'family', 'Fun for everyone.')
on conflict (slug) do nothing;

-- ============ MOVIES ============
insert into public.streamflix_movies
  (title, slug, description, poster_url, backdrop_url, trailer_url, video_url,
   release_year, runtime_minutes, age_rating, language, country, director,
   cast_members, rating, featured, published)
values
  ('Big Buck Bunny', 'big-buck-bunny', 'A gentle giant rabbit stands up to three bullying rodents in this beloved open-source animated classic.',
   'https://picsum.photos/seed/bbb/400/600', 'https://picsum.photos/seed/bbb-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
   2008, 10, 'G', 'en', 'NL', 'Sacha Goedegebure', array['Sacha Goedegebure'], 4.6, true, true),
  ('Sintel', 'sintel', 'A lonely young woman searches the world for the baby dragon she once rescued.',
   'https://picsum.photos/seed/sintel/400/600', 'https://picsum.photos/seed/sintel-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
   2010, 15, 'PG', 'en', 'NL', 'Colin Levy', array['Halina Reijn'], 4.5, true, true),
  ('Tears of Steel', 'tears-of-steel', 'In a future Amsterdam, a group of warriors must save the world from destructive robots.',
   'https://picsum.photos/seed/tos/400/600', 'https://picsum.photos/seed/tos-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
   2012, 12, 'PG-13', 'en', 'NL', 'Ian Hubert', array['Derek de Lint'], 4.3, true, true),
  ('Elephants Dream', 'elephants-dream', 'Two men explore a strange mechanical world that may only exist in their minds.',
   'https://picsum.photos/seed/ed/400/600', 'https://picsum.photos/seed/ed-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
   2006, 11, 'PG', 'en', 'NL', 'Bassam Kurdali', array['Tygo Gernandt'], 4.1, false, true),
  ('For Bigger Blazes', 'for-bigger-blazes', 'A short, fiery showcase of cinematic spectacle.',
   'https://picsum.photos/seed/fbb/400/600', 'https://picsum.photos/seed/fbb-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
   2013, 1, 'PG', 'en', 'US', 'Studio Demo', array['Demo Cast'], 3.8, false, true),
  ('For Bigger Escapes', 'for-bigger-escapes', 'A pulse-pounding escape thriller in miniature.',
   'https://picsum.photos/seed/fbe/400/600', 'https://picsum.photos/seed/fbe-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
   2013, 1, 'PG-13', 'en', 'US', 'Studio Demo', array['Demo Cast'], 3.9, false, true),
  ('For Bigger Fun', 'for-bigger-fun', 'Pure joy distilled into moving images.',
   'https://picsum.photos/seed/fbf/400/600', 'https://picsum.photos/seed/fbf-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
   2013, 1, 'G', 'en', 'US', 'Studio Demo', array['Demo Cast'], 4.0, false, true),
  ('For Bigger Joyrides', 'for-bigger-joyrides', 'A high-speed ride through scenic landscapes.',
   'https://picsum.photos/seed/fbj/400/600', 'https://picsum.photos/seed/fbj-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
   2013, 1, 'PG', 'en', 'US', 'Studio Demo', array['Demo Cast'], 3.7, false, true),
  ('For Bigger Meltdowns', 'for-bigger-meltdowns', 'When emotions boil over, drama follows.',
   'https://picsum.photos/seed/fbm/400/600', 'https://picsum.photos/seed/fbm-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
   2013, 1, 'PG-13', 'en', 'US', 'Studio Demo', array['Demo Cast'], 3.6, false, true),
  ('Subaru Street & Dirt', 'subaru-street-dirt', 'An adrenaline-fueled look at rally driving on every surface.',
   'https://picsum.photos/seed/sub/400/600', 'https://picsum.photos/seed/sub-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
   2014, 1, 'PG', 'en', 'US', 'Auto Docs', array['Rally Team'], 3.5, false, true),
  ('Volkswagen GTI Review', 'volkswagen-gti-review', 'A candid, cinematic review of a hot hatch icon.',
   'https://picsum.photos/seed/vw/400/600', 'https://picsum.photos/seed/vw-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
   2014, 1, 'PG', 'en', 'US', 'Auto Docs', array['Review Crew'], 3.4, false, true),
  ('We Are Going On Bullrun', 'we-are-going-on-bullrun', 'A road-trip adventure across open highways.',
   'https://picsum.photos/seed/bull/400/600', 'https://picsum.photos/seed/bull-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
   2014, 1, 'PG-13', 'en', 'US', 'Road Films', array['Bullrun Crew'], 3.6, false, true),
  ('What Car Can You Get For A Grand', 'what-car-for-a-grand', 'Budget motoring at its most entertaining.',
   'https://picsum.photos/seed/grand/400/600', 'https://picsum.photos/seed/grand-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
   2014, 1, 'PG', 'en', 'US', 'Auto Docs', array['Budget Crew'], 3.3, false, true),
  ('Bunny Revisited', 'bunny-revisited', 'A fresh look back at the meadow and its most famous resident.',
   'https://picsum.photos/seed/bbb2/400/600', 'https://picsum.photos/seed/bbb2-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
   2015, 10, 'G', 'en', 'NL', 'Sacha Goedegebure', array['Sacha Goedegebure'], 4.2, false, true),
  ('Steel Horizon', 'steel-horizon', 'An extended cut exploring the robot uprising in greater depth.',
   'https://picsum.photos/seed/tos2/400/600', 'https://picsum.photos/seed/tos2-bg/1280/720',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
   2016, 12, 'PG-13', 'en', 'NL', 'Ian Hubert', array['Derek de Lint'], 4.0, false, true)
on conflict (slug) do nothing;

-- ============ TV SHOWS ============
insert into public.streamflix_tv_shows
  (title, slug, description, poster_url, backdrop_url, release_year, age_rating,
   language, country, director, cast_members, rating, featured, published)
values
  ('Meadow Tales', 'meadow-tales', 'Life, love and mischief in a sunlit meadow, told one season at a time.',
   'https://picsum.photos/seed/mt/400/600', 'https://picsum.photos/seed/mt-bg/1280/720',
   2018, 'G', 'en', 'NL', 'Sacha Goedegebure', array['Meadow Ensemble'], 4.4, true, true),
  ('Dragon Paths', 'dragon-paths', 'Follow legendary dragons across mythic landscapes.',
   'https://picsum.photos/seed/dp/400/600', 'https://picsum.photos/seed/dp-bg/1280/720',
   2019, 'PG', 'en', 'NL', 'Colin Levy', array['Halina Reijn'], 4.6, true, true),
  ('Steel City', 'steel-city', 'A gritty saga of a future metropolis under siege.',
   'https://picsum.photos/seed/sc/400/600', 'https://picsum.photos/seed/sc-bg/1280/720',
   2020, 'PG-13', 'en', 'NL', 'Ian Hubert', array['Derek de Lint'], 4.2, false, true),
  ('Dream Engine', 'dream-engine', 'Surreal journeys through a machine that dreams.',
   'https://picsum.photos/seed/de/400/600', 'https://picsum.photos/seed/de-bg/1280/720',
   2017, 'PG', 'en', 'NL', 'Bassam Kurdali', array['Tygo Gernandt'], 4.0, false, true),
  ('Open Roads', 'open-roads', 'A documentary series about the worlds greatest drives.',
   'https://picsum.photos/seed/or/400/600', 'https://picsum.photos/seed/or-bg/1280/720',
   2021, 'PG', 'en', 'US', 'Road Films', array['Bullrun Crew'], 3.9, false, true),
  ('Garage Diaries', 'garage-diaries', 'Mechanics, machines and the people who love them.',
   'https://picsum.photos/seed/gd/400/600', 'https://picsum.photos/seed/gd-bg/1280/720',
   2022, 'PG', 'en', 'US', 'Auto Docs', array['Review Crew'], 3.8, false, true),
  ('Little Wings', 'little-wings', 'Animated adventures for the youngest viewers.',
   'https://picsum.photos/seed/lw/400/600', 'https://picsum.photos/seed/lw-bg/1280/720',
   2023, 'G', 'en', 'NL', 'Sacha Goedegebure', array['Kids Ensemble'], 4.7, true, true),
  ('Night Signals', 'night-signals', 'A slow-burn thriller about mysterious midnight broadcasts.',
   'https://picsum.photos/seed/ns/400/600', 'https://picsum.photos/seed/ns-bg/1280/720',
   2024, 'PG-13', 'en', 'US', 'Studio Demo', array['Demo Cast'], 4.1, false, true)
on conflict (slug) do nothing;

-- ============ SEASONS ============
insert into public.streamflix_seasons (show_id, season_number, title, description, poster_url, release_year)
select id, 1, 'Season 1', 'The first chapter of Meadow Tales.', 'https://picsum.photos/seed/mt-s1/400/600', 2018
from public.streamflix_tv_shows where slug = 'meadow-tales';

insert into public.streamflix_seasons (show_id, season_number, title, description, poster_url, release_year)
select id, 2, 'Season 2', 'The meadow changes with the seasons.', 'https://picsum.photos/seed/mt-s2/400/600', 2019
from public.streamflix_tv_shows where slug = 'meadow-tales';

insert into public.streamflix_seasons (show_id, season_number, title, description, poster_url, release_year)
select id, 1, 'Season 1', 'Dragons take flight.', 'https://picsum.photos/seed/dp-s1/400/600', 2019
from public.streamflix_tv_shows where slug = 'dragon-paths';

insert into public.streamflix_seasons (show_id, season_number, title, description, poster_url, release_year)
select id, 1, 'Season 1', 'The city awakens.', 'https://picsum.photos/seed/sc-s1/400/600', 2020
from public.streamflix_tv_shows where slug = 'steel-city';

-- ============ EPISODES ============
-- Meadow Tales S1
insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 1, 'Spring Arrives', 'The meadow wakes from winter.', 'https://picsum.photos/seed/mt-e1/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 10, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'meadow-tales' and s.season_number = 1;

insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 2, 'The Bully Rodents', 'Three uninvited guests stir up trouble.', 'https://picsum.photos/seed/mt-e2/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 10, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'meadow-tales' and s.season_number = 1;

insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 3, 'A Gentle Stand', 'Bunny decides enough is enough.', 'https://picsum.photos/seed/mt-e3/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 10, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'meadow-tales' and s.season_number = 1;

-- Meadow Tales S2
insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 1, 'Summer Storm', 'Rain reshapes the meadow.', 'https://picsum.photos/seed/mt-s2e1/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 10, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'meadow-tales' and s.season_number = 2;

insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 2, 'Autumn Leaves', 'Change comes quietly.', 'https://picsum.photos/seed/mt-s2e2/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 10, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'meadow-tales' and s.season_number = 2;

-- Dragon Paths S1
insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 1, 'The Hatchling', 'Sintel finds an unlikely companion.', 'https://picsum.photos/seed/dp-e1/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 15, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'dragon-paths' and s.season_number = 1;

insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 2, 'Lost Skies', 'A journey across frozen peaks.', 'https://picsum.photos/seed/dp-e2/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 15, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'dragon-paths' and s.season_number = 1;

insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 3, 'Fire Within', 'The final confrontation.', 'https://picsum.photos/seed/dp-e3/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 15, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'dragon-paths' and s.season_number = 1;

-- Steel City S1
insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 1, 'Signal Zero', 'Robots stir in the ruins.', 'https://picsum.photos/seed/sc-e1/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 12, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'steel-city' and s.season_number = 1;

insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 2, 'The Old Soldier', 'A veteran returns to the front.', 'https://picsum.photos/seed/sc-e2/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 12, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'steel-city' and s.season_number = 1;

insert into public.streamflix_episodes (season_id, show_id, episode_number, title, description, thumbnail_url, video_url, duration_minutes, published)
select s.id, s.show_id, 3, 'Last Stand', 'Humanity makes its final play.', 'https://picsum.photos/seed/sc-e3/640/360',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', 12, true
from public.streamflix_seasons s join public.streamflix_tv_shows t on t.id = s.show_id
where t.slug = 'steel-city' and s.season_number = 1;

-- ============ MOVIE GENRES ============
insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug = 'big-buck-bunny' and g.slug in ('animation', 'family', 'comedy');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug = 'sintel' and g.slug in ('adventure', 'drama', 'animation');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug = 'tears-of-steel' and g.slug in ('sci-fi', 'action', 'thriller');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug = 'elephants-dream' and g.slug in ('sci-fi', 'drama', 'animation');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug in ('for-bigger-blazes','for-bigger-escapes','for-bigger-joyrides') and g.slug in ('action','thriller');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug in ('for-bigger-fun','for-bigger-meltdowns') and g.slug in ('comedy','drama');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug in ('subaru-street-dirt','volkswagen-gti-review','we-are-going-on-bullrun','what-car-for-a-grand') and g.slug in ('documentary','adventure');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug = 'bunny-revisited' and g.slug in ('animation','family');

insert into public.streamflix_movie_genres (movie_id, genre_id)
select m.id, g.id from public.streamflix_movies m, public.streamflix_genres g
where m.slug = 'steel-horizon' and g.slug in ('sci-fi','action');

-- ============ SHOW GENRES ============
insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'meadow-tales' and g.slug in ('animation','family','comedy');

insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'dragon-paths' and g.slug in ('adventure','drama','animation');

insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'steel-city' and g.slug in ('sci-fi','action','thriller');

insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'dream-engine' and g.slug in ('sci-fi','drama','animation');

insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'open-roads' and g.slug in ('documentary','adventure');

insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'garage-diaries' and g.slug in ('documentary');

insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'little-wings' and g.slug in ('animation','family');

insert into public.streamflix_tv_show_genres (show_id, genre_id)
select s.id, g.id from public.streamflix_tv_shows s, public.streamflix_genres g
where s.slug = 'night-signals' and g.slug in ('thriller','drama');

-- ============ FEATURED CONTENT ============
insert into public.streamflix_featured_content (content_type, movie_id, show_id, position, is_active)
select 'movie', m.id, null, 1, true from public.streamflix_movies m where m.slug = 'sintel';

insert into public.streamflix_featured_content (content_type, movie_id, show_id, position, is_active)
select 'movie', m.id, null, 2, true from public.streamflix_movies m where m.slug = 'tears-of-steel';

insert into public.streamflix_featured_content (content_type, movie_id, show_id, position, is_active)
select 'movie', m.id, null, 3, true from public.streamflix_movies m where m.slug = 'big-buck-bunny';

insert into public.streamflix_featured_content (content_type, movie_id, show_id, position, is_active)
select 'show', null, s.id, 4, true from public.streamflix_tv_shows s where s.slug = 'dragon-paths';

-- ============ ADMIN ROLE ============
-- After you register your first user via the app UI, promote them by running
-- this in the Supabase SQL editor (replace with the real user id):
--
--   insert into public.streamflix_user_roles (user_id, role)
--   values ('<YOUR_AUTH_USER_ID>', 'admin')
--   on conflict (user_id) do update set role = 'admin';
