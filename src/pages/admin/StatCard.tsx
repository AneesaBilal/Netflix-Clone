import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-borderc bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-3 text-3xl font-bold text-text-primary">{value}</p>
    </div>
  );
}
