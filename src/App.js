// App shell: cinematic theme (dark + light), auth + movie state,
// React Router, and the CineMate chat bubble on every page.
import React, { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ChatWidget from './components/Chatbot/ChatWidget';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import { cinematicTheme } from './theme';

export default function App() {
  const [mode, setMode] = useState(() =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const theme = useMemo(() => cinematicTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MovieProvider>
          <BrowserRouter>
            <Navbar mode={mode} onToggleMode={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ChatWidget />
          </BrowserRouter>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
