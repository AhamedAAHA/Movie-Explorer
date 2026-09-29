// Rotating hero built from the trending list. Backdrop image,
// gradient scrim so text stays readable in both modes.
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Chip, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import { Link } from 'react-router-dom';

function backdrop(movie) {
  const p = movie?.backdrop_path || movie?.poster_path;
  if (!p) return '';
  return p.startsWith('http') ? p : `https://image.tmdb.org/t/p/original${p}`;
}

export default function Hero({ movies, loading, onTrailer }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!movies?.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % Math.min(movies.length, 6)), 7000);
    return () => clearInterval(t);
  }, [movies]);

  if (loading) return <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3 }} />;
  if (!movies?.length) return null;
  const m = movies[idx % movies.length];

  return (
    <Box sx={{ position: 'relative', height: { xs: 340, md: 420 }, borderRadius: 3, overflow: 'hidden', mb: 4 }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={m.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${backdrop(m)})`,
            backgroundSize: 'cover', backgroundPosition: 'center 20%',
          }}
        />
      </AnimatePresence>
      {/* scrim tuned per mode via theme-aware gradient */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: (t) => t.palette.mode === 'dark'
          ? 'linear-gradient(90deg, rgba(5,6,10,0.92) 20%, rgba(5,6,10,0.55) 55%, rgba(5,6,10,0.15))'
          : 'linear-gradient(90deg, rgba(20,14,8,0.88) 20%, rgba(20,14,8,0.5) 55%, rgba(20,14,8,0.12))',
      }} />
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: { xs: 2.5, md: 4 }, maxWidth: 640 }}>
        <Box display="flex" gap={1} mb={1}>
          <Chip label="#1 Trending" color="primary" size="small" />
          <Chip label={(m.release_date || '').slice(0, 4)} size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} variant="outlined" />
          <Box display="flex" alignItems="center" gap={0.5} color="#fff">
            <StarIcon fontSize="small" color="warning" />
            <Typography variant="body2">{Number(m.vote_average || 0).toFixed(1)}</Typography>
          </Box>
        </Box>
        <Typography variant="h4" color="#fff" gutterBottom>{m.title}</Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {m.overview}
        </Typography>
        <Box display="flex" gap={1.5} mt={2}>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => onTrailer?.(m)}>Trailer</Button>
          <Button variant="outlined" startIcon={<InfoIcon />} component={Link} to={`/movie/${m.id}`} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}>
            More Info
          </Button>
        </Box>
        {/* dots */}
        <Box display="flex" gap={1} mt={2}>
          {movies.slice(0, 6).map((x, i) => (
            <Box key={x.id} onClick={() => setIdx(i)} sx={{
              width: i === idx % 6 ? 24 : 8, height: 8, borderRadius: 4, cursor: 'pointer',
              bgcolor: i === idx % 6 ? 'primary.main' : 'rgba(255,255,255,0.4)',
              transition: 'all .3s',
            }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
