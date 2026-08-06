import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useProfileStore } from '../stores/profileStore';
import type { UserRoleName } from '../types';

async function loadRole(userId: string): Promise<UserRoleName> {
  const { data } = await supabase
    .from('streamflix_user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  return (data && data.role) || 'user';
}

export function useAuth() {
  const navigate = useNavigate();
  const { user, session, initializing, role, setSession, setRole, setInitializing, signOut } =
    useAuthStore();
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session && data.session.user) {
        const r = await loadRole(data.session.user.id);
        if (mounted) setRole(r);
      }
    }

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession && newSession.user) {
        const r = await loadRole(newSession.user.id);
        if (mounted) setRole(r);
      } else {
        setRole('user');
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    signOut();
    setActiveProfile(null);
    navigate('/login');
  }, [navigate, setActiveProfile, signOut]);

  return {
    user,
    session,
    initializing,
    role,
    isAdmin: role === 'admin',
    isAuthenticated: Boolean(user),
    logout,
  };
}
