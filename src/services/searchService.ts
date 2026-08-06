import { searchMovies } from './movieService';
import { searchShows } from './tvShowService';
import type { Movie, TvShow } from '../types';

export interface SearchResults {
  movies: Movie[];
  shows: TvShow[];
}

export async function searchAll(query: string): Promise<SearchResults> {
  const [movies, shows] = await Promise.all([
    searchMovies(query),
    searchShows(query),
  ]);
  return { movies, shows };
}
