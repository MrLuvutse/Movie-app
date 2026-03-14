import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import "./MovieDetail.css";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovies();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const inList = isInWatchlist(Number(id));

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    fetch(`http://localhost:5000/api/movie/${id}`)
      .then((r) => r.json())
      .then((d) => { setMovie(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="detail-loading"><div className="spinner" /></div>;
  if (!movie) return <div className="detail-loading"><p>Movie not found.</p></div>;

  const handleWatchlist = () => {
    if (inList) removeFromWatchlist(movie.id);
    else addToWatchlist({ id: movie.id, title: movie.title, poster: movie.poster, backdrop: movie.backdrop, rating: movie.rating, year: movie.year });
  };

  const hours = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;

  return (
    <div className="detail">
      {movie.backdrop && (
        <div className="detail__backdrop" style={{ backgroundImage: `url(${movie.backdrop})` }}>
          <div className="detail__backdrop-overlay" />
        </div>
      )}
      <div className="page-container detail__content">
        <button className="detail__back" onClick={() => navigate(-1)}>← Back</button>
        <div className="detail__main">
          <div className="detail__poster">
            {movie.poster ? <img src={movie.poster} alt={movie.title} /> : <div className="detail__no-poster">🎬</div>}
          </div>
          <div className="detail__info">
            {movie.tagline && <p className="detail__tagline">"{movie.tagline}"</p>}
            <h1 className="detail__title">{movie.title}</h1>
            <div className="detail__chips">
              <span className="detail__chip detail__chip--gold">⭐ {movie.rating}/10</span>
              <span className="detail__chip">{movie.year}</span>
              {movie.runtime > 0 && <span className="detail__chip">{hours}h {mins}m</span>}
              {movie.genres?.map((g) => <span key={g.id} className="detail__chip">{g.name}</span>)}
            </div>
            <p className="detail__overview">{movie.overview}</p>
            <div className="detail__actions">
              <button className={`btn-primary${inList ? " btn-primary--done" : ""}`} onClick={handleWatchlist}>
                {inList ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
              {movie.trailer && (
                <a className="btn-secondary" href={`https://www.youtube.com/watch?v=${movie.trailer}`} target="_blank" rel="noopener noreferrer">
                  ▶ Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
        {movie.cast?.length > 0 && (
          <section className="detail__cast-section">
            <h2 className="section-title" style={{ marginBottom: 20 }}>Cast</h2>
            <div className="detail__cast">
              {movie.cast.map((c) => (
                <div key={c.id} className="cast-card">
                  <div className="cast-card__photo">
                    {c.photo ? <img src={c.photo} alt={c.name} loading="lazy" /> : (
                      <div className="cast-card__initials">{c.name.split(" ").map((w) => w[0]).join("").slice(0,2)}</div>
                    )}
                  </div>
                  <div className="cast-card__name">{c.name}</div>
                  <div className="cast-card__role">{c.character}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}