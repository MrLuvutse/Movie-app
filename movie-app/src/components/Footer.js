import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">CINE<span>VAULT</span></div>
          <p className="footer-tagline">The cinematic universe at your fingertips.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Discover</Link>
          <Link to="/browse">Browse</Link>
          <Link to="/watchlist">Watchlist</Link>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} CineVault · Powered by TMDB
        </div>
      </div>
    </footer>
  );
}