import React from 'react';
import { Clapperboard } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Clapperboard className="h-10 w-10 animate-pulse text-primary" />
        <span className="text-sm font-medium tracking-wide text-text-secondary">StreamFlix</span>
      </div>
    </div>
  );
}
