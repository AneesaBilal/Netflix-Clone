import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCircle, Film, Tv, ListVideo, Tags, PlayCircle } from 'lucide-react';
import { fetchAdminStats } from '../../services/adminService';
import { StatCard } from './StatCard';
import { Skeleton } from '../../components/ui/Skeleton';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: fetchAdminStats,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
        <p className="text-sm text-text-secondary">Platform overview at a glance.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats ? stats.totalUsers : 0} />
        <StatCard icon={UserCircle} label="Profiles" value={stats ? stats.totalProfiles : 0} />
        <StatCard icon={Film} label="Movies" value={stats ? stats.totalMovies : 0} />
        <StatCard icon={Tv} label="TV Shows" value={stats ? stats.totalShows : 0} />
        <StatCard icon={ListVideo} label="Episodes" value={stats ? stats.totalEpisodes : 0} />
        <StatCard icon={Tags} label="Genres" value={stats ? stats.totalGenres : 0} />
        <StatCard icon={PlayCircle} label="Watch Sessions" value={stats ? stats.totalWatchSessions : 0} />
      </div>
    </div>
  );
}
