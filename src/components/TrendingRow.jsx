// Side-scrolling rail with faded edges and arrows that only
// show on hover. Section titles get a gold accent bar.
import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, Skeleton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

export function SectionTitle({ kicker, title }) {
  return (
    <Box mb={1.5} display="flex" alignItems="center" gap={1.25}>
      <motion.span
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ width: 5, height: 30, borderRadius: 3, background: 'linear-gradient(180deg,#e8b34b,#b3261e)', display: 'inline-block' }}
      />
      <Box>
        <Typography variant="overline" color="primary" fontWeight={700} lineHeight={1}>{kicker}</Typography>
        <Typography variant="h5" lineHeight={1.2}>{title}</Typography>
      </Box>
    </Box>
  );
}

export default function TrendingRow({ movies, loading }) {
  const rail = useRef(null);
  const [hover, setHover] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const track = () => {
    const el = rail.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };

  useEffect(() => { track(); }, [movies]);

  const nudge = (dir) => {
    rail.current?.scrollBy({ left: dir * 520, behavior: 'smooth' });
    setTimeout(track, 450);
  };

  if (loading) {
    return (
      <Box display="flex" gap={2} sx={{ overflow: 'hidden' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={170} height={290} sx={{ borderRadius: 3, flexShrink: 0 }} />
        ))}
      </Box>
    );
  }
  if (!movies?.length) return null;

  return (
    <Box sx={{ position: 'relative' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Box
        ref={rail}
        onScroll={track}
        display="flex" gap={2}
        sx={{
          overflowX: 'auto', scrollSnapType: 'x mandatory', py: 1, px: 0.5,
          scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
          // faded edges so the rail feels endless
          maskImage: (atStart && atEnd) ? 'none'
            : atStart ? 'linear-gradient(90deg,#000 92%,transparent)'
            : atEnd ? 'linear-gradient(90deg,transparent,#000 8%)'
            : 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
        }}
      >
        {movies.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: Math.min(i * 0.06, 0.45), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: '0 0 auto', width: 172, scrollSnapAlign: 'start' }}
          >
            <MovieCard movie={m} compact />
          </motion.div>
        ))}
      </Box>
      {[['left', <ChevronLeftIcon key="l" />, -1, atStart], ['right', <ChevronRightIcon key="r" />, 1, atEnd]].map(([side, icon, dir, hide]) => (
        <motion.span key={side} animate={{ opacity: hover && !hide ? 1 : 0 }} style={{ position: 'absolute', top: '36%', zIndex: 2, [side]: -6, pointerEvents: hover && !hide ? 'auto' : 'none' }}>
          <IconButton onClick={() => nudge(dir)} sx={{ bgcolor: 'background.paper', boxShadow: 4, '&:hover': { bgcolor: 'background.paper' } }} aria-label={`scroll ${side}`}>
            {icon}
          </IconButton>
        </motion.span>
      ))}
    </Box>
  );
}
