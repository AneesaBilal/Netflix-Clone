import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import { useProfileStore } from '../../stores/profileStore';
import { clearHistory } from '../../services/historyService';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

export default function SettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const activeProfile = useProfileStore((s) => s.activeProfile);
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const [autoplay, setAutoplay] = React.useState(true);
  const [previews, setPreviews] = React.useState(true);
  const [confirmClear, setConfirmClear] = React.useState(false);

  const handleClearHistory = async () => {
    if (!activeProfile) return;
    try {
      await clearHistory(activeProfile.id);
      queryClient.invalidateQueries({ queryKey: ['history'] });
      success('Watch history cleared.');
      setConfirmClear(false);
    } catch (err) {
      toastError('Could not clear history.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-8">
      <h1 className="text-3xl font-bold text-text-primary">Settings</h1>

      <section className="rounded-2xl border border-borderc bg-surface p-6">
        <h2 className="mb-4 font-semibold text-text-primary">Appearance</h2>
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
        <h2 className="mb-4 font-semibold text-text-primary">Playback</h2>
        <label className="mb-3 flex items-center justify-between text-sm text-text-primary">
          Autoplay next episode
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} className="h-4 w-4 accent-[var(--sf-primary)]" />
        </label>
        <label className="flex items-center justify-between text-sm text-text-primary">
          Show previews while browsing
          <input type="checkbox" checked={previews} onChange={(e) => setPreviews(e.target.checked)} className="h-4 w-4 accent-[var(--sf-primary)]" />
        </label>
      </section>

      <section className="rounded-2xl border border-borderc bg-surface p-6">
        <h2 className="mb-2 font-semibold text-text-primary">Privacy</h2>
        <p className="mb-4 text-sm text-text-secondary">Remove all titles from this profile's watch history.</p>
        <Button variant="danger" onClick={() => setConfirmClear(true)}>Clear watch history</Button>
      </section>

      <ConfirmDialog
        open={confirmClear}
        title="Clear watch history?"
        message="This permanently removes every item from this profile's history."
        confirmLabel="Clear all"
        onConfirm={handleClearHistory}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
