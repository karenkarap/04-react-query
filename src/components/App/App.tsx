import toast, { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import './App.module.css';
import { fetchMovies, type MovieHttpResponse } from '../../services/movieService';
import { useEffect, useState } from 'react';
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isSuccess, isLoading, isError } = useQuery<MovieHttpResponse>({
    queryKey: ['movies', query, currentPage],
    queryFn: async () => fetchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isSuccess]);

  const onSubmit = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => setSelectedMovie(null);
  const totalPages = data?.total_pages ?? 0;

  return (
    <>
      <SearchBar onSubmit={onSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isSuccess && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleMovieClick} />
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
