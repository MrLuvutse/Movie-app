import React from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import '../components/MovieCard.css';

const MovieCard = ({ movie }) => {
  const { dispatch, state } = useMovies();
  const isInWatchlist = state.watchlist.some((m) => m.id === movie.id);

  const toggleWatchlist = () => {
    if (isInWatchlist) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: movie });
    } else {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: movie });
    }
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <img src={posterUrl} alt={movie.title} className="movie-poster" loading="lazy" />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>{movie.release_date?.split('-')[0] || 'N/A'}</p>
          <p>⭐ {movie.vote_average?.toFixed(1)}</p>
        </div>
      </Link>
      <button onClick={toggleWatchlist} className="watchlist-btn">
        {isInWatchlist ? 'Remove' : 'Add to Watchlist'}
      </button>
    </div>
  );
};

export default MovieCard;
