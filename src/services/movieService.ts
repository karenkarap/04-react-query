import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}

const myKey = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

export const fetchMovies = async (topic: string, page: number): Promise<MovieHttpResponse> => {
  const response = await axios.get<MovieHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${topic}&include_adult=false&language=en-US&page=${page}`
  );

  return response.data;
};
