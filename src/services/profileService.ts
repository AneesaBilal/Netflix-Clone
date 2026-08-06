import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export async function fetchProfiles(userId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('streamflix_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as Profile[]) || [];
}

export async function createProfile(input: {
  userId: string;
  name: string;
  avatarUrl?: string;
  isKids?: boolean;
  language?: string;
}): Promise<Profile> {
  const { data, error } = await supabase
    .from('streamflix_profiles')
    .insert({
      user_id: input.userId,
      name: input.name,
      avatar_url: input.avatarUrl || null,
      is_kids: Boolean(input.isKids),
      language: input.language || 'en',
    })
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(id: string, input: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('streamflix_profiles')
    .update({
      name: input.name,
      avatar_url: input.avatar_url,
      is_kids: input.is_kids,
      language: input.language,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function deleteProfile(id: string): Promise<void> {
  const { error } = await supabase.from('streamflix_profiles').delete().eq('id', id);
  if (error) throw error;
}
