import React from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-borderc bg-surface px-6 py-16 text-center">
      <div className="text-text-secondary">{icon || <Inbox className="h-10 w-10" />}</div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="max-w-md text-sm text-text-secondary">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
