import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { NAV_LINKS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useProfileStore } from '../../stores/profileStore';

export function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-borderc bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-surface-hover text-text-primary'
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/search')}
            aria-label="Search"
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-hover"
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-sm font-bold text-primary">
                {activeProfile && activeProfile.avatar_url ? (
                  <img src={activeProfile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  (activeProfile ? activeProfile.name : 'U').charAt(0).toUpperCase()
                )}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-text-secondary sm:block" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-borderc bg-surface shadow-2xl"
              >
                <div className="border-b border-borderc px-4 py-3">
                  <p className="text-sm font-semibold text-text-primary">
                    {activeProfile ? activeProfile.name : 'No profile'}
                  </p>
                  <p className="truncate text-xs text-text-secondary">{user ? user.email : ''}</p>
                </div>
                <div className="p-1.5">
                  <Link role="menuitem" to="/profiles" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-surface-hover">
                    <User className="h-4 w-4 text-text-secondary" /> Switch profile
                  </Link>
                  <Link role="menuitem" to="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-surface-hover">
                    <Settings className="h-4 w-4 text-text-secondary" /> Account & settings
                  </Link>
                  {isAdmin && (
                    <Link role="menuitem" to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-primary hover:bg-surface-hover">
                      <LayoutDashboard className="h-4 w-4 text-text-secondary" /> Admin dashboard
                    </Link>
                  )}
                  <button
                    role="menuitem"
                    type="button"
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-surface-hover"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
