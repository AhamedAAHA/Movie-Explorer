// Poster card with a slow zoom + lift on hover. Compact mode
// drops the text block for rails (just poster + rating pill).
import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { IMAGE_BASE } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

function posterOf(movie) {
  if (!movie.poster_path) return 'https://via.placeholder.com/500x750?text=No+Poster';
  return movie.poster_path.startsWith('http') ? movie.poster_path : `${IMAGE_BASE}${movie.poster_path}`;
}

export default function MovieCard({ movie, compact = false }) {
  const { toggleFavorite, isFavorite } = useMovies();
  const year = (movie.release_date || '').slice(0, 4) || '—';
  const fav = isFavorite(movie.id);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 350, damping: 22 }} style={{ height: '100%' }}>
      <Card sx={{
        height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
        transition: 'box-shadow .3s',
        '&:hover': { boxShadow: (t) => t.palette.mode === 'dark' ? '0 14px 40px rgba(232,179,75,0.25)' : '0 14px 36px rgba(179,38,30,0.22)' },
      }}>
        <IconButton aria-label="favorite" onClick={() => toggleFavorite(movie)}
          sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2, bgcolor: 'rgba(0,0,0,0.55)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}>
          {fav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
        </IconButton>
        <Box sx={{ overflow: 'hidden' }}>
          <CardMedia component={Link} to={`/movie/${movie.id}`} image={posterOf(movie)} alt={movie.title}
            sx={{ aspectRatio: '2/3', transition: 'transform .5s ease', '&:hover': { transform: 'scale(1.06)' } }} />
        </Box>
        {compact ? (
          <Box px={1} py={0.75} display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="caption" noWrap fontWeight={600} sx={{ maxWidth: '65%' }}>{movie.title}</Typography>
            <Box display="flex" alignItems="center" gap={0.4}>
              <StarIcon fontSize="inherit" color="warning" />
              <Typography variant="caption">{Number(movie.vote_average || 0).toFixed(1)}</Typography>
            </Box>
          </Box>
        ) : (
          <CardContent sx={{ flexGrow: 1, py: 1.5 }}>
            <Typography variant="subtitle2" component={Link} to={`/movie/${movie.id}`}
              sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {movie.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.75}>
              <Chip label={year} size="small" variant="outlined" />
              <Box display="flex" alignItems="center" gap={0.4}>
                <StarIcon fontSize="small" color="warning" />
                <Typography variant="body2">{Number(movie.vote_average || 0).toFixed(1)}</Typography>
              </Box>
            </Box>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}
