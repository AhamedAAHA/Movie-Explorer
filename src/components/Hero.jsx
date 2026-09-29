// Full-bleed hero: backdrop slowly pushes in (ken burns), text slides
// up staggered, auto-rotates with a slide transition between features.
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

const textUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Hero({ movies, loading, onTrailer }) {
  const [idx, setIdx] = useState(0);
  const list = (movies || []).slice(0, 6);

  useEffect(() => {
    if (!list.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 7000);
    return () => clearInterval(t);
  }, [list.length]);

  if (loading) return <Skeleton variant="rounded" height={440} sx={{ borderRadius: 4 }} />;
  if (!list.length) return null;
  const m = list[idx % list.length];

  return (
    <Box sx={{ position: 'relative', height: { xs: 400, md: 480 }, borderRadius: 4, overflow: 'hidden', mb: 4, boxShadow: 8 }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={m.id}
          className="kenburns"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${backdrop(m)})`,
            backgroundSize: 'cover', backgroundPosition: 'center 20%',
          }}
        />
      </AnimatePresence>
      {/* bottom-heavy grade so posters and text both pop */}
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(4,5,9,0.25) 0%, rgba(4,5,9,0.05) 35%, rgba(4,5,9,0.88) 100%), linear-gradient(90deg, rgba(4,5,9,0.75) 0%, transparent 60%)',
      }} />
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: { xs: 3, md: 5 }, maxWidth: 680 }}>
        <motion.div variants={textUp} initial="hidden" animate="show" custom={0}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
            <Chip label="#1 Trending now" color="primary" size="small" sx={{ fontWeight: 700 }} />
            <Chip label={(m.release_date || '').slice(0, 4)} size="small" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }} variant="outlined" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#fff' }}>
              <StarIcon fontSize="small" color="warning" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{Number(m.vote_average || 0).toFixed(1)}</Typography>
            </Box>
          </Box>
        </motion.div>
        <motion.div key={`t-${m.id}`} variants={textUp} initial="hidden" animate="show" custom={1}>
          <Typography variant="h3" color="#fff" gutterBottom sx={{ fontSize: { xs: '1.9rem', md: '3rem' } }}>{m.title}</Typography>
        </motion.div>
        <motion.div variants={textUp} initial="hidden" animate="show" custom={2}>
          <Typography variant="body1" color="rgba(255,255,255,0.82)" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {m.overview}
          </Typography>
        </motion.div>
        <motion.div variants={textUp} initial="hidden" animate="show" custom={3}>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2.5 }}>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={() => onTrailer?.(m)}>Trailer</Button>
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button variant="outlined" size="large" startIcon={<InfoIcon />} component={Link} to={`/movie/${m.id}`} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(6px)' }}>
                More info
              </Button>
            </motion.span>
          </Box>
        </motion.div>
        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
          {list.map((x, i) => (
            <Box key={x.id} onClick={() => setIdx(i)} sx={{
              width: i === idx % list.length ? 28 : 8, height: 8, borderRadius: 4, cursor: 'pointer',
              bgcolor: i === idx % list.length ? 'primary.main' : 'rgba(255,255,255,0.4)',
              transition: 'all .35s',
            }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
