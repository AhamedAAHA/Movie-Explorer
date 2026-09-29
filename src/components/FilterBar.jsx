// Bonus filters: genre, year, minimum rating.
import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { fetchGenres } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

export default function FilterBar() {
  const { filters, setFilters } = useMovies();
  const [genres, setGenres] = useState([]);
  useEffect(() => { fetchGenres().then(setGenres).catch(() => {}); }, []);

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel>Genre</InputLabel>
        <Select value={filters.genre} label="Genre" onChange={(e) => setFilters({ ...filters, genre: e.target.value })}>
          <MenuItem value="">All</MenuItem>
          {genres.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField size="small" label="Year" placeholder="2024" value={filters.year}
        onChange={(e) => setFilters({ ...filters, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
        sx={{ width: 110 }} />
      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Min rating</InputLabel>
        <Select value={filters.rating} label="Min rating" onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
          <MenuItem value={0}>Any</MenuItem>
          <MenuItem value={6}>6+</MenuItem>
          <MenuItem value={7}>7+</MenuItem>
          <MenuItem value={8}>8+</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
