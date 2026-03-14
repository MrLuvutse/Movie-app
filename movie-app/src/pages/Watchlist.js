import React from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import "./Watchlist.css";

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = useMovies();
  const navigate = useNavigate();

  return (
    <div className="watchlist">
      <div className="page-container">
        <div className="section-header" style={{ marginBottom: 32 }}>
          <h1 className="section-title">My Watchlist</h1>
          {watchlist.length > 0 && (
            <span className="watchlist__count">{watchlist.length} film{watchlist.length !== 1 ? "s" : ""}</span>
          )}
        </div>
        {watchlist.length === 0 ? (
          <div className="watchlist__empty">
            <div className="watchlist__empty-icon">🎬</div>
            <h2 className="watchlist__empty-title">Your watchlist is empty</h2>
            <p className="watchlist__empty-sub">Start adding films you want to see. Browse our collection and hit the + button on any movie.</p>
            <button className="btn-primary" onClick={() => navigate("/browse")}>Browse Movies</button>
          </div>
        ) : (
          <div className="watchlist__grid">
            {watchlist.map((movie) => (
              <div key={movie.id} className="watchlist__item">
                <MovieCard movie={movie} />
                <button className="watchlist__remove" onClick={() => removeFromWatchlist(movie.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}