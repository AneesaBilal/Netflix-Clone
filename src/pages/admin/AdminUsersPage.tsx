import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminUsers } from '../../services/adminService';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: fetchAdminUsers });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Users</h2>
        <p className="text-sm text-text-secondary">Role assignments for registered accounts.</p>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borderc bg-surface">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-borderc text-left text-text-secondary">
                <th className="px-4 py-3 font-medium">User ID</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((user) => (
                <tr key={user.user_id} className="border-b border-borderc last:border-0 hover:bg-surface-hover/40">
                  <td className="px-4 py-3 font-mono text-xs text-text-secondary">{user.user_id}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-text-secondary">
        Note: emails are stored in Supabase Auth and are not directly readable from the client for security.
        Manage roles from the SQL editor or Supabase dashboard.
      </p>
    </div>
  );
}
