import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MovieContext = createContext();

const initialState = {
  trending: [],
  nowPlaying: [],
  searchResults: [],
  genres: [],
  selectedMovie: null,
  watchlist: JSON.parse(localStorage.getItem('watchlist')) || [],
  loading: false,
  searchQuery: '',
};

const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRENDING':
      return { ...state, trending: action.payload };
    case 'SET_NOW_PLAYING':
      return { ...state, nowPlaying: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_GENRES':
      return { ...state, genres: action.payload };
    case 'SET_SELECTED_MOVIE':
      return { ...state, selectedMovie: action.payload };
    case 'ADD_TO_WATCHLIST':
      const newWatchlist = [...state.watchlist, action.payload];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      return { ...state, watchlist: newWatchlist };
    case 'REMOVE_FROM_WATCHLIST':
      const updatedWatchlist = state.watchlist.filter(movie => movie.id !== action.payload.id);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      return { ...state, watchlist: updatedWatchlist };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  useEffect(() => {
    // Load genres on mount
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => dispatch({ type: 'SET_GENRES', payload: data.genres }))
      .catch(err => console.error(err));
  }, []);

  return (
    <MovieContext.Provider value={{ state, dispatch }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within MovieProvider');
  }
  return context;
};
