import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '../types';

interface ProfileState {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile | null) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: null,
      setActiveProfile: (activeProfile) => set({ activeProfile }),
    }),
    { name: 'streamflix.activeProfile' }
  )
);
