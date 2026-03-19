import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: trendingData } = useFetch("/api/trending", { page });
  const { data: popularData } = useFetch("/api/popular", { page });
  const { data: topRatedData } = useFetch("/api/top-rated", { page });
  const { data: nowPlayingData } = useFetch("/api/now-playing", { page });
  const { data: genresData } = useFetch("/api/genres");
  const { data: searchData } = useFetch(query ? `/api/search?q=${encodeURIComponent(query)}` : null, { page });


  useEffect(() => {
    if (genresData) setGenres(genresData);
  }, [genresData]);

  useEffect(() => {
    const dataMap = {
      trending: trendingData,
      popular: popularData,
      'top-rated': topRatedData,
      'now-playing': nowPlayingData,
    };
    const data = dataMap[activeTab];
    if (data) {
      setMovies(data.results || []);
      setTotalPages(data.total_pages || 0);
      setPage(1);
    }
  }, [activeTab, trendingData, popularData, topRatedData, nowPlayingData]);

  useEffect(() => {
    if (searchData) {
      setMovies(prev => page === 1 ? searchData.results || [] : [...prev, ...(searchData.results || [])]);
      setTotalPages(searchData.total_pages || 0);
    }
  }, [searchData, page, query]);

  const filteredMovies = selectedGenre 
    ? movies.filter(m => m.genre_ids?.includes(selectedGenre))
    : movies;

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputVal);
    setPage(1);
    if (inputVal) setSearchParams({ q: inputVal, page: '1' });
    else setSearchParams({ tab: activeTab, page: '1' });
  };

  const clearSearch = () => {
    setQuery("");
    setInputVal("");
    setMovies([]);
    setPage(1);
    setSelectedGenre(null);
    setSearchParams({ tab: activeTab, page: '1' });
  };

  const displayMovies = filteredMovies;
  const uiLoading = loadingMore || (!movies.length && page === 1);

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

{genres.length > 0 && !query && (
          <div className="browse__genres">
            <button 
              className={`browse__genre${!selectedGenre ? ' active' : ''}`}
              onClick={() => setSelectedGenre(null)}
            >
              All Genres
            </button>
            {genres.slice(0, 10).map((g) => (
              <button 
                key={g.id}
                className={`browse__genre${selectedGenre === g.id ? ' active' : ''}`}
                onClick={() => setSelectedGenre(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
        {!query && (
          <div className="browse__tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`browse__tab${activeTab === t.key ? " active" : ""}`}
                onClick={() => { setActiveTab(t.key); setSearchParams({ tab: t.key, page: '1' }); setSelectedGenre(null); }}
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

        {uiLoading ? (
          <div className="spinner" />
        ) : displayMovies.length === 0 ? (
          <div className="browse__empty">
            <div className="browse__empty-icon">🎬</div>
            <p>No movies found{query ? ` for "${query}"` : ` in ${activeTab.replace('-', ' ')}`}${selectedGenre ? ` in ${genres.find(g => g.id === selectedGenre)?.name || ''}` : ''}.</p>
          </div>
        ) : (
          <>
            <div className="browse__grid">
              {displayMovies.map((m) => <MovieCard key={m.id} movie={m} />)}
            </div>
            {totalPages > 1 && page < totalPages && (
              <button 
                className="btn-primary browse__load-more"
                onClick={() => { setLoadingMore(true); setPage(p => p + 1); }}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : `Load More (Page ${page + 1})`}
              </button>
            )}
            {page > 1 && (
              <p className="browse__page-info">Showing page {page} of {totalPages}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}