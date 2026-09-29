// Full-screen movie backdrop with the login card floating over it
// like a popup. Backdrop is picked live from trending so it never
// goes stale; falls back to a still while that loads.
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Alert, Tabs, Tab, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTrending, discoverMovies } from '../api/tmdb';

const FALLBACK_DARK = 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg';
const FALLBACK_LIGHT = 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg';

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [backdrop, setBackdrop] = useState(FALLBACK_DARK);
  const theme = useTheme();
  const light = theme.palette.mode === 'light';

  // dark pulls a moody trending still, light pulls a bright animated
  // one so the whole page feels like a matinee poster
  useEffect(() => {
    const load = light
      ? discoverMovies({ genre: '16', rating: 0, page: 1, query: '' })
      : fetchTrending(1);
    load.then((d) => {
      const withBg = (d.results || []).filter((m) => m.backdrop_path);
      if (withBg.length) {
        const pick = withBg[Math.floor(Math.random() * Math.min(withBg.length, 8))];
        setBackdrop(`https://image.tmdb.org/t/p/original${pick.backdrop_path}`);
      } else {
        setBackdrop(light ? FALLBACK_LIGHT : FALLBACK_DARK);
      }
    }).catch(() => setBackdrop(light ? FALLBACK_LIGHT : FALLBACK_DARK));
  }, [light]);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (tab === 0) await login(email, password);
      else await register(email, password);
      nav(loc.state?.from || '/', { replace: true });
    } catch (err) { setError(err.message); }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', py: 5 }}>
      {/* entire-screen movie thumbnail */}
      <Box key={backdrop} className="kenburns" sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${backdrop})`,
        backgroundSize: 'cover', backgroundPosition: 'center 20%',
      }} />
      <Box sx={{
        position: 'absolute', inset: 0,
        background: (t) => t.palette.mode === 'dark'
          ? 'linear-gradient(180deg, rgba(5,6,10,0.55), rgba(5,6,10,0.82))'
          : 'linear-gradient(180deg, rgba(250,246,239,0.55), rgba(250,246,239,0.88))',
        backdropFilter: 'blur(2px)',
      }} />
      {/* popup card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{ position: 'relative', width: 'min(430px, calc(100vw - 32px))' }}
      >
        <Card sx={{
          backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(20,24,36,0.78)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(18px)',
          border: (t) => `1px solid ${t.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: 12,
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>Movie Explorer</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>Log in to continue to the show.</Typography>
            <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} sx={{ mb: 2 }}>
              <Tab label="Login" /><Tab label="Register" />
            </Tabs>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={submit} display="flex" flexDirection="column" gap={2}>
              <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} helperText="At least 6 characters" />
              <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" variant="contained" size="large" fullWidth>{tab === 0 ? 'Login' : 'Create account'}</Button>
              </motion.span>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
