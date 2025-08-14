import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import './App.module.css';
import { fetchMovies } from '../../services/movieService';
import { useState } from 'react';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const onSubmit = async (query: string) => {
    try {
      setIsLoading(true);
      setMovies([]);
      setIsError(false);

      const moviesArr = await fetchMovies(query);
      if (moviesArr.length > 0) {
        setMovies(moviesArr);
      } else {
        toast.error('No movies found for your request.');
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={onSubmit} />
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={handleMovieClick} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
    </>
  );
}

export default App;
