// TMDb API client using axios.
// Falls back to local mock data when REACT_APP_TMDB_API_KEY is missing,
// so the app is fully demoable without a key (per deliverable requirements).
import axios from 'axios';
import { mockMovies, mockGenres, mockDetails } from './mockData';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const hasApiKey = Boolean(API_KEY);

const client = axios.create({ baseURL: BASE_URL, timeout: 12000 });

// Attach key + default params to every request.
client.interceptors.request.use((config) => {
  config.params = { api_key: API_KEY, language: 'en-US', ...(config.params || {}) };
  return config;
});

/** Friendly error messages for the UI (requirement: handle API errors gracefully). */
export function friendlyError(err) {
  if (!err.response) return 'Network error. Check your connection and try again.';
  const s = err.response.status;
  if (s === 401) return 'Invalid TMDb API key. Check REACT_APP_TMDB_API_KEY in .env.';
  if (s === 404) return 'Not found on TMDb.';
  if (s === 429) return 'Rate limited by TMDb. Wait a moment and retry.';
  return `TMDb error (${s}). Please try again.`;
}

const paged = (results, page = 1, total = 1) => ({ results, page, total_pages: total, total_results: results.length });

// --- Endpoints (mock fallback keeps UI testable without a key) ---

export async function fetchTrending(page = 1) {
  if (!hasApiKey) return paged(mockMovies, page, 3);
  const { data } = await client.get('/trending/movie/week', { params: { page } });
  return data;
}

export async function searchMovies(query, page = 1) {
  if (!hasApiKey) {
    const q = query.toLowerCase();
    return paged(mockMovies.filter((m) => m.title.toLowerCase().includes(q)), page, 1);
  }
  const { data } = await client.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
}

export async function fetchMovieDetails(id) {
  if (!hasApiKey) return mockDetails(id);
  const { data } = await client.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } });
  return data;
}

export async function fetchGenres() {
  if (!hasApiKey) return mockGenres;
  const { data } = await client.get('/genre/movie/list');
  return data.genres;
}

// Discover powers genre/year/rating filters (bonus requirement).
export async function discoverMovies({ genre = '', year = '', rating = 0, page = 1, query = '' }) {
  if (query) return searchMovies(query, page);
  if (!hasApiKey) {
    let list = [...mockMovies];
    if (genre) list = list.filter((m) => m.genre_ids.includes(Number(genre)));
    if (rating) list = list.filter((m) => m.vote_average >= rating);
    if (year) list = list.filter((m) => (m.release_date || '').startsWith(year));
    return paged(list, page, 1);
  }
  const { data } = await client.get('/discover/movie', {
    params: {
      page, sort_by: 'popularity.desc', include_adult: false,
      ...(genre ? { with_genres: genre } : {}),
      ...(year ? { primary_release_year: year } : {}),
      ...(rating ? { 'vote_average.gte': rating } : {}),
    },
  });
  return data;
}

/** Pick a YouTube trailer key from TMDb videos (no separate YouTube API key needed). */
export function pickTrailerKey(details) {
  const vids = details?.videos?.results || [];
  const t = vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer') || vids.find((v) => v.site === 'YouTube');
  return t ? t.key : null;
}
