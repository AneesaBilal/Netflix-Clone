import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-borderc bg-surface px-6 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500" />
      <h3 className="text-lg font-semibold text-text-primary">Something went wrong</h3>
      <p className="max-w-md text-sm text-text-secondary">
        {message || 'We could not load this content. Please try again.'}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      )}
    </div>
  );
}
