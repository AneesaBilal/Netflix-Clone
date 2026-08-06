import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import type { UserRoleName } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  initializing: boolean;
  role: UserRoleName;
  setSession: (session: Session | null) => void;
  setRole: (role: UserRoleName) => void;
  setInitializing: (value: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  initializing: true,
  role: 'user',
  setSession: (session) =>
    set({ session, user: session ? session.user : null, initializing: false }),
  setRole: (role) => set({ role }),
  setInitializing: (initializing) => set({ initializing }),
  signOut: () => set({ user: null, session: null, role: 'user' }),
}));
