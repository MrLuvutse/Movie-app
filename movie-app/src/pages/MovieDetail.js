import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import '../pages/MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const { dispatch, state } = useMovies();
  const { data: movie, loading } = useFetch(`/api/movie/${id}`, 'SET_SELECTED_MOVIE');

  if (loading) return <div className="loading">Loading...</div>;
  if (!movie) return <div>Movie not found.</div>;

  const trailer = movie.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  const trailerKey = trailer ? trailer.key : null;
  const isInWatchlist = state.watchlist.some(m => m.id === movie.id);

  return (
    <div className="movie-detail">
      <div className="detail-header">
        <img 
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} 
          alt={movie.title} 
          className="backdrop"
        />
        <div className="detail-overlay">
          <div className="poster">
            <img src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={movie.title} />
          </div>
          <div className="info">
            <h1>{movie.title}</h1>
            <p>{movie.tagline}</p>
            <p>⭐ {movie.vote_average?.toFixed(1)} | {movie.release_date}</p>
            <p>{movie.overview}</p>
            {trailerKey && (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
                allowFullScreen
                className="trailer"
              ></iframe>
            )}
            <button className={`watchlist-btn ${isInWatchlist ? 'remove' : ''}`}>
              {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>
      <div className="similar-movies">
        <h3>Similar Movies</h3>
        {/* Fetch similar would require additional backend endpoint */}
      </div>
    </div>
  );
};

export default MovieDetail;
