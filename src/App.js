// App shell: cinematic theme, auth + movie state, router with a
// soft crossfade between pages, glow backdrop, footer, chat bubble.
import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ChatWidget from './components/Chatbot/ChatWidget';
import AmbientGlow from './components/AmbientGlow';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import { cinematicTheme } from './theme';

// crossfade wrapper so page switches feel like cuts, not jumps
function FadingRoutes() {
  const loc = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={loc.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
        <Routes location={loc}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [mode, setMode] = useState(() =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const theme = useMemo(() => cinematicTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AmbientGlow />
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar mode={mode} onToggleMode={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))} />
              <Box sx={{ flexGrow: 1 }}>
                <FadingRoutes />
              </Box>
              <Footer />
            </Box>
            <ChatWidget />
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
