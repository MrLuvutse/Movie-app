import React, { useEffect, useState } from 'react';
import { useMovies } from '../context/MovieContext';
import useFetch from '../hooks/useFetch';
import MovieCard from '../components/MovieCard';
import '../pages/Browse.css';

const Browse = () => {
  const { state, dispatch } = useMovies();
  const [query, setQuery] = useState(state.searchQuery || '');

  useEffect(() => {
    setQuery(state.searchQuery);
  }, [state.searchQuery]);

  const { data: searchResults, loading } = useFetch(`/api/movies/search?query=${query}`, 'SET_SEARCH_RESULTS');

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  return (
    <div className="browse">
      <form onSubmit={handleSearch} className="search-section">
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input-large"
        />
        <button type="submit">Search</button>
      </form>
      <div className="movies-grid">
        {loading ? (
          <p>Loading...</p>
        ) : searchResults && searchResults.length > 0 ? (
          searchResults.map(movie => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default Browse;
