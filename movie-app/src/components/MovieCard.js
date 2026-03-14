import React from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import "./MovieCard.css";

function StarRating({ rating }) {
  const stars = Math.round((rating / 10) * 5);
  return (
    <div className="stars">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={`star${i <= stars ? "" : " empty"}`}>★</span>
      ))}
    </div>
  );
}

export default function MovieCard({ movie, size = "md" }) {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovies();
  const inList = isInWatchlist(movie.id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    inList ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
  };

  return (
    <div
      className={`movie-card movie-card--${size}`}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="movie-card__poster">
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="movie-card__no-poster">
            <span>🎬</span>
            <p>{movie.title}</p>
          </div>
        )}
        <div className="movie-card__overlay">
          <StarRating rating={movie.rating} />
          <p className="movie-card__overview">{movie.overview}</p>
        </div>
        <div className="movie-card__rating">{movie.rating}</div>
        <button
          className={`movie-card__watchlist-btn${inList ? " active" : ""}`}
          onClick={handleWatchlist}
          title={inList ? "Remove from watchlist" : "Add to watchlist"}
        >
          {inList ? "✓" : "+"}
        </button>
      </div>
      <div className="movie-card__info">
        <div className="movie-card__title">{movie.title}</div>
        <div className="movie-card__meta">{movie.year}</div>
      </div>
    </div>
  );
}