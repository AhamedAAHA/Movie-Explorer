// Grid with a soft stagger so posters cascade in on each load.
import React from 'react';
import { Grid, Skeleton, Box } from '@mui/material';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

export function GridSkeleton({ count = 12 }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} item xs={6} sm={4} md={3} lg={2}>
          <Skeleton variant="rounded" sx={{ aspectRatio: '2/3', borderRadius: 2 }} />
          <Skeleton width="70%" sx={{ mt: 1 }} />
        </Grid>
      ))}
    </Grid>
  );
}

export default function MovieGrid({ movies }) {
  return (
    <Grid container spacing={2}>
      {movies.map((m, i) => (
        <Grid key={m.id} item xs={6} sm={4} md={3} lg={2}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.04, 0.5), duration: 0.35 }}>
            <Box height="100%"><MovieCard movie={m} /></Box>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}
