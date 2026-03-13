import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 MovieApp. Built with React & TMDB API.</p>
        <p>Data from <a href="https://www.themoviedb.org/">The Movie Database (TMDB)</a></p>
      </div>
    </footer>
  );
};

export default Footer;
