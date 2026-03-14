import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const { watchlist } = useMovies();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/browse?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          CINE<span>VAULT</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link${isActive("/") ? " active" : ""}`}>Discover</Link>
          <Link to="/browse" className={`nav-link${isActive("/browse") ? " active" : ""}`}>Browse</Link>
          <Link to="/watchlist" className={`nav-link${isActive("/watchlist") ? " active" : ""}`}>
            Watchlist
            {watchlist.length > 0 && <span className="nav-badge">{watchlist.length}</span>}
          </Link>
        </div>
        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="search-icon">⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
          />
        </form>
        <div className="navbar-avatar">JS</div>
      </div>
    </nav>
  );
}