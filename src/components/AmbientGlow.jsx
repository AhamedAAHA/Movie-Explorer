// Soft color blobs floating behind the whole app. Different
// tints for dark vs light so both modes feel graded, not flat.
import React from 'react';
import { Box, useTheme } from '@mui/material';

export default function AmbientGlow() {
  const t = useTheme();
  const dark = t.palette.mode === 'dark';
  return (
    <Box aria-hidden sx={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Box className="ambient-blob" sx={{
        position: 'absolute', width: 560, height: 560, borderRadius: '50%',
        top: -180, left: -140, filter: 'blur(130px)', opacity: dark ? 0.22 : 0.35,
        background: dark ? '#7c5cff' : '#f3c96b',
      }} />
      <Box className="ambient-blob slow" sx={{
        position: 'absolute', width: 480, height: 480, borderRadius: '50%',
        bottom: -160, right: -120, filter: 'blur(130px)', opacity: dark ? 0.16 : 0.3,
        background: dark ? '#e8b34b' : '#e2795b',
      }} />
    </Box>
  );
}
