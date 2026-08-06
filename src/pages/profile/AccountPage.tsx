import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProfileStore } from '../../stores/profileStore';
import { useThemeStore } from '../../stores/themeStore';
import { Button } from '../../components/ui/Button';

export default function AccountPage() {
  const { user, isAdmin, logout } = useAuth();
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-8">
      <div className="rounded-2xl border border-borderc bg-surface p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
            {activeProfile ? activeProfile.name.charAt(0).toUpperCase() : 'U'}
          </span>
          <div>
            <p className="text-lg font-semibold text-text-primary">{activeProfile ? activeProfile.name : 'No profile selected'}</p>
            <p className="text-sm text-text-secondary">{user ? user.email : ''}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-borderc bg-surface p-6">
        <h2 className="mb-4 font-semibold text-text-primary">Appearance</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={'flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ' + (theme === 'dark' ? 'border-primary text-primary' : 'border-borderc text-text-secondary')}
          >
            <Moon className="h-4 w-4" /> Dark
          </button>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={'flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ' + (theme === 'light' ? 'border-primary text-primary' : 'border-borderc text-text-secondary')}
          >
            <Sun className="h-4 w-4" /> Light
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-borderc bg-surface p-6">
        <h2 className="mb-4 font-semibold text-text-primary">Account</h2>
        <div className="space-y-2">
          <Link to="/profiles" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-primary hover:bg-surface-hover">
            <User className="h-4 w-4 text-text-secondary" /> Manage profiles
          </Link>
          <Link to="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-primary hover:bg-surface-hover">
            <Settings className="h-4 w-4 text-text-secondary" /> Settings & privacy
          </Link>
          <Link to="/history" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-primary hover:bg-surface-hover">
            <User className="h-4 w-4 text-text-secondary" /> Watch history
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-primary hover:bg-surface-hover">
              <LayoutDashboard className="h-4 w-4 text-text-secondary" /> Admin dashboard
            </Link>
          )}
          <button type="button" onClick={() => { logout(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 hover:bg-surface-hover">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => navigate('/home')}>Back to browsing</Button>
    </div>
  );
}
