import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { PageLoader } from './PageLoader';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return <AdminGate>{children}</AdminGate>;
}

function AdminGate({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.role);
  if (role !== 'admin') return <Navigate to="/home" replace />;
  return <>{children}</>;
}
