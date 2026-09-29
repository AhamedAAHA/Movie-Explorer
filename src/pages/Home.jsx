// Home: hero + trending rail + discover grid. Infinite scroll
// stays, Load More button stays as backup, skeletons while fetching.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Alert, Button, Box, Divider } from '@mui/material';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid, { GridSkeleton } from '../components/MovieGrid';
import Hero from '../components/Hero';
import TrendingRow, { SectionTitle } from '../components/TrendingRow';
import TrailerModal from '../components/TrailerModal';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { fetchTrending, discoverMovies, fetchMovieDetails, pickTrailerKey, friendlyError, hasApiKey } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

export default function Home() {
  const { query, filters } = useMovies();
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroMovie, setHeroMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const debounce = useRef();

  const load = useCallback(async (p, append) => {
    setLoading(true); setError('');
    try {
      const data = await discoverMovies({ ...filters, page: p, query: query.trim() });
      setMovies((m) => (append ? [...m, ...data.results] : data.results));
      setTotalPages(data.total_pages || 1);
      setPage(p);
    } catch (e) { setError(friendlyError(e)); }
    finally { setLoading(false); }
  }, [query, filters]);

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(1, false), 400);
    return () => clearTimeout(debounce.current);
  }, [query, filters, load]);

  useEffect(() => {
    fetchTrending(1)
      .then((d) => setTrending(d.results.slice(0, 12)))
      .catch(() => {})
      .finally(() => setTrendLoading(false));
  }, []);

  const openTrailer = async (m) => {
    setHeroMovie(m); setTrailerOpen(true); setTrailerKey(null);
    try {
      const full = await fetchMovieDetails(m.id);
      setTrailerKey(pickTrailerKey(full));
    } catch { /* modal shows the empty state */ }
  };

  const hasMore = page < totalPages;
  const sentinel = useInfiniteScroll(() => load(page + 1, true), hasMore, loading);
  const searching = query.trim().length > 0;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {!hasApiKey && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Demo mode: no TMDb key found. Add <code>REACT_APP_TMDB_API_KEY</code> to <code>.env</code> for live data.
        </Alert>
      )}
      {!searching && <Hero movies={trending} loading={trendLoading} onTrailer={openTrailer} />}

      <SectionTitle kicker="Updated weekly" title={searching ? `Results for "${query}"` : 'Trending this week'} />
      {searching ? (
        <TrendingRow movies={movies.slice(0, 12)} loading={loading && movies.length === 0} />
      ) : (
        <TrendingRow movies={trending} loading={trendLoading} />
      )}

      <Divider sx={{ my: 3 }} />
      <SectionTitle kicker="Browse" title={searching ? 'All matches' : 'Discover movies'} />
      <SearchBar />
      <FilterBar />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Box mt={2}>
        {loading && movies.length === 0 ? <GridSkeleton /> : <MovieGrid movies={movies} />}
      </Box>
      {!loading && movies.length === 0 && !error && (
        <Box color="text.secondary" mt={2}>Nothing here yet. Try another search or clear the filters.</Box>
      )}
      {hasMore && !loading && (
        <Box display="flex" justifyContent="center" my={3}>
          <Button variant="contained" size="large" onClick={() => load(page + 1, true)}>Load more</Button>
        </Box>
      )}
      <div ref={sentinel} />
      <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} youtubeKey={trailerKey} title={heroMovie?.title || ''} />
    </Container>
  );
}
