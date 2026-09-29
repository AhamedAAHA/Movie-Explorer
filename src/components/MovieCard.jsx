// Poster card: slow zoom on the artwork, shine sweep, glow lift.
// Compact version is just poster + rating pill for the rails.
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
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      style={{ height: '100%' }}
    >
      <Card sx={{
        height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
        transition: 'box-shadow .35s',
        '&:hover': { boxShadow: (t) => t.palette.mode === 'dark' ? '0 18px 50px rgba(232,179,75,0.28)' : '0 18px 44px rgba(179,38,30,0.25)' },
      }}>
        <motion.span whileTap={{ scale: 1.35 }} style={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}>
          <IconButton aria-label="favorite" size="small" onClick={() => toggleFavorite(movie)}
            sx={{ bgcolor: 'rgba(0,0,0,0.55)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}>
            {fav ? <FavoriteIcon fontSize="small" color="error" /> : <FavoriteBorderIcon fontSize="small" sx={{ color: 'white' }} />}
          </IconButton>
        </motion.span>
        <Box className="shine" sx={{ overflow: 'hidden', position: 'relative' }}>
          <CardMedia component={Link} to={`/movie/${movie.id}`} image={posterOf(movie)} alt={movie.title}
            sx={{ aspectRatio: '2/3', transition: 'transform .6s cubic-bezier(.22,1,.36,1)', '&:hover': { transform: 'scale(1.08)' } }} />
          {/* rating pill floating on the artwork */}
          <Box sx={{
            position: 'absolute', left: 8, bottom: 8, display: 'flex', alignItems: 'center', gap: 0.4,
            bgcolor: 'rgba(0,0,0,0.65)', color: '#ffd76a', borderRadius: 2, px: 1, py: 0.4, backdropFilter: 'blur(4px)',
          }}>
            <StarIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={700}>{Number(movie.vote_average || 0).toFixed(1)}</Typography>
          </Box>
        </Box>
        {compact ? (
          <Box px={1} py={0.75}>
            <Typography variant="caption" noWrap fontWeight={600}>{movie.title}</Typography>
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
