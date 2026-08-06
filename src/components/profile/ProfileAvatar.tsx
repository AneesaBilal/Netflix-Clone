import React from 'react';
import type { Profile } from '../../types';
import { cn } from '../../lib/utils';

interface ProfileAvatarProps {
  profile: Profile;
  size?: 'sm' | 'lg';
}

const palette = ['bg-primary', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500'];

export function ProfileAvatar({ profile, size = 'sm' }: ProfileAvatarProps) {
  const colorClass = palette[Math.abs(hash(profile.id)) % palette.length];

  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.name}
        className={cn(
          'rounded-xl object-cover',
          size === 'lg' ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-10 w-10'
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl font-bold text-white',
        colorClass,
        size === 'lg'
          ? 'h-28 w-28 text-4xl sm:h-32 sm:w-32 sm:text-5xl'
          : 'h-10 w-10 text-base'
      )}
      aria-hidden="true"
    >
      {profile.name.charAt(0).toUpperCase()}
    </div>
  );
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return h;
}
