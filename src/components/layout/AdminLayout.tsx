import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Film, Tv, Layers, ListVideo, Tags, Users, UserCircle,
  Star, Settings, LogOut, Menu, X, Clapperboard,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/movies', label: 'Movies', icon: Film },
  { to: '/admin/tv-shows', label: 'TV Shows', icon: Tv },
  { to: '/admin/seasons', label: 'Seasons', icon: Layers },
  { to: '/admin/episodes', label: 'Episodes', icon: ListVideo },
  { to: '/admin/genres', label: 'Genres', icon: Tags },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/featured', label: 'Featured', icon: Star },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-borderc bg-surface transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-borderc px-5">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Clapperboard className="h-5 w-5 text-white" />
            </span>
            <span className="font-extrabold text-text-primary">StreamFlix</span>
            <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">Admin</span>
          </Link>
          <button type="button" onClick={() => setOpen(false)} className="lg:hidden text-text-secondary" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3" aria-label="Admin">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/12 text-primary'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  )
                }
              >
                <Icon className="h-4.5 w-4.5 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-borderc bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} className="lg:hidden text-text-secondary" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-text-primary">Admin Console</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/home" className="rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary">
              View site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-surface-hover"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
