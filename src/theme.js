// Cinematic theme for both modes. Dark = theater at night,
// light = warm matinee. Same shapes and type scale either way.
import { createTheme } from '@mui/material';

export function cinematicTheme(mode) {
  const dark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#e8b34b' : '#b3261e' },
      secondary: { main: dark ? '#7c5cff' : '#4a3aff' },
      background: {
        default: dark ? '#0b0d13' : '#faf6ef',
        paper: dark ? '#141824' : '#ffffff',
      },
      text: {
        primary: dark ? '#f5f1e8' : '#1c1a15',
        secondary: dark ? '#a7adbf' : '#6b6455',
      },
    },
    typography: {
      fontFamily: "'Inter', system-ui, sans-serif",
      h4: { fontFamily: "'Sora', 'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontFamily: "'Sora', 'Inter', sans-serif", fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontFamily: "'Sora', 'Inter', sans-serif", fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            boxShadow: dark
              ? '0 6px 24px rgba(232,179,75,0.35)'
              : '0 6px 20px rgba(179,38,30,0.25)',
          },
        },
      },
    },
  });
}
