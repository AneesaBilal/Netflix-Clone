import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { Button } from '../../components/ui/Button';

export default function AdminSettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
        <p className="text-sm text-text-secondary">Admin console preferences.</p>
      </div>

      <section className="rounded-2xl border border-borderc bg-surface p-6">
        <h3 className="mb-4 font-semibold text-text-primary">Appearance</h3>
        <div className="flex gap-3">
          <button type="button" onClick={() => setTheme('dark')} className={'flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ' + (theme === 'dark' ? 'border-primary text-primary' : 'border-borderc text-text-secondary')}>
            <Moon className="h-4 w-4" /> Dark
          </button>
          <button type="button" onClick={() => setTheme('light')} className={'flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ' + (theme === 'light' ? 'border-primary text-primary' : 'border-borderc text-text-secondary')}>
            <Sun className="h-4 w-4" /> Light
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-borderc bg-surface p-6">
        <h3 className="mb-2 font-semibold text-text-primary">Quick links</h3>
        <p className="mb-4 text-sm text-text-secondary">Jump back into the main app or review content.</p>
        <Link to="/home"><Button variant="secondary">Open StreamFlix</Button></Link>
      </section>
    </div>
  );
}
