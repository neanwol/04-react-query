import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from '../ReactPaginate/ReactPaginate';
import { fetchMovies } from '../../services/movieService';
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

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['search', queryState.query, queryState.page],
    queryFn: () =>
      fetchMovies({
        endpoint: 'search',
        query: queryState.query!,
        page: queryState.page,
      }),
    enabled: Boolean(queryState.query),
    placeholderData: (previousData) => previousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0 && queryState.query) {
      toast.error('No movies found for your search.');
    }
  }, [isSuccess, movies.length, queryState.query]);

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

  const handlePageChange = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    setQueryState((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      
      {isError && <ErrorMessage message="Failed to load movies. Please try again." />}
      
      {isLoading && <Loader />}
      
      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              onPageChange={handlePageChange}
              forcePage={queryState.page - 1}
            />
          )}
        </>
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