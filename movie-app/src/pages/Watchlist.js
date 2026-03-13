import React from 'react';
import MovieCard from '../components/MovieCard';
import { useMovies } from '../context/MovieContext';
import '../pages/Watchlist.css';

const Watchlist = () => {
  const { state } = useMovies();

  if (state.watchlist.length === 0) {
    return (
      <div className="watchlist-empty">
        <h2>My Watchlist</h2>
        <p>No movies in watchlist. Add some from Home or Browse!</p>
      </div>
    );
  }

  return (
    <div className="watchlist">
      <h2>My Watchlist ({state.watchlist.length})</h2>
      <div className="movies-grid">
        {state.watchlist.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
