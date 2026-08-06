import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfileStore } from '../../stores/profileStore';

export function ProfileRoute({ children }: { children: React.ReactNode }) {
  const activeProfile = useProfileStore((s) => s.activeProfile);
  if (!activeProfile) return <Navigate to="/profiles" replace />;
  return <>{children}</>;
}
