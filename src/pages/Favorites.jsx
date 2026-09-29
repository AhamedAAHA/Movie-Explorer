// Favorites list (persisted in localStorage via MovieContext).
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';

export default function Favorites() {
  const { favorites } = useMovies();
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>❤️ My Favorites ({favorites.length})</Typography>
      {favorites.length === 0 ? (
        <>
          <Typography color="text.secondary">No favorites yet. Tap the heart on any movie.</Typography>
          <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>Browse Movies</Button>
        </>
      ) : <MovieGrid movies={favorites} />}
    </Container>
  );
}
