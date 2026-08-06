import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-hover', className)} />;
}

export function MovieCardSkeleton() {
  return (
    <div className="w-40 shrink-0 sm:w-44">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </div>
  );
}

export function ContentRowSkeleton({ title }: { title?: string }) {
  return (
    <section className="space-y-3 px-4 sm:px-8">
      <Skeleton className="h-6 w-48" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
      {title ? null : null}
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[60vh] w-full overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-10 left-4 space-y-3 sm:left-8">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-32" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export function EpisodeSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="h-24 w-40 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
