import React, { useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import MovieCard from '../components/MovieCard';
import { useMovies } from '../context/MovieContext';
import '../pages/Home.css';

const Home = () => {
  const { dispatch } = useMovies();
  const { data: trending, loading: trendingLoading } = useFetch('/api/movies/trending', 'SET_TRENDING');
  const { data: nowPlaying, loading: nowPlayingLoading } = useFetch('/api/movies/now-playing', 'SET_NOW_PLAYING');

  return (
    <div className="home">
      <div className="section">
        <h2>Trending Movies</h2>
        {trendingLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="movies-grid">
            {trending.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      <div className="section">
        <h2>Now Playing</h2>
        {nowPlayingLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="movies-grid">
            {nowPlaying.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
