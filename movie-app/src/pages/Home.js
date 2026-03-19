import React from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import useFetch from "../hooks/useFetch";
import "./Home.css";

function Hero({ movie }) {
  const navigate = useNavigate();
  const { addToWatchlist, isInWatchlist } = useMovies();
  const inList = isInWatchlist(movie?.id);
  if (!movie) return <div className="hero hero--loading" />;
  return (
    <div className="hero" style={movie.backdrop ? { "--hero-bg": `url(${movie.backdrop})` } : {}}>
      <div className="hero__backdrop" />
      <div className="hero__overlay" />
      <div className="hero__content">
        <div className="hero__badge">✦ Featured Tonight</div>
        <h1 className="hero__title">{movie.title}</h1>
        <div className="hero__meta">
          <div className="stars">
            {[1,2,3,4,5].map((i) => (
              <span key={i} className={`star${i <= Math.round((movie.rating/10)*5) ? "" : " empty"}`}>★</span>
            ))}
          </div>
          <span className="hero__year">{movie.year} · {movie.rating}/10</span>
        </div>
        <p className="hero__overview">{movie.overview?.slice(0, 180)}…</p>
        <div className="hero__actions">
          <button className="btn-primary" onClick={() => navigate(`/movie/${movie.id}`)}>▶ View Details</button>
          <button className="btn-secondary" onClick={() => !inList && addToWatchlist(movie)}>
            {inList ? "✓ In Watchlist" : "+ Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: trending, loading: tLoading } = useFetch("/api/trending", { page: 1 });
  const { data: popular, loading: pLoading } = useFetch("/api/popular", { page: 1 });
  const { data: topRated, loading: trLoading } = useFetch("/api/top-rated", { page: 1 });
  const navigate = useNavigate();

  return (
    <div className="home">
<Hero movie={trending?.results?.[0] || null} />
      <div className="page-container home__sections">

        <section className="home__section">
          <div className="section-header">
            <h2 className="section-title">Trending This Week</h2>
<span className="see-all" onClick={() => navigate("/browse?tab=trending&page=1")}>See all →</span>
          </div>
          {tLoading ? <div className="spinner" /> : (
            <div className="movies-grid">
              {trending?.results?.slice(0, 6).map((m) => <MovieCard key={m.id} movie={m} />) || []}
            </div>
          )}
        </section>

        <section className="home__section">
          <div className="section-header">
            <h2 className="section-title">Popular Now</h2>
<span className="see-all" onClick={() => navigate("/browse?tab=popular&page=1")}>See all →</span>
          </div>
          {pLoading ? <div className="spinner" /> : (
            <div className="movies-scroll-row">
              {popular?.results?.slice(0, 10).map((m) => (
                <div key={m.id} className="scroll-item"><MovieCard movie={m} size="sm" /></div>
              )) || []}
            </div>
          )}
        </section>

        <section className="home__section">
          <div className="section-header">
            <h2 className="section-title">Top Rated All Time</h2>
<span className="see-all" onClick={() => navigate("/browse?tab=top-rated&page=1")}>See all →</span>
          </div>
          {trLoading ? <div className="spinner" /> : (
            <div className="top-rated-list">
              {topRated?.results?.slice(0, 8).map((m, i) => (
                <div key={m.id} className="top-rated-item" onClick={() => navigate(`/movie/${m.id}`)}>
                  <div className="top-rated-rank">{i + 1}</div>
                  <div className="top-rated-poster">
                    {m.poster ? <img src={m.poster} alt={m.title} loading="lazy" /> : <span>🎬</span>}
                  </div>
                  <div className="top-rated-info">
                    <div className="top-rated-title">{m.title}</div>
                    <div className="top-rated-meta">{m.year}</div>
                    <div className="stars" style={{ marginTop: 4 }}>
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={`star${s <= Math.round((m.rating/10)*5) ? "" : " empty"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="top-rated-score">{m.rating}</div>
                </div>
              )) || []}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}