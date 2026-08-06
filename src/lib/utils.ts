import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatMinutes(minutes?: number | null): string {
  if (minutes == null) return '';
  if (minutes < 60) return minutes + 'm';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? h + 'h ' + m + 'm' : h + 'h';
}

export function formatSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = m < 10 ? '0' + m : String(m);
  const ss = sec < 10 ? '0' + sec : String(sec);
  if (h > 0) {
    const hh = h < 10 ? '0' + h : String(h);
    return hh + ':' + mm + ':' + ss;
  }
  return mm + ':' + ss;
}

export function formatDate(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function friendlyError(err: unknown): string {
  if (!err) return 'Something went wrong. Please try again.';
  if (typeof err === 'string') return err;
  const e = err as { message?: string; code?: string };
  if (e.code === '23505') return 'This item already exists.';
  if (e.code === '23503') return 'This item is linked to other data and cannot be removed.';
  if (e.message) {
    if (e.message.includes('Invalid login credentials')) return 'Incorrect email or password.';
    if (e.message.includes('Email not confirmed')) return 'Please confirm your email before signing in.';
    if (e.message.includes('rate limit')) return 'Too many attempts. Please wait a moment.';
    return e.message;
  }
  return 'Something went wrong. Please try again.';
}
