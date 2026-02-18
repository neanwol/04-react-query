import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Pagination from '../ReactPaginate/ReactPaginate';
import { fetchTrendingMovies, searchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

interface AppQueryState {
  query: string | null;
  page: number;
}

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [queryState, setQueryState] = useState<AppQueryState>({
    query: null,
    page: 1,
  });

  const isSearching = queryState.query !== null;

  const { data, isLoading, error } = useQuery({
    queryKey: isSearching 
      ? ['searchMovies', queryState.query, queryState.page] 
      : ['trendingMovies', queryState.page],
    queryFn: () =>
      isSearching
        ? searchMovies(queryState.query!, queryState.page)
        : fetchTrendingMovies(queryState.page),
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  const errorMessage = error ? 'Failed to load movies. Please try again.' : '';

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      toast.error('Please enter a search query.');
      return;
    }

    setQueryState({
      query: query.trim(),
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    setQueryState((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      
      {errorMessage && <ErrorMessage message={errorMessage} />}
      
      {isLoading && <Loader />}
      
      {!isLoading && !errorMessage && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
          {totalPages > 1 && (
            <Pagination 
              totalPages={totalPages} 
              page={queryState.page} 
              onPageChange={handlePageChange} 
            />
          )}
        </>
      )}
      
      {!isLoading && !errorMessage && movies.length === 0 && isSearching && (
        <ErrorMessage message="No movies found for your search." />
      )}
      
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}

export default App;