# StreamFlix

**StreamFlix** is a modern, production-quality streaming platform built with React, TypeScript, Tailwind CSS and Supabase. It is an original project inspired by modern streaming UX - it is **not** affiliated with Netflix and uses only placeholder / public-domain media.

> Entertainment that moves with you.

---

## Features

### Viewer
- Full authentication (register, login, logout, forgot/reset password) via Supabase Auth
- Multiple profiles per account, including **Kids** profiles with age-appropriate filtering
- Cinematic homepage with a rotating admin-controlled **hero**
- Dynamic content rows (Trending, Top Rated, New Releases, Continue Watching, My List)
- Movie & TV show detail pages with cast, genres, ratings and **More Like This**
- Season/episode browsing with per-episode progress
- Custom **video player**: play/pause, seek, volume, speed, fullscreen, skip ±10s, auto-hide controls, buffering & error states
- **Continue Watching** with resume-from-position
- **My List** (add/remove movies & shows)
- **Watch history** with remove & clear
- **1-5 star ratings** with average display
- Debounced **search** across titles, with type & genre filters
- Fully responsive (mobile bottom nav, desktop nav bar)
- **Dark & light themes** with persistence (light theme is soft cinematic, never pure white)

### Admin
- Dedicated SaaS-style admin console (sidebar + topbar) protected by **database-backed roles**
- Dashboard stats (users, profiles, movies, shows, episodes, genres, watch sessions)
- Full CRUD for movies, TV shows, seasons, episodes and genres
- Publish/unpublish and feature/unfeature toggles
- Featured content management that drives the homepage hero
- React Hook Form + Zod validation on every form, with confirmation dialogs for deletes

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React |
| Routing | React Router v6 |
| Server state | TanStack Query |
| Client state | Zustand (theme, auth, profile, toasts, player) |
| Forms | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL, Auth, RLS) |
| Build | Vite |

---

## Folder Structure

~~~text
streamflix/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tailwind.config.js
├─ postcss.config.js
├─ tsconfig.json
├─ .env.example
├─ supabase/
│  ├─ schema.sql      # tables, constraints, indexes, triggers
│  ├─ policies.sql    # RLS policies + helper functions
│  └─ seed.sql        # demo genres, movies, shows, seasons, episodes
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ index.css
   ├─ components/
   │  ├─ layout/   (Navbar, MobileNavbar, Footer, routes, AdminLayout...)
   │  ├─ ui/       (Button, Input, Modal, Toast, Skeleton, EmptyState...)
   │  ├─ movie/    (MovieCard, ContentRow, HeroBanner...)
   │  ├─ tv/       (EpisodeCard)
   │  ├─ profile/  (ProfileAvatar)
   │  └─ player/   (VideoPlayer)
   ├─ pages/        (Landing, auth, home, browse, search, watch, profile, admin, 404)
   ├─ services/     (Supabase data access layer)
   ├─ hooks/        (useAuth, useDebounce, useToast)
   ├─ stores/       (Zustand stores)
   ├─ lib/          (supabase client, utils, constants)
   └─ types/        (shared TypeScript types)
~~~

---

📸 Screenshots

URL: localhost:5173

The StreamFlix landing page introduces users to the platform with a cinematic dark forest background, StreamFlix branding, navigation links, and prominent calls to action.

Screenshot 508 — Hero Section

![Landing Page](./Screenshots/Screenshot%20%28508%29.png)

The main hero section contains the StreamFlix logo, navigation links including Browse, Movies, and TV Shows, a Sign In button, the headline "Entertainment that moves with you.", supporting text, and the Start Watching and Explore Content buttons.

Screenshot 509 — Why StreamFlix?

![Why StreamFlix](./Screenshots/Screenshot%20%28509%29.png)

The continuation of the landing page presents the Why StreamFlix? section with four feature cards highlighting:

Thousands of titles
Watch on every device
Continue where you left off
Personalized profiles

It also includes a visual preview demonstrating the platform's multi-device compatibility.

Screenshot 510 — Sign In Page

![Sign In Page](./Screenshots/Screenshot%20%28510%29.png)

URL: localhost:5173/login

The Sign In page provides a secure authentication interface with:

Email field
Password field
Forgot password option
Sign In button
Create account option

Screenshot 511 — Profile Selection

![Profile Selection](./Screenshots/Screenshot%20%28511%29.png)

URL: localhost:5173/profiles

The profile selection screen uses the "Who's watching?" interface, allowing users to select their existing profile or create a new one.

Available options include:

Aneesa profile
Add Profile
Manage Profiles
Account

URL: localhost:5173/home

Screenshot 512 — StreamFlix Home Dashboard

![Home Dashboard](./Screenshots/Screenshot%20%28512%29.png)

The main StreamFlix dashboard provides access to:

Home
Movies
TV Shows
My List
Library

The hero section highlights Sintel with:

⭐ 4.5 rating
📅 2010
⏱️ 15m
🔞 PG rating
Synopsis
Play button
More Info button
Add-to-list functionality

A Trending Now content row is displayed below the featured hero section.

## Getting Started

### 1. Install dependencies

~~~bash
npm install
~~~

### 2. Configure environment

Copy the example file and add your Supabase credentials:

~~~bash
cp .env.example .env
~~~

~~~text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
~~~

> Only the **anon** key belongs in the frontend. Never put the service-role key in client code.

### 3. Create the database

In your Supabase project, open the **SQL Editor** and run these files **in order**:

1. supabase/schema.sql
2. supabase/policies.sql
3. supabase/seed.sql

### 4. Create an admin user

Register a normal account through the app, then promote it in the SQL editor:

~~~sql
insert into public.streamflix_user_roles (user_id, role)
values ('YOUR_AUTH_USER_ID', 'admin')
on conflict (user_id) do update set role = 'admin';
~~~

Find YOUR_AUTH_USER_ID in Supabase → Authentication → Users.

### 5. Run

~~~bash
npm run dev
~~~

Open http://localhost:5173.

### 6. Build

~~~bash
npm run build
npm run preview
~~~

---

## Security Notes

- Every table has **Row Level Security** enabled with least-privilege policies.
- Users can only access their own profiles, lists, history, progress and ratings.
- Published content is readable by authenticated users; all mutations require the **admin** role (checked in the database, not the frontend).
- The service-role key is never used client-side.
- Kids profiles only see G/PG-rated content.

---

## Media

All demo videos are the public Google sample bucket (Big Buck Bunny, Sintel, Tears of Steel, etc. - Creative Commons). Posters/backdrops use picsum.photos placeholders. Replace these with your own licensed or original assets for production.

---

## Future Improvements

- Supabase Storage upload for posters/avatars
- Real recommendation scoring with SQL functions
- Episode thumbnails from Storage
- i18n / multiple languages
- Automated tests (Vitest + Playwright)

---

*StreamFlix is a portfolio demo project. Not affiliated with Netflix.*
