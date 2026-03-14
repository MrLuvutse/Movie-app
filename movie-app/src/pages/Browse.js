import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import useFetch from "../hooks/useFetch";
import "./Browse.css";

const TABS = [
  { key: "trending", label: "Trending" },
  { key: "popular", label: "Popular" },
  { key: "top-rated", label: "Top Rated" },
  { key: "now-playing", label: "Now Playing" },
];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "trending");
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inputVal, setInputVal] = useState(searchParams.get("q") || "");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const { data: trending } = useFetch("/api/trending");
  const { data: popular } = useFetch("/api/popular");
  const { data: topRated } = useFetch("/api/top-rated");
  const { data: nowPlaying } = useFetch("/api/now-playing");

  const tabData = { trending, popular, "top-rated": topRated, "now-playing": nowPlaying };
  const movies = tabData[activeTab] || [];

  useEffect(() => {
    if (!query) { setSearchResults(null); return; }
    setSearching(true);
    fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => { setSearchResults(d); setSearching(false); })
      .catch(() => setSearching(false));
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputVal);
    if (inputVal) setSearchParams({ q: inputVal });
    else setSearchParams({});
  };

  const clearSearch = () => {
    setQuery(""); setInputVal(""); setSearchResults(null);
    setSearchParams({ tab: activeTab });
  };

  const displayMovies = query ? (searchResults || []) : movies;
  const isLoading = query ? searching : !tabData[activeTab];

  return (
    <div className="browse">
      <div className="page-container">
        <div className="browse__header">
          <h1 className="section-title browse__title">Browse Movies</h1>
          <form className="browse__search" onSubmit={handleSearch}>
            <span className="search-icon">⌕</span>
            <input
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search by title, actor, genre..."
            />
            {query && <button type="button" className="browse__clear" onClick={clearSearch}>✕</button>}
          </form>
        </div>

        {!query && (
          <div className="browse__tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`browse__tab${activeTab === t.key ? " active" : ""}`}
                onClick={() => { setActiveTab(t.key); setSearchParams({ tab: t.key }); }}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {query && (
          <div className="browse__search-label">
            Results for "<strong>{query}</strong>"
            <button className="browse__clear-link" onClick={clearSearch}>Clear</button>
          </div>
        )}

        {isLoading ? (
          <div className="spinner" />
        ) : displayMovies.length === 0 ? (
          <div className="browse__empty">
            <div className="browse__empty-icon">🎬</div>
            <p>No movies found{query ? ` for "${query}"` : ""}.</p>
          </div>
        ) : (
          <div className="browse__grid">
            {displayMovies.map((m) => <MovieCard key={m.id} movie={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}