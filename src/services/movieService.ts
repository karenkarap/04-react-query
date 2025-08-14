import axios from 'axios';
import type { Movie } from '../types/movie';

interface MovieHttpResponse {
  results: Movie[];
}

const myKey = import.meta.env.VITE_TMDB_TOKEN;
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

export const fetchMovies = async (topic: string): Promise<Movie[]> => {
  const response = await axios.get<MovieHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${topic}&include_adult=false&language=en-US&page=1`
  );

  return response.data.results;
};
