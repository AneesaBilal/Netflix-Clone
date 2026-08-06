import { supabase } from '../lib/supabase';
import type { UserRoleName } from '../types';

export async function signUp(fullName: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function requestPasswordReset(email: string) {
  const redirectTo = window.location.origin + '/reset-password';
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  return { error };
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error };
}

export async function getUserRole(userId: string): Promise<UserRoleName> {
  const { data } = await supabase
    .from('streamflix_user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  return (data && data.role) || 'user';
}
