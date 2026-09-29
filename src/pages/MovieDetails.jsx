// Details with a backdrop banner up top instead of a plain grid.
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Box, Chip, Button, Alert, Skeleton, Grid, Card, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StarIcon from '@mui/icons-material/Star';
import TrailerModal from '../components/TrailerModal';
import { fetchMovieDetails, pickTrailerKey, friendlyError } from '../api/tmdb';

function img(path, size = 'w500') {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Poster';
  return path.startsWith('http') ? path : `https://image.tmdb.org/t/p/${size}${path}`;
}

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie).catch((e) => setError(friendlyError(e)));
  }, [id]);

  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Skeleton variant="rounded" height={300} sx={{ borderRadius: 3 }} />
        <Skeleton width="40%" height={48} sx={{ mt: 2 }} />
        <Skeleton width="90%" /><Skeleton width="80%" />
      </Container>
    );
  }

  const trailerKey = pickTrailerKey(movie);
  const cast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <Box>
      {/* banner */}
      <Box sx={{
        height: { xs: 220, md: 340 }, backgroundImage: `url(${img(movie.backdrop_path, 'original')})`,
        backgroundSize: 'cover', backgroundPosition: 'center 25%', position: 'relative',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, background: (t) => `linear-gradient(180deg, transparent 30%, ${t.palette.background.default} 98%)` }} />
      </Box>
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', pb: 5 }}>
        <Button component={Link} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="contained">Back</Button>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4, md: 3 }}>
              <Card sx={{ boxShadow: 6 }}><CardMedia component="img" image={img(movie.poster_path)} alt={movie.title} /></Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 8, md: 9 }}>
              <Typography variant="h4">{movie.title}</Typography>
              {movie.tagline && <Typography color="text.secondary" fontStyle="italic">“{movie.tagline}”</Typography>}
              <Box display="flex" alignItems="center" gap={1} my={1} flexWrap="wrap">
                <StarIcon color="warning" /><Typography fontWeight={600}>{Number(movie.vote_average || 0).toFixed(1)} / 10</Typography>
                <Typography color="text.secondary">• {(movie.release_date || '').slice(0, 4)} {movie.runtime ? `• ${movie.runtime} min` : ''}</Typography>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap" my={1}>
                {(movie.genres || []).map((g) => <Chip key={g.id} label={g.name} color="primary" variant="outlined" />)}
              </Box>
              <Typography variant="h6" mt={2}>Overview</Typography>
              <Typography color="text.secondary">{movie.overview || 'No overview available.'}</Typography>
              {cast.length > 0 && (
                <>
                  <Typography variant="h6" mt={2}>Top cast</Typography>
                  <Typography color="text.secondary">{cast.map((c) => `${c.name} (${c.character})`).join(' • ')}</Typography>
                </>
              )}
              <Box display="flex" gap={2} mt={3} flexWrap="wrap">
                <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={() => setTrailerOpen(true)} disabled={!trailerKey}>
                  Watch trailer
                </Button>
                {trailerKey && (
                  <Button variant="outlined" size="large" href={`https://www.youtube.com/watch?v=${trailerKey}`} target="_blank" rel="noreferrer">
                    Open on YouTube
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </motion.div>
        <TrailerModal open={trailerOpen} onClose={() => setTrailerOpen(false)} youtubeKey={trailerKey} title={movie.title} />
      </Container>
    </Box>
  );
}
