// Global movie state via Context API: search, filters, favorites, last search.
// Favorites + last search persist in localStorage (PDF requirement).
import React, { createContext, useContext, useEffect, useState } from 'react';

const FAV_KEY = 'me_favorites';
const LAST_KEY = 'me_last_search';
const MovieContext = createContext(null);
export const useMovies = () => useContext(MovieContext);

export function MovieProvider({ children }) {
  const [query, setQuery] = useState(() => localStorage.getItem(LAST_KEY) || '');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch { return []; }
  });
  const [filters, setFilters] = useState({ genre: '', year: '', rating: 0 });

  useEffect(() => { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); }, [favorites]);

  const persistQuery = (q) => { setQuery(q); localStorage.setItem(LAST_KEY, q); };
  const toggleFavorite = (movie) =>
    setFavorites((f) => (f.some((m) => m.id === movie.id) ? f.filter((m) => m.id !== movie.id) : [...f, movie]));
  const isFavorite = (id) => favorites.some((m) => m.id === id);

  return (
    <MovieContext.Provider value={{ query, setQuery: persistQuery, filters, setFilters, favorites, toggleFavorite, isFavorite }}>
      {children}
    </MovieContext.Provider>
  );
}
