const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w500';
const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

export const hasTmdbKey = Boolean(API_KEY);

export interface TmdbItem {
  id: number;
  title: string;
  overview: string;
  poster_url: string;
  backdrop_url: string;
  release_date: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
}

function formatItem(data: any, type: 'movie' | 'tv'): TmdbItem {
  return {
    id: data.id,
    title: data.title || data.name || 'Untitled',
    overview: data.overview || '',
    poster_url: data.poster_path ? IMG + data.poster_path : '',
    backdrop_url: data.backdrop_path ? IMG_ORIGINAL + data.backdrop_path : '',
    release_date: data.release_date || data.first_air_date || '',
    vote_average: data.vote_average || 0,
    media_type: type,
  };
}

async function getJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchTrending(): Promise<TmdbItem[]> {
  if (!hasTmdbKey) return [];
  const json = await getJson(BASE + '/trending/all/week?api_key=' + API_KEY);
  const results = (json && json.results) || [];
  return results
    .filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv')
    .slice(0, 20)
    .map((r: any) => formatItem(r, r.media_type === 'tv' ? 'tv' : 'movie'));
}

export async function fetchPopularMovies(): Promise<TmdbItem[]> {
  if (!hasTmdbKey) return [];
  const json = await getJson(BASE + '/movie/popular?api_key=' + API_KEY);
  const results = (json && json.results) || [];
  return results.slice(0, 20).map((r: any) => formatItem(r, 'movie'));
}

export async function fetchPopularTV(): Promise<TmdbItem[]> {
  if (!hasTmdbKey) return [];
  const json = await getJson(BASE + '/tv/popular?api_key=' + API_KEY);
  const results = (json && json.results) || [];
  return results.slice(0, 20).map((r: any) => formatItem(r, 'tv'));
}

export async function getTrailerKey(
  id: number,
  type: 'movie' | 'tv'
): Promise<string | null> {
  if (!hasTmdbKey) return null;
  const json = await getJson(BASE + '/' + type + '/' + id + '/videos?api_key=' + API_KEY);
  const results = (json && json.results) || [];
  const trailer = results.find(
    (v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );
  return trailer ? trailer.key : null;
}
