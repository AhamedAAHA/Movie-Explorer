// Tiny footer, mostly for the TMDb credit they ask for in the terms.
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', py: 3, mt: 4, opacity: 0.7 }}>
      <Typography variant="caption" color="text.secondary">
        Movie Explorer • Data &amp; artwork by TMDb (themoviedb.org) — this product uses the TMDb API but is not endorsed by TMDb.
      </Typography>
    </Box>
  );
}
