import React from 'react';
import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthShell({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <img
        src="https://picsum.photos/seed/streamflix-auth/1920/1080"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-borderc bg-surface/95 p-8 shadow-2xl">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2" aria-label="StreamFlix home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Clapperboard className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-extrabold text-text-primary">
            Stream<span className="text-primary">Flix</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
