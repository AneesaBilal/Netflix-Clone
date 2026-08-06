import { supabase } from '../lib/supabase';
import type { Genre } from '../types';

export async function fetchGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from('streamflix_genres')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data as Genre[]) || [];
}

export async function createGenre(input: {
  name: string;
  slug: string;
  description?: string;
}): Promise<Genre> {
  const { data, error } = await supabase
    .from('streamflix_genres')
    .insert({ name: input.name, slug: input.slug, description: input.description || null })
    .select()
    .single();
  if (error) throw error;
  return data as Genre;
}

export async function updateGenre(id: string, input: Partial<Genre>): Promise<Genre> {
  const { data, error } = await supabase
    .from('streamflix_genres')
    .update({ name: input.name, slug: input.slug, description: input.description })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Genre;
}

export async function deleteGenre(id: string): Promise<void> {
  const { error } = await supabase.from('streamflix_genres').delete().eq('id', id);
  if (error) throw error;
}
