import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import { useAuth } from './hooks/useAuth';
import { PageLoader } from './components/layout/PageLoader';

import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ProfileRoute } from './components/layout/ProfileRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { AdminLayout } from './components/layout/AdminLayout';
import { AppLayout } from './components/layout/AppLayout';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage'));

const ProfilesPage = React.lazy(() => import('./pages/profile/ProfilesPage'));
const HomePage = React.lazy(() => import('./pages/home/HomePage'));
const BrowsePage = React.lazy(() => import('./pages/browse/BrowsePage'));
const MoviesPage = React.lazy(() => import('./pages/browse/MoviesPage'));
const TvShowsPage = React.lazy(() => import('./pages/browse/TvShowsPage'));
const SearchPage = React.lazy(() => import('./pages/search/SearchPage'));
const MyListPage = React.lazy(() => import('./pages/mylist/MyListPage'));
const HistoryPage = React.lazy(() => import('./pages/history/HistoryPage'));
const ContinueWatchingPage = React.lazy(() => import('./pages/continue/ContinueWatchingPage'));
const MovieDetailsPage = React.lazy(() => import('./pages/details/MovieDetailsPage'));
const TvShowDetailsPage = React.lazy(() => import('./pages/details/TvShowDetailsPage'));
const WatchMoviePage = React.lazy(() => import('./pages/watch/WatchMoviePage'));
const WatchEpisodePage = React.lazy(() => import('./pages/watch/WatchEpisodePage'));
const AccountPage = React.lazy(() => import('./pages/profile/AccountPage'));
const SettingsPage = React.lazy(() => import('./pages/profile/SettingsPage'));

const AdminDashboardPage = React.lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminMoviesPage = React.lazy(() => import('./pages/admin/AdminMoviesPage'));
const AdminTvShowsPage = React.lazy(() => import('./pages/admin/AdminTvShowsPage'));
const AdminSeasonsPage = React.lazy(() => import('./pages/admin/AdminSeasonsPage'));
const AdminEpisodesPage = React.lazy(() => import('./pages/admin/AdminEpisodesPage'));
const AdminGenresPage = React.lazy(() => import('./pages/admin/AdminGenresPage'));
const AdminUsersPage = React.lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminFeaturedPage = React.lazy(() => import('./pages/admin/AdminFeaturedPage'));
const AdminSettingsPage = React.lazy(() => import('./pages/admin/AdminSettingsPage'));

const LibraryPage = React.lazy(() => import('./pages/library/LibraryPage'));
const WatchArchivePage = React.lazy(() => import('./pages/watch/WatchArchivePage'));
const WatchTmdbPage = React.lazy(() => import('./pages/watch/WatchTmdbPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  const theme = useThemeStore((s) => s.theme);
  const { initializing } = useAuth();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [theme]);

  if (initializing) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Profile selection only requires auth */}
        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <ProfilesPage />
            </ProtectedRoute>
          }
        />

        {/* Authenticated + profile required */}
        <Route
          element={
            <ProtectedRoute>
              <ProfileRoute>
                <AppLayout />
              </ProfileRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/tv-shows" element={<TvShowsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/continue-watching" element={<ContinueWatchingPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/movie/:slug" element={<MovieDetailsPage />} />
          <Route path="/tv/:slug" element={<TvShowDetailsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Player (auth required, profile optional) */}
        <Route
          path="/watch/movie/:id"
          element={
            <ProtectedRoute>
              <WatchMoviePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/episode/:id"
          element={
            <ProtectedRoute>
              <WatchEpisodePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watch/archive/:id"
          element={
            <ProtectedRoute>
              <WatchArchivePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/watch/tmdb/:id"
          element={
            <ProtectedRoute>
              <WatchTmdbPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="movies" element={<AdminMoviesPage />} />
          <Route path="tv-shows" element={<AdminTvShowsPage />} />
          <Route path="seasons" element={<AdminSeasonsPage />} />
          <Route path="episodes" element={<AdminEpisodesPage />} />
          <Route path="genres" element={<AdminGenresPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="featured" element={<AdminFeaturedPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
