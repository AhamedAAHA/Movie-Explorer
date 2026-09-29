// Frosted-glass navbar that turns solid after scrolling.
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MovieIcon from '@mui/icons-material/Movie';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ mode, onToggleMode }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <AppBar position="sticky" elevation={0} sx={{
      backdropFilter: 'blur(14px)',
      backgroundColor: (t) => scrolled
        ? (t.palette.mode === 'dark' ? 'rgba(11,13,19,0.92)' : 'rgba(250,246,239,0.92)')
        : (t.palette.mode === 'dark' ? 'rgba(11,13,19,0.6)' : 'rgba(250,246,239,0.6)'),
      borderBottom: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      color: 'text.primary',
    }}>
      <Toolbar>
        <MovieIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component={Link} to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontFamily: "'Sora','Inter',sans-serif", fontWeight: 700 }}>
          Movie Explorer
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/favorites">Favorites</Button>
        </Box>
        <IconButton color="inherit" onClick={onToggleMode} aria-label="toggle theme">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        {user ? (
          <>
            <Typography variant="body2" sx={{ mx: 1, display: { xs: 'none', md: 'block' } }}>{user.email}</Typography>
            <Button color="inherit" onClick={() => { logout(); nav('/login'); }}>Logout</Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}
      </Toolbar>
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, pb: 1, justifyContent: 'center', gap: 1 }}>
        <Button color="inherit" size="small" component={Link} to="/">Home</Button>
        <Button color="inherit" size="small" component={Link} to="/favorites">Favorites</Button>
      </Box>
    </AppBar>
  );
}
