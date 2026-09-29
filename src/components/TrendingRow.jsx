// Side-scrolling trending rail with arrow buttons. Feels like
// a streaming app, works fine on phones (native swipe + snap).
import React, { useRef } from 'react';
import { Box, Typography, IconButton, Skeleton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

export function SectionTitle({ kicker, title }) {
  return (
    <Box mb={1.5}>
      <Typography variant="overline" color="primary" fontWeight={700}>{kicker}</Typography>
      <Typography variant="h5">{title}</Typography>
    </Box>
  );
}

export default function TrendingRow({ movies, loading }) {
  const rail = useRef(null);
  const nudge = (dir) => rail.current?.scrollBy({ left: dir * 480, behavior: 'smooth' });

  if (loading) {
    return (
      <Box display="flex" gap={2} sx={{ overflow: 'hidden' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={170} height={290} sx={{ borderRadius: 2, flexShrink: 0 }} />
        ))}
      </Box>
    );
  }
  if (!movies?.length) return null;

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton onClick={() => nudge(-1)} sx={arrowSx('left')} aria-label="scroll left"><ChevronLeftIcon /></IconButton>
      <Box ref={rail} display="flex" gap={2} sx={{ overflowX: 'auto', scrollSnapType: 'x mandatory', pb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        {movies.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4) }}
            style={{ flex: '0 0 auto', width: 170, scrollSnapAlign: 'start' }}>
            <MovieCard movie={m} compact />
          </motion.div>
        ))}
      </Box>
      <IconButton onClick={() => nudge(1)} sx={arrowSx('right')} aria-label="scroll right"><ChevronRightIcon /></IconButton>
    </Box>
  );
}

const arrowSx = (side) => ({
  position: 'absolute', top: '38%', zIndex: 2,
  [side]: -8,
  bgcolor: 'background.paper', boxShadow: 3,
  display: { xs: 'none', md: 'inline-flex' },
  '&:hover': { bgcolor: 'background.paper' },
});
