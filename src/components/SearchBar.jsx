// Reusable search input (controlled by MovieContext).
import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMovies } from '../context/MovieContext';

export default function SearchBar({ autoFocus = false }) {
  const { query, setQuery } = useMovies();
  return (
    <TextField
      fullWidth
      autoFocus={autoFocus}
      placeholder="Search movies… (e.g. Dune)"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
    />
  );
}
